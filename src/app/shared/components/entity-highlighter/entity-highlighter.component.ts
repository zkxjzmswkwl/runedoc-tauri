import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { HighlightService } from '../../services/highlight.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HighlightedEntity } from '../../state/highlight.feature';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { queuePacket } from '../../../icp-events/events';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-entity-highlighter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, BadgeModule, CommonModule, AsyncPipe],
  templateUrl: './entity-highlighter.component.html',
  styleUrl: './entity-highlighter.component.css'
})
export class EntityHighlighterComponent implements OnInit {
  toEntityRow(e: HighlightedEntity): any {
    return {
      data: e,
      children: [],
    };
  }
  private readonly highlightService = inject(HighlightService);
  private readonly destroyRef = inject(DestroyRef);
  entities: any[] = [];
  newEntity = new FormControl("", { nonNullable: true });

  ngOnInit() {
    this.highlightService.queryEntities();
    this.highlightService.targetEntities$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(entities => {
        this.entities = entities;
        console.log(this.entities);
        
      });
  }

  addEntity() {
    queuePacket('_specpl_', 'highlight', 'addEntity', this.newEntity.value!);
  }
}
