import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { Model, Prediction, Globals } from './Globals';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctions {

  constructor(private http: HttpClient,
    private commonService: CommonService,
    public model: Model,
    public globals: Globals,
    public prediction: Prediction) { }

  objectKeys = Object.keys;

  getModelList() {
    this.globals.tableModelVisible = false;
    let num_models = 0;
    this.commonService.getModelList().subscribe(
        result => {
          // result = JSON.parse(result[1]);
          this.model.trained_models = [];
          for (const model of result) {
            const modelName = model.modelname;
            const version = model.version;
            // INFO OF EACH MODEL
            console.log(typeof(model.info));
            num_models++;
            if (typeof(model.info) !== 'string') {
              const dict_info = {};
              for (const aux of  model.info) {
                dict_info[aux[0]] = aux[2];
              }
              const quality = {};
              for (const info of (Object.keys(dict_info))) {
                if (typeof(dict_info[info]) === 'number') {
                  quality[info] =  parseFloat(dict_info[info].toFixed(3));
                }
              }
              this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: true,
              numMols: dict_info['nobj'], variables: dict_info['nvarx'], type: dict_info['model'], quality: quality,
              quantitative: dict_info['quantitative'], conformal: dict_info['conformal'], ensemble: dict_info['ensemble'], 
              error: undefined };
              this.model.trained_models.push(modelName + ' .v' + version);
              num_models--;
            } else {
              this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: false, numMols: '-',
                  variables: '-', type: '-', quality: {}, quantitative: false, conformal: false, ensemble: false, error: model.info};
                  num_models--;
            }
          }
          const intervalId = setInterval(() => {
            if (num_models <= 0) {
              if (this.objectKeys(this.model.listModels).length > 0) {
                const a = this.objectKeys(this.model.listModels).sort();
                this.model.name = this.model.listModels[a[0]].name;
                this.model.version = this.model.listModels[a[0]].version;
                this.model.trained = this.model.listModels[a[0]].trained;
                this.model.conformal = this.model.listModels[a[0]].conformal;
                this.model.quantitative = this.model.listModels[a[0]].quantitative;
                this.model.ensemble = this.model.listModels[a[0]].ensemble;
                this.model.error = this.model.listModels[a[0]].error;
              }
              const table = $('#dataTableModels').DataTable({'autoWidth': false});
              this.globals.tableModelVisible = true;
              clearInterval(intervalId);
            }
          }, 10);
        },
        error => {
          /*this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: false, numMols: '-',
                  variables: '-', type: '-', quality: {}};
                  num_models--;*/
          console.log(error);
        }
      );
  }
}
