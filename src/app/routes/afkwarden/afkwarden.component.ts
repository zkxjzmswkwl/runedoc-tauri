import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { AfkwardenService } from '../../shared/services/afkwarden.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { queuePacket } from '../../icp-events/events';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WatchedMessage } from '../../shared/state/afkwarden.feature';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-afkwarden',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [ButtonModule, InputTextModule, TreeTableModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './afkwarden.component.html',
  styleUrl: './afkwarden.component.css'
})
export class AfkwardenComponent implements OnInit {
  private readonly wardenService = inject(AfkwardenService);
  private readonly destroyRef = inject(DestroyRef);
  readonly messages$ = this.wardenService.messages$;
  newMessage = new FormControl("", { nonNullable: false });
  messages: TreeNode[] = [];

  ngOnInit(): void {
    this.wardenService.queryWatchedMessages();
    this.wardenService.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(messages => {
        this.messages = messages.map(m => this.toTreeNode(m));
      });

    interval(400)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        queuePacket('_specpl_', 'afkwarden', 'checkin');
      });
  }

  private toTreeNode(m: WatchedMessage): any {
    return {
      data: m,
      children: [],
    };
  }

  addMessage() {
    queuePacket('_specpl_', 'afkwarden', 'addWatchedMessage', this.newMessage.value!);
  }
}
