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
          if (result[0]) {
            this.prediction.predictions = result[1];

            console.log(result[1])

            setTimeout(() => {
              const table = $('#dataTablePredictions').DataTable({
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
              this.tableVisible = true;
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
  }
}
