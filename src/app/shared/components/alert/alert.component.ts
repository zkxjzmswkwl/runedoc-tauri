import { Component, Input } from '@angular/core';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    BrnAlertDialogTriggerDirective,
    HlmAlertDialogComponent,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    BrnAlertDialogContentDirective,
    HlmAlertDialogContentComponent,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() buttonText = 'Inject';
  @Input() alertHeader = 'Are you absolutely sure?';
  @Input({ required: true }) alertDesc!: string;
}
