import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from '../common.service';
import { ModelListService } from './model-list.service';
import { Model, Prediction, Globals } from '../Globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationsComponent} from '../validations/validations.component';
import 'jquery';
import { CommonFunctions } from '../common.functions';
// import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  constructor(private service: ModelListService,
    private commonService: CommonService,
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
    conformal: boolean, ensemble: boolean, error: any ) {

    if (version === '-' || version === 'dev') {
      version = '0';
    }
    this.model.name = name;
    this.model.version = version;
    this.model.trained = trained;
    this.model.conformal = conformal;
    this.model.quantitative = quantitative;
    this.model.ensemble = ensemble;
    this.model.error = error;
    this.model.file = undefined;
    this.model.file_info = undefined;
    this.model.file_fields = undefined;
    this.model.parameters = undefined;
  }

}
