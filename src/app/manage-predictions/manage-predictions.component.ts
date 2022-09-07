import { Component } from '@angular/core';
import 'datatables.net-bs4';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../common.service';
import { Prediction } from '../Globals';
import { ToastrService } from 'ngx-toastr';
import { ManagePredictionsService } from './manage-predictions.service';
import { PredictorComponent} from '../predictor/predictor.component';
declare var $: any;

@Component({
  selector: 'app-manage-predictions',
  templateUrl: './manage-predictions.component.html',
  styleUrls: ['./manage-predictions.component.css']
})

export class ManagePredictionsComponent {
  
  constructor( private commonService: CommonService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: ManagePredictionsService,
    public prediction: Prediction,
    ) { }
    

  newPrediction() {
    const modalRef = this.modalService.open(PredictorComponent, { size: 'lg'});
  }

  deletePrediction() {
    this.service.deletePrediction(this.prediction.name).subscribe(
      result => {
        
        this.toastr.success( 'Prediction "' + this.prediction.name + '" deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        
        const table = $('#dataTablePredictions').DataTable();
        table.row('.selected').remove().draw(false);

        // if the table is empty, simply define the prediction name as undefined to clear everything
        if (table.data().count() == 0) {
          this.prediction.name = undefined;
        }
        else {
          // select the first item
          // this.prediction.name = table.data()[0][0];
          this.prediction.name = $('#dataTablePredictions tbody tr:first td:first').text();

          this.prediction.modelName = $('#dataTablePredictions tbody tr:first td:eq(1)').text();
          this.prediction.modelVersion = $('#dataTablePredictions tbody tr:first td:eq(2)').text();
          this.prediction.date = $('#dataTablePredictions tbody tr:first td:eq(4)').text();
          
          for (const ipred of this.prediction.predictions) {
            if (ipred[0] == this.prediction.name) {
              this.prediction.modelName = ipred[1];
              this.prediction.modelVersion = ipred[2];
              this.prediction.date = ipred[3];
              this.prediction.modelID = ipred[5];
            }
          }
        }


      },
      error => {
          this.toastr.error(error.error.error, 'ERROR', {
            timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
          });
      }
    );
  }
}
