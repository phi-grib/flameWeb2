import { Component, OnInit} from '@angular/core';
import { CommonService } from '../common.service';
import { Model, Prediction } from '../Globals';
import 'jquery';
// import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-prediction-list',
  templateUrl: './prediction-list.component.html',
  styleUrls: ['./prediction-list.component.css']
})
export class PredictionListComponent implements OnInit {

  objectKeys = Object.keys;
  tableVisible = false;

  constructor(private commonService: CommonService,
              public prediction: Prediction,
              private model: Model) {}

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.model.trained = false;
    this.getPredictionList();
  }
  selectPrediction(name: string, modelName: string, modelVersion: string, date: any) {
    this.prediction.name = name;
    this.prediction.modelName = modelName;
    this.prediction.modelVersion = modelVersion;
    this.prediction.date = date;
  }

  getPredictionList() {
    this.tableVisible = false;
    this.commonService.getPredictionList().subscribe(
        result => {
          this.prediction.predictions = result;
          setTimeout(() => {
            const table = $('#dataTablePredictions').DataTable({
              /* No ordering applied by DataTables during initialisation */
              order: [[4, 'desc']],
              columnDefs: [{ 'type': 'date', 'targets': 4 }]
            });
            $('#dataTablePredictions tbody').on( 'click', 'tr', function () {
              $('tr').removeClass('selected'); // removes all highlights from tr's
              $(this).addClass('selected'); // adds the highlight to this row
            });
            this.tableVisible = true;
          }, 100);
        },
        error => {
          alert(error.message);
        }
    );
  }
}
