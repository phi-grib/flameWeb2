import { Component, OnInit } from '@angular/core';
import { Model } from '../Globals';
import { BuilderService } from './builder.service';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctions } from '../common.functions';
import {saveAs} from 'file-saver';
import 'datatables.net-bs4';
import 'datatables.net-select-bs4';
declare var $: any;

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit {

  constructor(public model: Model,
    private service: BuilderService,
    private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public func: CommonFunctions) { }



  //code to execute when the page is loaded
  ngOnInit() {
    this.getParameters();
  }

  //extrats the parameters from the model
  getParameters(): void {
    this.commonService.getParameters(this.model.name, this.model.version).subscribe(
      result => {
        this.model.parameters = result;

        // old models store conformal confidence as conformal significance. Try path tries to provide
        // back compatibility re-assigning the value
        if (this.model.parameters.hasOwnProperty('conformalSignificance')) {

          // deep copy conformalSignificance to conformalConfidence
          this.model.parameters['conformalConfidence'] = JSON.parse(JSON.stringify(this.model.parameters['conformalSignificance']));
          this.model.parameters.conformalConfidence.value = 1.0 - this.model.parameters.conformalSignificance.value;
          this.model.parameters.conformalConfidence.description = 'Conformal estimator confidence (from 0 to 1)';
          delete(this.model.parameters['conformalSignificance']);
        } 
      },
      error => {
        alert(error.status + ' : ' + error.statusText);
      }
    );
  }

  //returns ture if v is a dictionary
  private isDict(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
  }


  //reads all the targeted fields in dictionary at all levels, returns a new dictionary with those values
  private recursiveDelta(dict_in: {}) {
    let dict_aux = {};
    const dict_out = {};
    for (const key of Object.keys(dict_in)) {
      dict_aux = dict_in[key];
      for (const key2 of Object.keys(dict_aux)) {
        if (key2 === 'value') {
          if (this.isDict(dict_aux[key2])) {
            dict_out[key] = this.recursiveDelta(dict_aux[key2]);
          } else {
            if (dict_aux[key2] === '' || dict_aux[key2] === 'null') {
              dict_aux[key2] = null;
            }
            dict_out[key] = dict_aux[key2];
          }
        }
      }
    }
    return dict_out;
  }

  //builds a model using the parameters in this.model.parameters
  buildModel(name, version): void {
    this.model.delta = {};
    this.model.delta = this.recursiveDelta(this.model.parameters);
    // console.log(this.model.delta);

    this.model.listModels[name + '-' + version] = {
      name: name, version: version, trained: false, numMols: '-',
      variables: '-', type: '-', quality: {}, quantitative: false, conformal: false, ensemble: false
    };

    this.model.trainig_models.push(name + '-' + version);

    this.model.modelID = undefined;

    const inserted = this.toastr.info('Building', 'Model ' + name + '.v' + version, {
      disableTimeOut: true, positionClass: 'toast-top-right'
    });

    this.activeModal.close('Close click');


    this.service.buildModel().subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 500) {
            this.checkModel(name, version, inserted, intervalId);
          } else {
            clearInterval(intervalId);
            const index = this.model.trainig_models.indexOf(name + '-' + version, 0);
            if (index > -1) {
              this.model.trainig_models.splice(index, 1);
            }

            this.toastr.clear(inserted.toastId);
            this.toastr.warning('Model ' + name + '.v' + version + ' \n ', 'Interactive timeout exceeded, check latter...', {
              timeOut: 10000, positionClass: 'toast-top-right'
            });
          }
          iter += 1;
        }, 2000);
      },
      error => {
        $('#dataTableModels').DataTable().destroy();
        const index = this.model.trainig_models.indexOf(name + '-' + version, 0);
        if (index > -1) {
          this.model.trainig_models.splice(index, 1);
        }
        this.model.listModels[name + '-' + version].trained = false;
        this.toastr.clear(inserted.toastId);
        this.toastr.error('Model ' + name + '.v' + version + ' \n ' + error.error, 'ERROR!', {
          timeOut: 10000, positionClass: 'toast-top-right'
        });
        this.func.getModelList();
      }
    );
    this.router.navigate(['/models']);
  }

  // Periodic function to check model
  checkModel(name, version, inserted, intervalId) {
    this.commonService.getModel(name, version).subscribe(
      result => {

        $('#dataTableModels').DataTable().destroy();

        const dict_info = {};
        for (const aux of result) {
          dict_info[aux[0]] = aux[2];
        }
        const quality = {};
        for (const info of (Object.keys(dict_info))) {
          if (typeof (dict_info[info]) === 'number') {
            quality[info] = parseFloat(dict_info[info].toFixed(3));
          }
        }
        this.model.trained_models.push(name + ' .v' + version);

        const index = this.model.trainig_models.indexOf(name + '-' + version, 0);
        if (index > -1) {
          this.model.trainig_models.splice(index, 1);
        }
        this.toastr.clear(inserted.toastId);

        this.model.listModels[name + '-' + version] = {
          name: name, version: version, modelID: dict_info['modelID'], trained: true,
          numMols: dict_info['nobj'], variables: dict_info['nvarx'], type: dict_info['model'], quality: quality,
          quantitative: dict_info['quantitative'], conformal: dict_info['conformal'], ensemble: dict_info['ensemble']
        };

        this.model.trained_models.push(name + ' .v' + version);
        this.toastr.success('Model ' + name + '.v' + version + ' created', 'MODEL CREATED', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });

        // use the following code to make sure the new model list will show the model
        // const a = Object.keys(this.model.listModels).sort();
        // var modelIndex = a.indexOf(name+'-'+version);
        // this.model.page = Math.floor(modelIndex/this.model.pagelen);

        this.model.name = name;
        this.model.version = version;
        this.func.getModelList();
        clearInterval(intervalId);

      },
      error => { // CHECK what type of error
        if (error.error.code !== 0) {
          $('#dataTableModels').DataTable().destroy();
          const index = this.model.trainig_models.indexOf(name + '-' + version, 0);
          if (index > -1) {
            this.model.trainig_models.splice(index, 1);
          }
          this.model.listModels[name + '-' + version].trained = false;
          this.toastr.clear(inserted.toastId);
          this.toastr.error('Model ' + name + '.v' + version + ' \n ' + error.error.message, 'ERROR!', {
            timeOut: 10000, positionClass: 'toast-top-right'
          });
          clearInterval(intervalId);

          this.func.getModelList();
        }
      }
    );
  }

  updateFromFile(event) {
    if (event.target.files.length !== 1) {
      console.error('No file selected');
    } else {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.model.delta = reader.result.toString(); // copy the YAML to this.model.delta
        this.service.getParametersFromYAML(this.model.name, this.model.version).subscribe(
          result => {
            this.model.parameters = result;
          },
          error => {
            alert('Error updating parameters');
          }
        );
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  downloadParams() {
    // generate a delta with current settings in the dialogue
    this.model.delta = this.recursiveDelta(this.model.parameters);
    this.service.getYAMLfromParameters(this.model.name, this.model.version).subscribe(
      result => {
        let text: string = '';
        for (const x in result) {
          text = text + result[x] + '\n';
        }
        let blob = new Blob([text], { type: "text/plain;charset=utf-8" })
        saveAs(blob, this.model.name + '.yaml');
      },
      error => {
        alert('Error downloading parameters');
      }
    );
  }
}
