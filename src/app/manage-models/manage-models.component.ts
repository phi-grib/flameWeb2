import { Component } from '@angular/core';
import { Manager, Model, Globals } from '../Globals';
import { ManageModelService } from './manage-models.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuilderComponent} from '../builder/builder.component';
import { LabelerComponent} from '../labeler/labeler.component';
import { PredictorComponent} from '../predictor/predictor.component';
import { CommonFunctions } from '../common.functions';
import { VerificatorComponent } from '../verificator/verificator.component';
import { stringify } from 'querystring';
import {saveAs} from 'file-saver';
declare var $: any;

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.css']
})

export class ManageModelsComponent {

  modelName: string;
  toast_refresh: any;
  last_refresh: string = '';
  
  objectKeys = Object.keys;

  constructor(public manage: Manager,
              private modalService: NgbModal,
              public service: ManageModelService,
              public model: Model,
              public globals: Globals,
              private toastr: ToastrService,
              public func: CommonFunctions) { }

  buildModel(name: string, version: string) {
    const modalRef = this.modalService.open(BuilderComponent, { windowClass : 'modalClass'});
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.version = version;
  }

  labelModel(name: string, version: string) {
    const modalRef = this.modalService.open(LabelerComponent, { size: 'lg'});
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.version = version;
  }
  validateModel(name: string, version: string){
    const modalRef = this.modalService.open(VerificatorComponent, {size: 'xl'});
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.version = version;
  }

  newPrediction(name: string, version: string) {
    const modalRef = this.modalService.open(PredictorComponent, { size: 'lg'});
    modalRef.componentInstance.modelName = name;
    modalRef.componentInstance.version = version;
  }

  createModel(): void {
    const letters = /^[A-Za-z0-9_]+$/;
    if (this.modelName.match(letters) && this.modelName != 'test') {
        this.service.createModel(this.modelName).subscribe(
          result => {
            // this.modelName = '';
            this.model.listModels = {};
            $('#dataTableModels').DataTable().destroy();
            $('#dataTableModelsSelector').DataTable().destroy();
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
      alert('Invalid name! Valid names must contain only letters, numbers and underlines. The special name "test" is not allowed');
    }
  }

  deleteModel() {
    this.service.deleteModel(this.model.name).subscribe(
      result => {
        this.toastr.success( 'Model ' + this.model.name + ' deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
        $('#dataTableModelsSelector').DataTable().destroy();
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
        $('#dataTableModelsSelector').DataTable().destroy();
        // this.model.name = this.model.name;
        this.model.version = 0;
        this.func.getModelList();
      },
      error => {
        // console.log(error);
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
        $('#dataTableModelsSelector').DataTable().destroy();
        // this.model.name = this.model.name;
        this.model.version = 0;
        this.func.getModelList();
      },
      error => {
       alert('Error cloning');
      }
    );
  }

  exportModel(name: string, version: string) {

    let message = 'Exporting ';
    if (version == '0') {
      message += name + ' model tree';
    } else {
      message += name + ' version ' + version
    } 
    if (version !='0' && this.model.confidential) {
      message += ' AS A SECRET MODEL'
    }
    
    const inserted = this.toastr.info('Running!', message, {
      disableTimeOut: true, positionClass: 'toast-top-right'});

    this.service.exportModel(name, version).subscribe(
      result => {
        if (result['temp_dir']) {
          let iter = 0;
          const temp_dir : string = result['temp_dir'];
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.testExport(name, version, temp_dir, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( message + ' \n Timed Out' , 'Warning', {
                                   timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter += 1;
          }, 5000); // every five seconds
        }
      },
      error => {
        this.toastr.clear(inserted.toastId);
        alert('Error exporting: '+error.error.error);
      }
    );
  }
    
  testExport(modelname, version,  temp_dir, inserted, intervalId) {
    this.service.exportTestModel(modelname, version, temp_dir).subscribe(
      result => {
        if (result ['ready']) {
          this.toastr.clear(inserted.toastId);
          clearInterval(intervalId);

          this.service.exportTestDownload(modelname, version, temp_dir).subscribe (
            result => {
              let blob = new Blob([ result ],{ type: 'application/gzip' });
              let filename = modelname;
              if (version===0){
                filename+='.tgz';
              }
              else {
                filename+='_v'+version.toString().padStart(6, '0')+'.tgz';
              }
              
              saveAs(blob, filename);
            },
            error => {
              alert('Error downloading model');
            }
          );

        }
      }
    );
  }

  refreshModel (modelname) {
    this.toast_refresh = this.toastr.info('Running!', 'Refreshing ' + this.model.name , {
              disableTimeOut: true, positionClass: 'toast-top-right'});

    this.service.refreshModel(this.model.name).subscribe(
      result => {
        let iter = 0;
        const intervalId = setInterval(() => {
          if (iter < 10000) {
            this.testRefresh(this.model.name, intervalId);
          } else {
            clearInterval(intervalId);
            this.toastr.clear(this.toast_refresh.toastId);
            this.toastr.warning( 'Refreshing ' + this.model.name + ' \n Timed Out' , 'Warning', {
              timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter += 1;
          }, 5000); // every five seconds
        },
        error => {
          alert('Refresh ERROR');
        }
        );
  }
    
  testRefresh (modelname, intervalId) {
    this.service.testRefresh(modelname).subscribe(
      result => {
        if (result['status']==='aborted') {
          this.toastr.clear(this.toast_refresh.toastId);
          this.toastr.error('Model \"' + modelname + '\" refreshing task has not completed. Check the browser console for more information', 
            'Aborted', { timeOut: 10000, positionClass: 'toast-top-right'});
          console.log('ERROR report produced by refreshing task of model ', modelname);
          console.log(result['message']);
          clearInterval(intervalId);
          $('#dataTableModels').DataTable().destroy();
          $('#dataTableModelsSelector').DataTable().destroy();
          this.func.getModelList();
          return;
        }
        if (result ['status']==='ready') {
          this.toastr.clear(this.toast_refresh.toastId);
          clearInterval(intervalId);
          
          this.toastr.success( 'Model ' + modelname + ' has been updated', 'REFRESH' , {
            timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
          });
          this.model.listModels = {};
          $('#dataTableModels').DataTable().destroy();
          $('#dataTableModelsSelector').DataTable().destroy();
          this.func.getModelList();
        }
        else {
          // update the toast with progress info, but only if the message has changed
          if (result["message"]!=this.last_refresh){
            this.last_refresh = result['message'];
            this.toastr.clear(this.toast_refresh.toastId);
            this.toast_refresh = this.toastr.info('Running!', 'Refreshing ' + result['message'], {
              disableTimeOut: true, positionClass: 'toast-top-right'});
          }
        }
      },
      error => {
        this.toastr.error('Error:\'' + error.error.error.toString() + '\' ' , 'ERROR REFRESHING MODEL', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      }
  );
  }


  importModel(fileList: FileList) {
    const file = fileList[0];
    this.manage.file = file;
    this.service.importModel().subscribe(
      result => {
        // console.log(result);
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
        $('#dataTableModelsSelector').DataTable().destroy();
        this.func.getModelList();
        // this.model.secret = true;
      },
      error => {
        this.toastr.error('Error:\'' + error.error.error.toString() + '\' ' , 'ERROR IMPORTING', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      }
    );
  }

}
