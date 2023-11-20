import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @Output() tabSelected: EventEmitter<string> = new EventEmitter<string>();
  selectedTab: string = 'Chats';

  onTabSelected(title: string) {
    this.tabSelected.emit(title);
    this.selectedTab = title;
  }
}
