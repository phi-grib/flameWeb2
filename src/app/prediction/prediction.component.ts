import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { Prediction} from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { Subject } from 'rxjs';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType} from 'chart.js';
import { PredictionService } from './prediction.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';



@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']/*,
  encapsulation: ViewEncapsulation.ShadowDom*/
})
export class PredictionComponent implements AfterViewInit, OnChanges {


  @Input() predictionName;
  objectKeys = Object.keys;
  predictionVisible = false;

  table: any = undefined;
  @ViewChildren('cmp') components: QueryList<ElementRef>;
  @ViewChildren('cmpone') componentOne: QueryList<ElementRef>;

  info = [];
  head = [];

  predictionResult: any;
  modelDocumentation: any;
  i = 0;
  noNext = false;
  noPrevious = true;

  modelBuildInfo = {};
  modelValidationInfo = {};
  quantitative = true;
  // PolarArea
  public polarChartOptions: any = {
    responsive: true,
    startAngle : 1 * Math.PI,
    scale: {
      gridLines: {
        color: 'rgba(0, 0, 0, 0.5)'
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontStyle : 'bold'
      }
    }
  };
  public polarAreaChartLabels: Label[] = ['TP', 'FP', 'TN', 'FN'];
  public polarAreaChartData: SingleDataSet = [0, 0, 0, 0];
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(235,143,3,0.3)', 'rgba(3,49,155,0.3)', 'rgba(255,0,0,0.3)'],
    },
  ];

  constructor(public prediction: Prediction,
              public service: PredictionService) { }



  Next() {
    this.i++;
    this.noPrevious = false;
    if ((this.predictionResult.SMILES.length -1) === this.i) {
      this.noNext = true;
    }
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.i], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }

  Previous() {
    this.i--;
    this.noNext = false;
    if (this.i === 0) {
      this.noPrevious = true;
    }
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.i], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }

  ngOnChanges(): void {
    this.getDocumentation();
    this.getPrediction();
  }

  getDocumentation() {

    this.service.getDocumentation(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        this.modelDocumentation = result;
      },
      error => {
        alert('Error getting Documentation');
      }
    );

  }

  getPrediction() {
    this.predictionVisible = false;
    this.predictionResult = undefined;
    $('#prediction').DataTable().destroy();
    $('#predictionOne').DataTable().destroy();

    this.service.getPrediction(this.predictionName).subscribe(
      result => {
        this.predictionResult = result;
        if ('external-validation' in this.predictionResult) {
          for (const modelInfo of this.predictionResult['external-validation']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            }
          }
        }
        if ('TP' in this.modelValidationInfo) {
          this.polarAreaChartData = [this.modelValidationInfo['TP'][1], this.modelValidationInfo['FP'][1],
          this.modelValidationInfo['TN'][1], this.modelValidationInfo['FN'][1]];
        }
        setTimeout(() => {
          this.components.forEach((child) => {
            const options = {'width': 300, 'height': 150};
            const smilesDrawer = new SmilesDrawer.Drawer(options);
            SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
              smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
              }, function (err) {
                console.log(err);
              });
          });
          this.predictionVisible = true;
          const table = $('#prediction').DataTable();
          // const table2 = $('#predictionOne').DataTable({'pageLength': 1});
          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              const options = {'width': 600, 'height': 300};
              const smilesDrawer = new SmilesDrawer.Drawer(options);
              SmilesDrawer.parse(me.predictionResult.SMILES[me.i], function(tree) {
                // Draw to the canvas
                smilesDrawer.draw(tree, 'one_canvas', 'light', false);
                }, function (err) {
                  console.log(err);
              });
            }
          });
         }, 0);
      }
    );
  }

  existKey(obj: {}, key: string) {

    if (key in this.objectKeys(obj)) {
      return true;
    }
    return false;
  }

  saveEXCEL() {
    const xls  = Object.assign([], this.info);
    xls.splice(0, 0, this.head);
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(xls);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.prediction.name  + '.xlsx');
  }
  savePDF() {

    const pdf = new jsPDF();
    pdf.autoTable({
      head: [this.head],
      body: this.info,
      headStyles: {
        2: { halign: 'center'},
        3: { halign: 'center'},
      },
      columnStyles: {
        0: {columnWidth: 40},
        1: {columnWidth: 40},
        2: {columnWidth: 10, halign: 'center'},
        3: {columnWidth: 10, halign: 'center'},
      }
    });
    pdf.save(this.prediction.name + '.pdf');
  }

  ngAfterViewInit() {
    // pdf.autoTable({html: '#info'});
    this.info = [];
    this.head = ['Name', 'Mol'];

    if (this.predictionResult !== undefined) {
      if (this.predictionResult.ymatrix) {
        this.head.push('Value');
      }
      if ( this.predictionResult.values) {
        this.head.push('Prediction');
      }
      if ( this.predictionResult.upper_limit) {
        this.head.push('Upper limit');
      }
      if ( this.predictionResult.lower_limit) {
        this.head.push('Lower limit');
      }
      if ( this.predictionResult.c0) {
        this.head.push('Inactive');
      }
      if ( this.predictionResult.c1) {
        this.head.push('Active');
      }
      if ( this.predictionResult.ensemble_c0) {
        this.head.push('Ensemble Class 0');
      }
      if ( this.predictionResult.ensemble_c1) {
        this.head.push('Ensemble Class 1');
      }


      let prediction = [];
      for (let i = 0; i < this.predictionResult.SMILES.length;) {
        prediction = [];
        prediction = [this.predictionResult.obj_nam[i], this.predictionResult.SMILES[i]];

        if (this.predictionResult.ymatrix) {
          prediction.push(this.predictionResult.ymatrix[i].toFixed(3));
        }
        if (this.predictionResult.values) {
          prediction.push(this.predictionResult.values[i].toFixed(3));
        }
        if (this.predictionResult.upper_limit) {
          prediction.push(this.predictionResult.upper_limit[i].toFixed(3));
        }
        if (this.predictionResult.lower_limit) {
          prediction.push(this.predictionResult.lower_limit[i].toFixed(3));
        }
        if (this.predictionResult.c0) {
          prediction.push(this.predictionResult.c0[i]);
        }
        if (this.predictionResult.c1) {
          prediction.push(this.predictionResult.c1[i]);
        }
        if ( this.predictionResult.ensemble_c0) {
          this.head.push(this.predictionResult.ensemble_c0[i].toFixed(3));
        }
        if ( this.predictionResult.ensemble_c1) {
          this.head.push(this.predictionResult.ensemble_c1[i].toFixed(3));
        }
        this.info.push(prediction);
        i = i + 1;
      }
    }
  }
}
