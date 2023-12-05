import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() hasImage!: boolean;
  @Input() cancelIcon!: boolean;
  @Input() checkMarkIcon!: boolean;
  @Input() object!: unknown;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<any>();

  Cancel(cancel: boolean) {
    this.onCancel.emit(cancel);
  }
  AddFriendConfirm() {
   this.onConfirm.emit()
  }
}
