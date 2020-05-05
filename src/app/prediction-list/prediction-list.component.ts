import { Component, OnInit} from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { Model, Prediction, Globals } from '../Globals';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-prediction-list',
  templateUrl: './prediction-list.component.html',
  styleUrls: ['./prediction-list.component.css']
})
export class PredictionListComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(private func: CommonFunctions,
              public globals: Globals,
              public prediction: Prediction,
              private model: Model) {}

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.model.trained = false;
    this.func.getPredictionList();
  }

  selectPrediction(name: string, modelName: string, modelVersion: string, date: any) {
    this.prediction.name = name;
    this.prediction.modelName = modelName;
    this.prediction.modelVersion = modelVersion;
    this.prediction.date = date;
  }

}
