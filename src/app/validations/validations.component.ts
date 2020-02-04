import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Model} from '../Globals';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.css']
})
export class ValidationsComponent implements OnInit, OnChanges {

  @Input() name;
  @Input() version;

  constructor(public model: Model,
              private commonService: CommonService) { }


  ngOnInit() {
    this.getParameters();
  }

  ngOnChanges(): void {
    this.getParameters();
  }

  getParameters(): void {
    this.commonService.getParameters(this.name, this.version).subscribe(
      result => {
        this.model.parameters = result;
      },
      error => {
        alert(error.status + ' : ' + error.statusText);
      }
    );
  }
}
