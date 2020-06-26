import { Component } from '@angular/core';
import { Manager, Model, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { ManageModelService } from './manage-models.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuilderComponent} from '../builder/builder.component';
import { PredictorComponent} from '../predictor/predictor.component';
import { CommonFunctions } from '../common.functions';
declare var $: any;

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.css']
})
export class ManageModelsComponent {

  modelName: string;
  objectKeys = Object.keys;

  constructor(public manage: Manager,
              private commonService: CommonService,
              private modalService: NgbModal,
              public service: ManageModelService,
              public model: Model,
              public globals: Globals,
              private toastr: ToastrService,
              public func: CommonFunctions) { }


  buildModel(name: string, version: string) {
    const modalRef = this.modalService.open(BuilderComponent, {windowClass : 'modalClass'});
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.version = version;
    
  }

  /**
   * Creates a new model with the given name and informs the user with a toastr
   */
  createModel(): void {
    const letters = /^[A-Za-z0-9_]+$/;
    if (this.modelName.match(letters)) {
        this.service.createModel(this.modelName).subscribe(
          result => {
            // this.modelName = '';
            this.model.listModels = {};
            $('#dataTableModels').DataTable().destroy();
            this.model.name = this.modelName;
            this.model.version = 0;
            this.model.trained = false;
            this.func.getModelList();
            this.toastr.success('Model ' + result.modelName, 'CREATED', {
              timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
            });
          },
          error => {
              this.toastr.error(error.error.error, 'ERROR', {
                timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
              });
          }
        );
    } else {
        alert('Invalid name');
    }
  }

  labelModel() {
    const imodel = this.model.listModels[this.model.name+'-'+String(this.model.version)];
    let labelDelta = {
      maturity : imodel.maturity,
      type : imodel.bio_type,
      subtype : imodel.bio_subtype,
      endpoint : imodel.bio_endpoint,
      species : imodel.bio_species
    };
    let delta = JSON.stringify(labelDelta);
  
    this.service.updateLabels(this.model.name, this.model.version, delta).subscribe(
      result => {
        this.toastr.success('Model ' + this.model.name + '.v' + this.model.version , 'LABELS UPDATED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      },
      error => {
        alert('Error updating labels');
      }
    );

  }

  deleteModel() {

    this.service.deleteModel(this.model.name).subscribe(
      result => {
        this.toastr.success( 'Model ' + this.model.name + ' deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
        this.model.name = undefined ;
        this.model.version = undefined;
        this.func.getModelList();
      },
      error => {
        alert('Delete ERROR');
      }
    );
  }

  deleteVersion() {

    this.service.deleteVersion(this.model.name, this.model.version).subscribe(
      result => {
        this.toastr.success( 'Model ' + this.model.name + '.v' + this.model.version + ' deleted', 'DELETED', {
          timeOut: 4000, positionClass: 'toast-top-right'
        });
        $('#dataTableModels').DataTable()
        .row('.selected')
        .remove().
        draw(false);
        
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
        this.model.name = this.model.name;
        this.model.version = 0;
        this.func.getModelList();
      },
      error => {
        console.log(error);
        this.toastr.error( 'Model ' + this.model.name + '.v' + this.model.version + ' NOT deleted', 'ERROR', {
          timeOut: 4000, positionClass: 'toast-top-right'
        });
      }
    );

  }

  cloneModel() {

    this.service.cloneModel(this.model.name).subscribe(
      result => {
        this.toastr.success('Model \'' + result['modelName'] + ' v.' + result['version'] + '\'', 'CREATED SUCCESFULLY', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
        this.model.name = this.model.name;
        this.model.version = 0;
        this.func.getModelList();
      },
      error => {
       alert('Error cloning');
      }
    );
  }

  exportModel() {
    const url: string = environment.baseUrl_manage + 'model/' + this.model.name + '/export';
    window.open(url);
  }

  importModel(fileList: FileList) {
    const file = fileList[0];
    this.manage.file = file;
    this.service.importModel().subscribe(
      result => {
        console.log(result);
        if (result.error) {
          this.toastr.warning(result.error + '\' ' , 'IMPORT ERRORS', {
            timeOut: 15000, positionClass: 'toast-top-right'});
        }
        else {
          this.toastr.success('Model \'' + result.Model + '\' imported' , 'IMPORTED SUCCESFULLY', {
            timeOut: 5000, positionClass: 'toast-top-right'});
        }
        this.manage.file = undefined;
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
        this.func.getModelList();
      },
      error => {
        this.toastr.error('Error:\'' + error.error.error.toString() + '\' ' , 'ERROR IMPORTING', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      }
    );
  }

  newPrediction(name: string, version: string) {
    const modalRef = this.modalService.open(PredictorComponent, { size: 'lg'});
    modalRef.componentInstance.modelName = name;
    modalRef.componentInstance.version = version;
  }

}
