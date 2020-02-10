import { Component, OnInit,AfterViewInit } from '@angular/core';
import { CommonService } from '../common.service';
import { ModelListService } from './model-list.service';
import { Model, Prediction } from '../Globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationsComponent} from '../validations/validations.component';
import 'jquery';
// import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit, AfterViewInit {

  constructor(private service: ModelListService,
    private commonService: CommonService,
    public model: Model,
    public prediction: Prediction) {}

  models: Array<any>;
  objectKeys = Object.keys;
  tableVisible = false;

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.getModelList();
  }

  getModelList() {
    this.tableVisible = false;
    this.commonService.getModelList().subscribe(
        result => {
          // result = JSON.parse(result[1]);
          this.model.trained_models = [];
          for (const model of result) {
            const modelName = model.modelname;
            for ( const version of model.versions) {
              // INFO OF EACH MODEL
              this.commonService.getModel(modelName, version).subscribe(
                result2 => {
                    const dict_info = {};
                    for (const info of result2) {
                      dict_info[info[0]] = info[2];
                    }
                    const quality = {};
                    for (const info of (Object.keys(dict_info))) {
                      if ( (info !== 'nobj') && (info !== 'nvarx') && (info !== 'model') // HARCODED: NEED TO IMPROVE
                          && (info !== 'Conformal_interval_medians' ) && (info !== 'Conformal_prediction_ranges' )
                          && (info !== 'Y_adj' ) && (info !== 'Y_pred' )) {
                            quality[info] =  parseFloat(dict_info[info].toFixed(3));
                      }
                    }
                    this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: true,
                    numMols: dict_info['nobj'], variables: dict_info['nvarx'], type: dict_info['model'], quality: quality};
                    this.model.trained_models.push(modelName + ' .v' + version);
                },
                error => {
                 this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: false, numMols: '-',
                    variables: '-', type: '-', quality: {}};
                }
              );
            }
          }
          setTimeout(() => {
            this.tableVisible = true;
            const table = $('#dataTableModels').DataTable();
          }, 500);
        },
        error => {
          console.log(error.message);
          alert(error.message);
        }
    );
  }

  selectModel(name: string, version: string, trained: boolean, type: string) {

    if (version === '-' || version === 'dev') {
      version = '0';
    }
    this.model.name = name;
    this.model.version = version;
    this.model.trained = trained;
    this.model.type = type;
    this.model.file = undefined;
    this.model.file_info = undefined;
    this.model.file_fields = undefined;
    this.model.parameters = undefined;
  }

}
