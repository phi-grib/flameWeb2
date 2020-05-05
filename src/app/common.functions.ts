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
          if (result[0]) {
            this.model.trained_models = [];
            for (const model of result[1]) {
              const modelName = model.modelname;
              const version = model.version;
              
              // INFO OF EACH MODEL
              num_models++;

              // fallback
              this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: false, numMols: '-',
                  variables: '-', type: '-', quality: {}, quantitative: false, conformal: false, ensemble: false, error: model.info};

              // model.info should be 
              // (a) dictionay with a code 0 or 1 and an error message
              // (b) an array of tuples of three elements 
              if (typeof(model.info) !== 'string') { // this should never happen, only in very old Flame versions
                // console.log (model.info);

                // option (a) some kind of controlled error
                if (model.info['code'] == 0 || model.info['code'] == 1 ){
                  this.model.listModels[modelName + '-' + version].error = model.info['message'];
                }
                // option (b) healthy 
                else {
                  const dict_info = {};
                  
                  for (const aux of model.info) {
                    dict_info[aux[0]] = aux[2];
                  }

                  const quality = {};
                  for (const info of (Object.keys(dict_info))) {
                    if (typeof(dict_info[info]) === 'number') {
                      quality[info] =  parseFloat(dict_info[info].toFixed(3));
                    }
                  }

                  this.model.listModels[modelName + '-' + version] = {
                    name: modelName, 
                    version: version, trained: true,
                    numMols: dict_info['nobj'], 
                    variables: dict_info['nvarx'], 
                    type: dict_info['model'], 
                    quality: quality,
                    quantitative: dict_info['quantitative'], 
                    conformal: dict_info['conformal'], 
                    ensemble: dict_info['ensemble'], 
                    error: undefined 
                  };

                  this.model.trained_models.push(modelName + ' .v' + version);
                }
              }
              else {
                alert('Unexpected result: ' + model.info );
              } 
              num_models--;

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
        
          }
          else {
            alert(result[1]);
          }
        },
        error => {
          alert('Unable to retrieve model list');
        }
      );
  }

  getPredictionList() {
    this.globals.tablePredictionVisible = false;
    this.commonService.getPredictionList().subscribe(
      result => {
        if (result[0]) {
            this.prediction.predictions = result[1];

            // console.log(result[1])

            setTimeout(() => {
              const table = $('#dataTablePredictions').DataTable({
                // 'autoWidth': false,
                /*Ordering by date */
                order: [[4, 'desc']],
                columnDefs: [{ 'type': 'date-euro', 'targets': 4 }]
              });

              if (result[1].length > 0) {
                this.prediction.name = $('#dataTablePredictions tbody tr:first td:first').text();
                this.prediction.modelName = $('#dataTablePredictions tbody tr:first td:eq(1)').text();
                this.prediction.modelVersion = $('#dataTablePredictions tbody tr:first td:eq(2)').text();
                this.prediction.date = $('#dataTablePredictions tbody tr:first td:eq(4)').text();
              }
              $('#dataTablePredictions tbody').on( 'click', 'tr', function () {
                $('tr').removeClass('selected'); // removes all highlights from tr's
                $(this).addClass('selected'); // adds the highlight to this row
              });
            }, 100);
          } 
          else {
            alert(result[1]);
          }
        },
        error => {
          alert(error.message);
        }
    );
    this.globals.tablePredictionVisible = true;
  }


}
