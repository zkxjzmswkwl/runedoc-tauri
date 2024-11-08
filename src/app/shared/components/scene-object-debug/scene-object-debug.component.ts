import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { SceneobjectsService } from '../../services/sceneobjects.service';
import { queuePacket } from '../../../icp-events/events';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { SceneObject } from '../../../models/sceneobject';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { RippleModule } from 'primeng/ripple';


@Component({
  selector: 'app-scene-object-debug',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [FormsModule, ButtonModule, TreeTableModule, UpperCasePipe, RippleModule],
  templateUrl: './scene-object-debug.component.html',
  styleUrl: './scene-object-debug.component.css'
})
export class SceneObjectDebugComponent {
  private readonly sceneObjectsService = inject(SceneobjectsService);
  private readonly destroyRef = inject(DestroyRef);
  readonly sceneObjects$ = this.sceneObjectsService.sceneObjects$;
  sceneObjects: TreeNode[] = [];

  ngOnInit() {
    this.sceneObjectsService.sceneObjects$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(objs => {
        this.sceneObjects = objs.map(s => this.toTreeNode(s));
      });
  }

  queryScene() {
    queuePacket('req', 'sceneobjects', '');
  }

  private toTreeNode(s: SceneObject): any {
    return {
      data: s,
      children: [],
    };
  }
}
