import { Component, Input } from '@angular/core';

export interface headerAds{
  name:string;
  svg:string
}
@Component({
  selector: 'app-promoted-tabs',
  templateUrl: './promoted-tabs.component.html',
  styleUrls: ['./promoted-tabs.component.scss'],
})

export class PromotedTabsComponent {
  selectedTabTitle: string = '';
  @Input() tabsHeader:headerAds[] = []

  selectedTab(tabTitle: string) {
    this.selectedTabTitle = tabTitle;
  }
}
