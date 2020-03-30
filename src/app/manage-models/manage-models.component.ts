import { Component, OnInit } from '@angular/core';
import { Manager, Model, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { ManageModelService } from './manage-models.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuilderComponent} from '../builder/builder.component';
import { CommonFunctions } from '../common.functions';
declare var $: any;

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.css']
})
export class ManageModelsComponent implements OnInit {

  modelName: string;
  objectKeys = Object.keys;

  constructor(public manage: Manager,
              private commonService: CommonService,
              public service: ManageModelService,
              public model: Model,
              public globals: Globals,
              private toastr: ToastrService,
              private modalService: NgbModal,
              public func: CommonFunctions) { }


  ngOnInit() {
  }

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
            this.modelName = '';
            this.model.listModels = {};
            $('#dataTableModels').DataTable().destroy();
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

  deleteModel() {

    this.service.deleteModel(this.model.name).subscribe(
      result => {
        this.toastr.success( 'Model ' + this.model.name + ' deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
       this.func.getModelList();
        this.model.name = undefined ;
        this.model.version = undefined;
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
        const table = $('#dataTableModels').DataTable();
        table.row('.selected').remove().draw(false);
        $('#dataTableModels').DataTable().destroy();
       this.func.getModelList();
        this.model.name = undefined;
        this.model.version = undefined;
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
          timeOut: 5000, positionClass: 'toast-top-right'});
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
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
        this.toastr.success('Model \'' + result.Model + '\' imported' , 'IMPORTED SUCCESFULLY', {
          timeOut: 5000, positionClass: 'toast-top-right'});
        this.manage.file = undefined;
        this.model.listModels = {};
        $('#dataTableModels').DataTable().destroy();
       this.func.getModelList();
      },
      error => {
        this.toastr.error('Model \'' + error.error.Model + '\' already exist' , 'ERROR IMPORTING', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      }
    );
  }
}
