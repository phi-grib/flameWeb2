import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { Model, Prediction, Globals } from './Globals';
declare var $: any;

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

  selectModel(name: string, version: string, modelID: string, trained: boolean, type: string, quantitative: boolean,
    conformal: boolean, ensemble: boolean, error: any) {

    if (version === '-' || version === 'dev') {
      version = '0';
    }
    this.model.name = name;
    this.model.version = version;
    this.model.modelID = modelID;
    this.model.trained = trained;
    this.model.conformal = conformal;
    this.model.quantitative = quantitative;
    this.model.ensemble = ensemble;
    this.model.error = error;
    this.model.file = undefined;
    this.model.file_info = undefined;
    this.model.file_fields = undefined;
    this.model.parameters = undefined;
  }

  selectModelID(index:any) {
    this.model.name = this.model.listModels[index].name;
    this.model.version = this.model.listModels[index].version;
    this.model.modelID = this.model.listModels[index].modelID;
    this.model.trained = this.model.listModels[index].trained;
    this.model.conformal = this.model.listModels[index].conformal;
    this.model.quantitative = this.model.listModels[index].quantitative;
    this.model.ensemble = this.model.listModels[index].ensemble;
    this.model.error = this.model.listModels[index].error;
  }

  getModelList() {
    this.globals.tableModelVisible = false;
    let num_models = 0;
    this.commonService.getModelList().subscribe(
        result => {
          if (result[0]) {
            this.model.trained_models = [];
            for (const model of result[1]) {

              // get listModels key elements
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

                // option (a) some kind of controlled error
                if (model.info['code'] == 0 || model.info['code'] == 1 ){
                  this.model.listModels[modelName + '-' + version].error = model.info['message'];
                  this.model.listModels[modelName + '-' + version].trained = false;
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
                    version: version, 
                    modelID: dict_info['modelID'],
                    trained: true,
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
              
              // if list reading was correct num_models == 0
              if (num_models <= 0) {

                let currentPage = 0;
                // console.log ('rendering: ', this.model.name, this.model.version);
                
                if (this.objectKeys(this.model.listModels).length > 0) {

                  // a is the sorted list of modelkeys
                  const a = this.objectKeys(this.model.listModels).sort();

                  // if no model selected, select the first one
                  if (this.model.name == undefined) {
                      this.selectModelID(a[0]);
                  }
                  else {
                    var modelIndex = a.indexOf(this.model.name+'-'+this.model.version);
                    this.selectModelID(a[modelIndex]);
                    currentPage = Math.floor(modelIndex/this.model.pagelen);
                  }
                }

                let me = this;
                const table = $('#dataTableModels').DataTable({
                  autoWidth: false,
                  destroy: true,
                  // deferRender: true,
                  pageLength: this.model.pagelen
                })
                .on( 'length.dt', function () {
                  me.model.pagelen =table.page.len();
                });

                if (currentPage != 0) {
                  table.page(currentPage).draw('page');
                }

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
    this.commonService.getPredictionList().subscribe(
      result => {
        if (result[0]) {
          this.prediction.predictions = result[1];
          this.globals.tablePredictionVisible = false;
          
            setTimeout(() => {
              const table = $('#dataTablePredictions').DataTable({
                /*Ordering by date */
                // autoWidth: false,
                deferRender: true,
                ordering: true,
                pageLength: 10,
                columnDefs: [{ 'type': 'date-euro', 'targets': 4 }],
                order: [[4, 'desc']],
                destroy: true
              });

              if (this.prediction.predictions.length > 0) {
                this.prediction.name = $('#dataTablePredictions tbody tr:first td:first').text();
                for (var i=0; i < this.prediction.predictions.length; i++ ) {
                    const ipred = this.prediction.predictions[i];
                    if (ipred[0] === this.prediction.name) {
                      this.prediction.modelName = ipred[1];
                      this.prediction.modelVersion = ipred[2];
                      this.prediction.date = ipred[3];
                      this.prediction.modelID = ipred[5];
                      // console.log ('found: ', this.prediction)
                    }
                }
                // this.prediction.modelName = $('#dataTablePredictions tbody tr:first td:eq(1)').text();
                // this.prediction.modelVersion = $('#dataTablePredictions tbody tr:first td:eq(2)').text();
                // this.prediction.date = $('#dataTablePredictions tbody tr:first td:eq(4)').text();
              }
              // $('#dataTablePredictions tbody').on( 'click', 'tr', function () {
              //   $('tr').removeClass('selected'); // removes all highlights from tr's
              //   $(this).addClass('selected'); // adds the highlight to this row
              // });

              this.globals.tablePredictionVisible = true;
            }, 10);
          } 
          else {
            alert(result[1]);
          }
        },
        error => {
          alert(error.message);
        }
    );
  }


}
