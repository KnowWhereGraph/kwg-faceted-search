import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  floatLabelControl = new FormControl('auto');
  @Input() selectedTabIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }
}
