import { Component, OnInit, OnChanges } from '@angular/core';
import { Prediction, Model } from '../Globals';
import { CommonService } from '../common.service';
import { PredictorService } from './predictor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit, OnChanges {

  objectKeys = Object.keys;
  models: {};
  modelName = 'Model1';
  predictName = '';
  version = '0';
  file: any;
  isvalid = false;
  predictionsNames = {};
  constructor(public service: PredictorService,
              private router: Router,
              private commonService: CommonService,
              public activeModal: NgbActiveModal,
              public prediction: Prediction,
              public model: Model,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.models = {};
    this.getModelList();
    for (const name of this.prediction.predictions) {
      this.predictionsNames[name[0]] = true;
      }
  }
  public change(fileList: FileList): void {
    const file = fileList[0];
    this.file = file;
  }

  predictNameChange() {
    this.isvalid = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.predictName.match(letters)) || this.predictName in this.predictionsNames) { 
      this.isvalid = false;
    }
  }

  getModelList() {

    this.commonService.getModelList().subscribe(
        result => {
          // result = JSON.parse(result[1]);
          for (const model of result) {
            const modelName = model.text;
            for ( const versionInfo of model.nodes) {
              let version = versionInfo.text;
              // CAST VERSION
              version = version.replace('ver', '');
              version = (version === 'dev') ? '0' : version;
              version = Number(version);
              // INFO OF EACH MODEL
              this.commonService.getModel(modelName, version).subscribe(
                result2 => {
                  if (!(modelName in  this.models)) {
                    this.models[modelName] = [];
                  }
                  this.models[modelName].push(version);
                }
              );
            }
          }
        }
    );
  }

  getPredictionList() {
    this.commonService.getPredictionList().subscribe(
        result => {
          this.prediction.predictions = result;
          // const table = $('#dataTable').DataTable();
        },
        error => {
          alert(error.message);
        }
    );
  }

  ngOnChanges() {
    $('#options a:first-child').tab('show'); // Select first tab
  }

  predict() {
    this.activeModal.close('Close click');
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
      disableTimeOut: true, positionClass: 'toast-top-right'});
    this.prediction.predicting[this.predictName] = [this.modelName, this.version, this.file.name];

    this.service.predict(this.modelName, this.version, this.file, this.predictName).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 15) {
            this.checkPrediction(this.predictName, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(inserted.toastId);
            this.toastr.error( 'Prediction ' + name + ' \n ' , 'ERROR!', {
            timeOut: 10000, positionClass: 'toast-top-right'});
          }
          iter += 1;
        }, 10000);
      },
      error => {
        alert('Error prediction');
      }
    );
  }

   // Periodic function to check model
   checkPrediction(name, inserted, intervalId) {
    this.commonService.getPrediction(name).subscribe(
      result => {
        alert('Acaboooo');
        this.toastr.clear(inserted.toastId);
        this.toastr.success('Prediction ' + name + ' created' , 'PREDICTION CREATED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
        clearInterval(intervalId);
        this.getPredictionList();
      },
      error => { // CHECK MAX iterations
        alert('Nooooooo');
      }
    );
  }
}
