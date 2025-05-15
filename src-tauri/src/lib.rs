use std::sync::Arc;
use tauri::{async_runtime::spawn, AppHandle, Emitter, State};
use tokio::io::{AsyncReadExt, AsyncWriteExt, ReadHalf, WriteHalf};
use tokio::net::TcpStream;
use tokio::sync::{mpsc, Mutex};

struct PacketSender(Arc<Mutex<Option<mpsc::UnboundedSender<String>>>>);

#[tauri::command]
async fn start_tcp_listener(
    app_handle: AppHandle,
    packet_sender: State<'_, PacketSender>,
) -> Result<(), String> {
    println!("start_tcp_listener");

    let (packet_tx, mut packet_rx) = mpsc::unbounded_channel::<String>();

    {
        let mut sender_lock = packet_sender.0.lock().await;
        *sender_lock = Some(packet_tx);
    }

    spawn(async move {
        let addr = "127.0.0.1:6970";
        match TcpStream::connect(addr).await {
            Ok(stream) => {
                let (mut read_half, mut write_half) = stream.into_split();

                if let Err(e) = write_half.write_all(b"req:rsn<EOL>").await {
                    eprintln!("Failed to write initial message: {}", e);
                    return;
                }

                let send_task = {
                    spawn(async move {
                        while let Some(packet) = packet_rx.recv().await {
                            if let Err(e) = write_half.write_all(packet.as_bytes()).await {
                                eprintln!("Failed to send packet: {}", e);
                            }
                        }
                    })
                };

                let mut buffer = vec![0u8; 2048];
                loop {
                    match read_half.read(&mut buffer).await {
                        Ok(n) if n == 0 => break,
                        Ok(n) => {
                            let packet = String::from_utf8_lossy(&buffer[..n]).to_string();
                            if let Err(e) = app_handle.emit("packet_received", packet) {
                                eprintln!("Failed to emit packet: {}", e);
                            }
                        }
                        Err(e) => {
                            eprintln!("Failed to read from stream: {}", e);
                            break;
                        }
                    }
                }

                send_task.await.unwrap();
            }
            Err(e) => eprintln!("Failed to connect: {}", e),
        }
    });

    Ok(())
}

#[tauri::command]
async fn queue_outgoing_packet(
    packet: String,
    packet_sender: State<'_, PacketSender>,
) -> Result<(), String> {
    println!("{}", packet);
    let sender_lock = packet_sender.0.lock().await;
    if let Some(sender) = &*sender_lock {
        sender
            .send(packet)
            .map_err(|e| format!("Failed to enqueue packet: {}", e))
    } else {
        Err("Packet sender not initialized".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .manage(PacketSender(Arc::new(Mutex::new(None))))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            start_tcp_listener,
            queue_outgoing_packet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
