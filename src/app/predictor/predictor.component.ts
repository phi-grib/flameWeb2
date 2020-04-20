import { Component, OnInit } from '@angular/core';
import { Prediction, Model } from '../Globals';
import { CommonService } from '../common.service';
import { PredictorService } from './predictor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit {

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
    this.getModelListPredict();
    for (const name of this.prediction.predictions) {
      this.predictionsNames[name[0]] = true;
    }

    let i = 1;
    let nameFound = false;
    while (!nameFound) {
      this.predictName = 'Prediction_' + i;
      if (!this.objectKeys(this.predictionsNames).includes(this.predictName)) {
        nameFound = true;
        this.isvalid = true;
      }
      i = i + 1;
    }
  }
  public change(fileList: FileList): void {
    const file = fileList[0];
    this.file = file;
  }

  predictNameChange() {
    this.isvalid = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.predictName.match(letters)) || this.predictName in this.predictionsNames || this.predictName.startsWith('ensemble')) {
      this.isvalid = false;
    }
  }

  getModelListPredict() {

    this.commonService.getModelList().subscribe(
        result => {
          if (result[0]){

            for (const model of result[1]) {
              if (typeof(model.info) === 'object' ) {
                const modelName = model.modelname;
                if (!(modelName in  this.models)) {
                  this.models[modelName] = [];
                }
                if (model.info) {
                  this.models[modelName].push(model.version);
                }
              }
            }
          }
          else {
            alert(result[1]);
          }
        }
    );
  }

  getPredictionList() {
    this.commonService.getPredictionList().subscribe(
        result => {
          this.prediction.predictions = result;
          setTimeout(() => {
            const table = $('#dataTablePredictions').DataTable({
              /*Ordering by date */
              order: [[4, 'desc']],
              columnDefs: [{ 'type': 'date-euro', 'targets': 4 }]
            });
            this.prediction.name = $('#dataTablePredictions tbody tr:first td:first').text();
            this.prediction.modelName = $('#dataTablePredictions tbody tr:first td:eq(1)').text();
            this.prediction.modelVersion = $('#dataTablePredictions tbody tr:first td:eq(2)').text();
            this.prediction.date = $('#dataTablePredictions tbody tr:first td:eq(4)').text();
          }, 100);
        },
        error => {
          alert(error.message);
        }
    );
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
            this.toastr.error( 'Prediction ' + name + ' \n Time Out' , 'ERROR!', {
            timeOut: 10000, positionClass: 'toast-top-right'});
            delete this.prediction.predicting[this.predictName];
            $('#dataTablePredictions').DataTable().destroy();
            this.getPredictionList();
          }
          iter += 1;
        }, 5000);
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
        console.log(result);
        this.toastr.clear(inserted.toastId);
        this.toastr.success('Prediction ' + name + ' created' , 'PREDICTION CREATED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
        clearInterval(intervalId);
        delete this.prediction.predicting[this.predictName];
        $('#dataTablePredictions').DataTable().destroy();
        this.getPredictionList();
      },
      error => { // CHECK MAX iterations
        if (error.error.code !== 0) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error(  'Prediction ' + name + ' \n '  + error.error.message , 'ERROR!', {
            timeOut: 10000, positionClass: 'toast-top-right'});
          clearInterval(intervalId);
          delete this.prediction.predicting[this.predictName];
          $('#dataTablePredictions').DataTable().destroy();
          this.getPredictionList();
        }
      }
    );
  }
}
