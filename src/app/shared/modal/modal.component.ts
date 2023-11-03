import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() modalTitle!: string;
  @Input() modalDescription!: string;
  @Input() isOpen!: boolean;
  @Output() onClose = new EventEmitter<void>();
}
