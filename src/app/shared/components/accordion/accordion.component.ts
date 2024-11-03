import { Component } from '@angular/core';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'accordion',
  styleUrls: ['./accordion.component.scss'],
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentComponent,
    HlmAccordionIconDirective,
    HlmIconComponent,
  ],
})
export class AccordionComponent {
}