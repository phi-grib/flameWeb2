import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction, Profile } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
declare var $: any;
@Component({
  selector: 'predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.css']
})
export class PredictButtonComponent implements OnInit {
  objectKeys = Object.keys;
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  predictName: string = '';
  isvalidPrediction: boolean = false;
  predictionsNames = {};
  predictions = undefined;
  

  constructor(
    public commonService: CommonService,
    public compound: Compound,
    private commonFunc: CommonFunctions,
    private service: PredictorService,
    public prediction: Prediction,
    public model: Model,
    public profile: Profile,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.defaultPredictionName();
    this.commonService.defaultName$.subscribe(()=> {
      this.defaultPredictionName();
    })
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
  }
  selectOption() {
    if (this.compound.input_file) {
       this.predict();
    }
    if (this.compound.sketchstructure) {
      this.predictStructure();
    }
    if (this.compound.input_list) {
      this.predictInputList();
    }
  }
  defaultPredictionName(){
    this.service.getPredictionList().subscribe(
      result => {
        if(result[0]){
          this.predictions = result[1]
        }
      }
    )
    setTimeout(() => {
      for (const name of this.predictions) {
        this.predictionsNames[name[0]] = true;
      }
      let i=1;
      let nameFound = false;
      while (!nameFound) {
        let istr = i.toString().padStart(4,'0');
        this.predictName = 'Prediction_' + istr;
        let keyFound = false;
        for (const ikey of this.objectKeys(this.predictionsNames)) {
          if (ikey.startsWith(this.predictName)) {
            keyFound=true;
          }
        }
        if (!keyFound){
          nameFound = true;
          this.isvalidPrediction = true;
        }
        i=i+1;
      }
    }, 200);
  }
  predictNameChange() {
    this.isvalidPrediction = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.predictName.match(letters)) || this.predictName in this.predictionsNames || this.predictName.startsWith('ensemble')) {
      this.isvalidPrediction = false;
    }
    for (const ikey of this.objectKeys(this.predictionsNames)) {
      if (ikey.startsWith(this.predictName)) {
        this.isvalidPrediction = false;
      }
    }
  }

  predict(){
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
      disableTimeOut: true, positionClass: 'toast-top-right'});
    this.service.predict(this.model.name, this.model.version,this.compound.input_file['result'], this.predictName).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 500) {
            // this.checkPrediction(this.predictName, inserted, intervalId);
            this.checkPrediction(result, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                  timeOut: 10000, positionClass: 'toast-top-right'});
            delete this.prediction.predicting[this.predictName];
          }
          iter += 1;
        }, 2000); // every two seconds
      },
      error => {
        this.toastr.clear(inserted.toastId);
        delete this.prediction.predicting[this.predictName];
        alert('Error prediction: '+error.error.error);
      }
    );
  }

  predictInputList(){
    
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
      disableTimeOut: true, positionClass: 'toast-top-right'});

    this.service.predict_smiles_list(this.model.name, this.model.version,this.compound.input_list['result'], this.predictName, this.compound.input_list['name']).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 500) {
            // this.checkPrediction(this.predictName, inserted, intervalId);
            this.checkPrediction(result, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                  timeOut: 10000, positionClass: 'toast-top-right'});
            delete this.prediction.predicting[this.predictName];
          }
          iter += 1;
        }, 2000);
      },
      error => {
        this.toastr.clear(inserted.toastId);
        delete this.prediction.predicting[this.predictName];
        alert('Error processing input molecule: '+error.error.error);
      }
    );

  }

  predictStructure(){

    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
      disableTimeOut: true, positionClass: 'toast-top-right'});
  
    this.service.predict_smiles(this.model.name, this.model.version, this.compound.sketchstructure['result'], this.predictName,this.compound.sketchstructure['name']).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 500) {
            // this.checkPrediction(this.predictName, inserted, intervalId);
            this.checkPrediction(result, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                  timeOut: 10000, positionClass: 'toast-top-right'});
            delete this.prediction.predicting[this.predictName];
          }
          iter += 1;
        }, 2000);
      },
      error => {
        this.toastr.clear(inserted.toastId);
        delete this.prediction.predicting[this.predictName];
        alert('Error processing input molecule: '+error.error.error);
      }
    );

  }

  checkPrediction(name, inserted, intervalId) {
    this.commonService.getPrediction(name).subscribe(
      result => {
        if (result['aborted']) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error("Prediction \"" + name + "\" task has not completed. Check the browser console for more information", 
            'Aborted', {timeOut: 10000, positionClass: 'toast-top-right'});
          console.log('ERROR report produced by prediction task ', name);
          console.log(result['aborted']);
          clearInterval(intervalId);
          delete this.prediction.predicting[this.predictName];
          this.commonFunc.getPredictionList();
          return;
        }

        if (!result ['waiting']) {
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
          this.commonFunc.getPredictionList();
          //name for the next prediction 
          this.defaultPredictionName();
          
        }
      },
      error => { 
        this.toastr.clear(inserted.toastId);
        this.toastr.error('Prediction ' + name + ' \n '  + error.error.message , 'ERROR!', {
          timeOut: 10000, positionClass: 'toast-top-right'});
        clearInterval(intervalId);
        delete this.prediction.predicting[this.predictName];
        this.commonFunc.getPredictionList();
      }
    );
  }
}
