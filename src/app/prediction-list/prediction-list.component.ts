import { Component, OnInit, OnChanges, DoCheck, AfterViewInit} from '@angular/core';
import { CommonService } from '../common.service';
import 'jquery';
//import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-prediction-list',
  templateUrl: './prediction-list.component.html',
  styleUrls: ['./prediction-list.component.css']
})
export class PredictionListComponent implements OnInit, DoCheck, AfterViewInit{

  predictions: Array<any> = undefined;
  constructor(private commonService: CommonService,) {}

    ngOnInit() {
      this.getPredictionList();
    }

    ngAfterViewInit() {
      setTimeout(() => {
        const table = $('#dataTable').DataTable();
      },200);
    }

    getPredictionList() {

      this.commonService.getPredictionList().subscribe(
          result => {
            this.predictions = result;
            const table = $('#dataTable').DataTable();
          },
          error => {
            alert(error.message);
          }
      );
    }
    ngDoCheck(): void {
      const table = $('#dataTable').DataTable();
      $('#dataTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
          $(this).removeClass('selected');
        } else {
          table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      } );
    }
}
