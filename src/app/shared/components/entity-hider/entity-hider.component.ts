import { Component } from '@angular/core';
import { queuePacket } from '../../../icp-events/events';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-entity-hider',
  standalone: true,
  imports: [FormsModule, ButtonModule],
  templateUrl: './entity-hider.component.html',
  styleUrl: './entity-hider.component.css'
})
export class EntityHiderComponent {


  hideEntities() {
    queuePacket("req", "hideentities", "entity");
  }

  hideNpc() {
    queuePacket("req", "hideentities", "npc");
  }
}
