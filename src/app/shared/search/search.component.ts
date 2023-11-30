import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() placeholder = ''
  @Output() searchEmitter = new EventEmitter<string>();
  SearchContentFormControl: FormControl = new FormControl();
  searchInput: string = '';
  constructor(fb: FormBuilder) {}
  ngOnInit(): void {
    this.SearchContentFormControl.valueChanges.subscribe((value) => {
      this.searchEmitter.emit(value);
      this.searchInput = value;
    });
  }
  searchFunction() {
    this.searchEmitter.emit(this.searchInput);
  }
}
