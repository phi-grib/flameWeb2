import { Component, OnInit } from '@angular/core';
import { Prediction, Model, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { PredictorService } from './predictor.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Renderer2 } from '@angular/core';
// import 'jquery';
declare var $: any;


@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit {

  objectKeys = Object.keys;
  models: {};
  modelName = '';
  version = '0';
  predictName = '';
  file = undefined;
  isvalid = false;
  predictionsNames = {};
  constructor(public service: PredictorService,
              private commonService: CommonService,
              private func: CommonFunctions,
              private renderer2: Renderer2,
              public activeModal: NgbActiveModal,
              public prediction: Prediction,
              public model: Model,
              public globals: Globals,
              private toastr: ToastrService) { }

  ngOnInit() {

    // inject into the HTML code these two scripts required by JSME
    const jsme_script = this.renderer2.createElement('script');
    jsme_script.type = 'text/javascript';
    jsme_script.src = 'assets/jsme/jsme.nocache.js';
    jsme_script.text = ``;
    this.renderer2.appendChild(document.body, jsme_script);

    const jsme_init = this.renderer2.createElement('script');
    jsme_init.type = 'text/javascript';
    jsme_init.src = 'assets/jsme/init.js';
    jsme_init.text = ``;
    this.renderer2.appendChild(document.body, jsme_init);

    for (const name of this.prediction.predictions) {
      this.predictionsNames[name[0]] = true;
    }

    let i=1;
    let nameFound = false;
    while (!nameFound) {
      this.predictName = 'Prediction_' + i;
      if (!this.objectKeys(this.predictionsNames).includes(this.predictName)) {
        nameFound = true;
        this.isvalid = true;
      }
      i=i+1;
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

  predict_structure () {
    var span = document.getElementById("molclipboard");
    var smiles = span.innerText;

    this.activeModal.close('Close click');
    // console.log(smiles);

    if (this.modelName != '') {
      const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
        disableTimeOut: true, positionClass: 'toast-top-right'});
      this.prediction.predicting[this.predictName] = [this.modelName, this.version, 'edited mol'];

      this.service.predict_smiles(this.modelName, this.version, smiles, this.predictName).subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 30) {
              this.checkPrediction(this.predictName, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Prediction ' + name + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
              delete this.prediction.predicting[this.predictName];
              $('#dataTablePredictions').DataTable().destroy();
              this.func.getPredictionList();
            }
            iter += 1;
          }, 2500);
        },
        error => {
          alert('Error prediction');
        }
      );
    }
    else {
      alert('Model name undefined!')
    }

  }

  predict() {
    this.activeModal.close('Close click');
    if (this.modelName != '') {
      const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
        disableTimeOut: true, positionClass: 'toast-top-right'});
      this.prediction.predicting[this.predictName] = [this.modelName, this.version, this.file.name];

      this.service.predict(this.modelName, this.version, this.file, this.predictName).subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 30) {
              this.checkPrediction(this.predictName, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Prediction ' + name + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
              delete this.prediction.predicting[this.predictName];
              $('#dataTablePredictions').DataTable().destroy();
              this.func.getPredictionList();
            }
            iter += 1;
          }, 2500);
        },
        error => {
          alert('Error prediction');
        }
      );
    }
    else {
      alert('Model name undefined!')
    }
  }

   // Periodic function to check model
   checkPrediction(name, inserted, intervalId) {
    this.commonService.getPrediction(name).subscribe(
      result => {
        // console.log(result);
        this.toastr.clear(inserted.toastId);
        if (result['error']){
          this.toastr.warning('Prediction ' + name + ' finished with error ' + result['error'] , 'PREDICTION COMPLETED', {
            timeOut: 5000, positionClass: 'toast-top-right'});
            
        }
        else {
           this.toastr.success('Prediction ' + name + ' created' , 'PREDICTION COMPLETED', {
            timeOut: 5000, positionClass: 'toast-top-right'});
        }
        clearInterval(intervalId);
        delete this.prediction.predicting[this.predictName];
        $('#dataTablePredictions').DataTable().destroy();
        this.func.getPredictionList();
      },
      error => { // CHECK MAX iterations
        if (error.error.code !== 0) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error(  'Prediction ' + name + ' \n '  + error.error.message , 'ERROR!', {
            timeOut: 10000, positionClass: 'toast-top-right'});
          clearInterval(intervalId);
          delete this.prediction.predicting[this.predictName];
          $('#dataTablePredictions').DataTable().destroy();
          this.func.getPredictionList();
        }
      }
    );
  }
}
