import { Component, Input } from '@angular/core';
import { Model } from '../Globals';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.css']
})

export class ValidationsComponent {

  @Input() name;
  @Input() version;

  constructor(public model: Model) { }

}
