import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  SilhouetteControllerComponent,
} from '../../shared/components/silhouette-controller/silhouette-controller.component';
import { EntityHiderComponent } from '../../shared/components/entity-hider/entity-hider.component';
import { SceneObjectDebugComponent } from "../../shared/components/scene-object-debug/scene-object-debug.component";
import { EntityHighlighterComponent } from "../../shared/components/entity-highlighter/entity-highlighter.component";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SilhouetteControllerComponent, EntityHiderComponent, SceneObjectDebugComponent, EntityHighlighterComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
}
