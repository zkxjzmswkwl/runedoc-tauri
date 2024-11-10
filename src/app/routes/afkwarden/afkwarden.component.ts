import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { AfkwardenService } from '../../shared/services/afkwarden.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { queuePacket } from '../../icp-events/events';
import { interval, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WatchedMessage } from '../../shared/state/afkwarden.feature';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-afkwarden',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [ButtonModule, InputTextModule, TreeTableModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './afkwarden.component.html',
  styleUrl: './afkwarden.component.css',
})
export class AfkwardenComponent implements OnInit {
  private readonly wardenService = inject(AfkwardenService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly messages$ = this.wardenService.messages$.pipe(map(messages => messages.map(m => this.toTreeNode(m))));
  protected readonly newMessage = new FormControl('');

  ngOnInit(): void {
    // Uncommented to use localstorage for now...
    interval(400)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // why not? for now just query with checkin too.
        this.wardenService.queryWatchedMessages();
        queuePacket('_specpl_', 'afkwarden', 'checkin');
      });
  }

  private toTreeNode = (m: WatchedMessage) => ({
    data: m,
    children: [],
  });

  addMessage() {
    const message = this.newMessage.value;

    // .... if it's null who cares
    if (!message) {
      return;
    }

    this.wardenService.addMessage(message);
    this.newMessage.setValue(null, { emitEvent: false });
  }

  deleteAlert(message: WatchedMessage) {
    queuePacket('_specpl_', 'afkwarden', 'removeWatchedMessage', message.message);
  }
}
