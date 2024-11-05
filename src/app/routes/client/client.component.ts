import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  SilhouetteControllerComponent,
} from '../../shared/components/silhouette-controller/silhouette-controller.component';
import { EntityHiderComponent } from '../../shared/components/entity-hider/entity-hider.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SilhouetteControllerComponent, EntityHiderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
}
