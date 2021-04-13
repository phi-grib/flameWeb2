import { Component, Input } from '@angular/core';
import { Model, Curation } from '../Globals';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.css']
})

export class ValidationsComponent {

  @Input() name;
  @Input() version;
  @Input() curationName;

  constructor(public model: Model, public curation: Curation) { }

}
