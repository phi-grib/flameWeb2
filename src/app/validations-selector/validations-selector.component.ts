import { Component, Input, OnInit } from '@angular/core';
import { Model } from '../Globals';

@Component({
  selector: 'app-validations-selector',
  templateUrl: './validations-selector.component.html',
  styleUrls: ['./validations-selector.component.css']
})
export class ValidationsSelectorComponent implements OnInit {

  @Input() name;
  @Input() version;

  constructor(public model: Model) { }

  ngOnInit(): void {
  }

}
