import { Component, OnInit } from '@angular/core';
// import 'jquery';
import 'datatables.net-bs4';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../common.service';
import { Prediction } from '../Globals';
import { ToastrService } from 'ngx-toastr';
import { ManagePredictionsService } from './manage-predictions.service';
import { PredictorComponent} from '../predictor/predictor.component';
// import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-manage-predictions',
  templateUrl: './manage-predictions.component.html',
  styleUrls: ['./manage-predictions.component.css']
})
export class ManagePredictionsComponent implements OnInit {

  constructor( private commonService: CommonService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private service: ManagePredictionsService,
              private prediction: Prediction,
              // private router: Router
              ) { }

  ngOnInit() {
  }

  newPrediction() {
    const modalRef = this.modalService.open(PredictorComponent, { size: 'lg'});
  }

  deletePrediction() {
    this.service.deletePrediction(this.prediction.name).subscribe(
      result => {
        const table = $('#dataTablePredictions').DataTable();
        table.row('.selected').remove().draw(false);
        // $('#dataTablePredictions').DataTable().destroy();
        // $('#dataTablePredictions').DataTable();
        this.toastr.success( 'Prediction "' + this.prediction.name + '" deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        this.prediction.name = $('#dataTablePredictions tbody tr:first td:first').text();
        this.prediction.modelName = $('#dataTablePredictions tbody tr:first td:eq(1)').text();
        this.prediction.modelVersion = $('#dataTablePredictions tbody tr:first td:eq(2)').text();
        this.prediction.date = $('#dataTablePredictions tbody tr:first td:eq(4)').text();

      },
      error => {
          this.toastr.error(error.error.error, 'ERROR', {
            timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
          });
      }
    );
  }
}
