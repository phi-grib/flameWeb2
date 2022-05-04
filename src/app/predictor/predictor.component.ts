import { Component, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import { Prediction, Model, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { PredictorService } from './predictor.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Renderer2 } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit {

  // @ViewChildren('cmp') components: QueryList<ElementRef>;

  objectKeys = Object.keys;
  models: {};
  modelName = '';
  version = '0';
  predictName = '';
  sketchName = 'sketched_mol';
  inputListName = 'input_list';
  file = undefined;
  isvalid = false;
  isvalidSketch = true;
  isvalidSeries = true;
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

  basket_list = [];
  basket_newest = undefined;
  basket_selected = undefined;
  compound_list = [];

  ngOnInit() {

    if (this.model.input_type != 'data') {
      // inject into the HTML code these two scripts required by JSME
      const jsme_script = this.renderer2.createElement('script');
      jsme_script.type = 'text/javascript';
      jsme_script.src = 'assets/jsme/jsme.nocache.js';
      jsme_script.text = ``;
      this.renderer2.appendChild(document.body, jsme_script);
  
      const jsme_init = this.renderer2.createElement('script');
      jsme_init.type = 'text/javascript';
      // jsme_init.src = 'assets/jsme/init.js';
      jsme_init.src = 'assets/jsme/initQuery.js';
      jsme_init.text = ``;
      this.renderer2.appendChild(document.body, jsme_init);
    }

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

    this.refresh_list();

    const here = this;
    $('#collapseTwo').on('shown.bs.collapse', function () {
      here.show_basket();
    });
    $('#basket-list').on('change', function () {
      here.show_basket();
    });


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

  sketchNameChange() {
    this.isvalidSketch = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.sketchName.match(letters)) || this.sketchName=='') {
      this.isvalidSketch = false;
    }
  }

  seriesNameChange() {
    this.isvalidSeries = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.inputListName.match(letters)) || this.inputListName=='') {
      this.isvalidSeries = false;
    }
  }


  predict_structure () {
    var span = document.getElementById("molclipboard");
    var smiles = span.innerText;

    if (smiles===''){
      alert('no molecule entered!')
      return;
    }

    this.activeModal.close('Close click');
    // console.log(smiles);

    if (this.modelName != '') {
      const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
        disableTimeOut: true, positionClass: 'toast-top-right'});
      
      this.prediction.predicting[this.predictName] = [this.modelName, this.version, this.sketchName];

      this.service.predict_smiles(this.modelName, this.version, smiles, this.predictName, this.sketchName).subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.checkPrediction(this.predictName, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
              delete this.prediction.predicting[this.predictName];
              $('#dataTablePredictions').DataTable().destroy();
              this.func.getPredictionList();
            }
            iter += 1;
          }, 2000);
        },
        error => {
          this.toastr.clear(inserted.toastId);
          delete this.prediction.predicting[this.predictName];
          $('#dataTablePredictions').DataTable().destroy();
          this.func.getPredictionList();
          alert('Error processing input molecule: '+error.error.error);
        }
      );
    }
    else {
      alert('Model name undefined!')
    }

  }

  predict_list() {
    this.activeModal.close('Close click');

    if (this.compound_list.length==0) {
      const item = parseInt(this.basket_selected.substring(0,1))
      this.service.getBasket(item).subscribe (
        result => {
          this.compound_list = result.compounds;
        }
      );
    }

    if (this.modelName == '') {
      alert('Model name undefined!');
      return;
    }
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictName , {
      disableTimeOut: true, positionClass: 'toast-top-right'});
    
    this.prediction.predicting[this.predictName] = [this.modelName, this.version, this.inputListName];

    this.service.predict_smiles_list(this.modelName, this.version, this.compound_list, this.predictName, this.inputListName).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 500) {
            this.checkPrediction(this.predictName, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                  timeOut: 10000, positionClass: 'toast-top-right'});
            delete this.prediction.predicting[this.predictName];
            $('#dataTablePredictions').DataTable().destroy();
            this.func.getPredictionList();
          }
          iter += 1;
        }, 2000);
      },
      error => {
        this.toastr.clear(inserted.toastId);
        delete this.prediction.predicting[this.predictName];
        $('#dataTablePredictions').DataTable().destroy();
        this.func.getPredictionList();
        alert('Error processing input molecule: '+error.error.error);
      }
    );
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
            if (iter < 500) {
              this.checkPrediction(this.predictName, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Prediction ' + this.predictName + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
              delete this.prediction.predicting[this.predictName];
              $('#dataTablePredictions').DataTable().destroy();
              this.func.getPredictionList();
            }
            iter += 1;
          }, 2000); // every two seconds
        },
        error => {
          this.toastr.clear(inserted.toastId);
          delete this.prediction.predicting[this.predictName];
          $('#dataTablePredictions').DataTable().destroy();
          this.func.getPredictionList();
          alert('Error prediction: '+error.error.error);
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

        if (result['aborted']) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error("Prediction \"" + name + "\" task has not completed. Check the browser console for more information", 
            'Aborted', {timeOut: 10000, positionClass: 'toast-top-right'});
          console.log('ERROR report produced by prediction task ', name);
          console.log(result['aborted']);
          clearInterval(intervalId);
          delete this.prediction.predicting[this.predictName];
          $('#dataTablePredictions').DataTable().destroy();
          this.func.getPredictionList();
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
          $('#dataTablePredictions').DataTable().destroy();
          this.func.getPredictionList();
        }
      },
      error => { 
        this.toastr.clear(inserted.toastId);
        this.toastr.error('Prediction ' + name + ' \n '  + error.error.message , 'ERROR!', {
          timeOut: 10000, positionClass: 'toast-top-right'});
        clearInterval(intervalId);
        delete this.prediction.predicting[this.predictName];
        $('#dataTablePredictions').DataTable().destroy();
        this.func.getPredictionList();
      }
    );
  }

  show_basket () {

    // if no basket is present
    if (this.basket_selected == undefined) {
      return;
    }

    const item = parseInt(this.basket_selected.substring(0,1))

    this.service.getBasket(item).subscribe (
      result => {
        var tbl = <HTMLTableElement>document.getElementById('tableInputList');
        
        for(var i = 0;i<tbl.rows.length;){
          tbl.deleteRow(i);
        }

        this.compound_list = result.compounds;
        const sel_options = {'width': 200, 'height': 125};
        const smilesDrawerInputList = new SmilesDrawer.Drawer(sel_options);   
        
        var ismiles = '';
        var canvasid = '';
        var seq = 1;
        this.compound_list.forEach(function(compound) {
            ismiles = compound.smiles;
            canvasid = 'inputlist'+seq;
          
            const tr = tbl.insertRow(); 

            const tdname = tr.insertCell();
            tdname.appendChild(document.createTextNode(compound.name));
            tdname.setAttribute('class', 'align-middle text-center')
            
            const tdsmiles = tr.insertCell();
            tdsmiles.setAttribute('class', 'align-middle text-center' );
            const icanvas = document.createElement('canvas');

            tdsmiles.appendChild(icanvas);
            icanvas.setAttribute('id', canvasid);
            
            SmilesDrawer.parse(ismiles, 
              function(tree) {
                smilesDrawerInputList.draw(tree, canvasid, 'light', false);
              }, 
              function (err) {
                console.log(err);
              }
            );
            seq+=1;

        });
      
      }
    );
  }

  refresh_list () {
    this.service.getBasketList().subscribe (
        result => {
            const raw_list = result['basket_list'];
            this.basket_newest = result['newest'];
            this.basket_list = [];
            for (const line of raw_list) {
               const linestr = line[0] + '\xa0\xa0\xa0\xa0\xa0\xa0date:' + line[1] + '\xa0\xa0\xa0\xa0\xa0\xa0compounds:' + line[2] + '\xa0\xa0\xa0\xa0\xa0\xa0user:' + line[3]; 
               this.basket_list.push(linestr);
            }
            this.basket_selected = this.basket_list[this.basket_newest]; 
        },
        error => {
            alert ('unable to get input lists!')
        }
    );
  }



} 
