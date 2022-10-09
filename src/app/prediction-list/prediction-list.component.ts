import { Component, OnInit} from '@angular/core';
import { CommonFunctions } from '../common.functions';
<<<<<<< HEAD
import { Model, Prediction, Profile } from '../Globals';
=======
import { Model, Prediction, Globals, Profile } from '../Globals';
>>>>>>> ffc7105335b942b735ec448bc71d63d518853878
import 'datatables.net-bs4';
import { CommonService } from '../common.service';
declare var $: any;

@Component({
  selector: 'app-prediction-list',
  templateUrl: './prediction-list.component.html',
  styleUrls: ['./prediction-list.component.css']
})
export class PredictionListComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(private func: CommonFunctions,
              public prediction: Prediction,
              private model: Model,
              private profile: Profile,
<<<<<<< HEAD
              private service: CommonService,)
              {}
=======
              private service: CommonService) {}
>>>>>>> ffc7105335b942b735ec448bc71d63d518853878

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.model.trained = false;
    this.func.getPredictionList();
  }

  selectPrediction(name: string, modelName: string, modelVersion: string, date: any, modelID: string) {
    this.profile.summary = undefined
    this.profile.item = undefined;
    this.prediction.name = name;
    this.prediction.modelName = modelName;
    this.prediction.modelVersion = modelVersion;
    this.prediction.date = date;
    this.prediction.modelID = modelID;
    this.service.setPredictName(name);
    let closebtn = document.getElementById('headingPrediction')
    closebtn.click();
  }

}
