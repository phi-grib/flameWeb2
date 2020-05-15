import { Component, OnInit } from '@angular/core';
import { ModelListService } from './model-list.service';
import { Model, Prediction, Globals } from '../Globals';
import { CommonFunctions } from '../common.functions';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  constructor(private service: ModelListService,
    public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions) {}

  models: Array<any>;
  objectKeys = Object.keys;

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.func.getModelList();
  }

  selectModel(name: string, version: string, trained: boolean, type: string, quantitative: boolean,
      conformal: boolean, ensemble: boolean, error: any) {
      this.func.selectModel(name, version, trained, type, quantitative, conformal, ensemble, error );
  }

}
