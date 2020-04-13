import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { Prediction} from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType} from 'chart.js';
import { PredictionService } from './prediction.service';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';

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

  q_measures = ['TP', 'FP', 'TN', 'FN'];

  table: any = undefined;
  @ViewChildren('cmp') components: QueryList<ElementRef>;
  @ViewChildren('cmpone') componentOne: QueryList<ElementRef>;

  info = [];
  head = [];

  predictionResult: any;
  modelDocumentation: any = undefined;
  molIndex = 0;
  noNextMol = false;
  noPreviousMol = true;
  noNextModel = false;
  noPreviousModel = true;

  modelBuildInfo = {};
  modelValidationInfo = {};
  submodels = [];
  submodelsIndex = 0;
  // PolarArea
  public polarChartOptions: any = {
    responsive: true,
    animation: false, 
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
              public service: PredictionService,
              private commonService: CommonService) { }



  NextMol() {

    this.molIndex++;
    this.noPreviousMol = false;
    if ((this.predictionResult.SMILES.length - 1) === this.molIndex) {
      this.noNextMol = true;
    }
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.molIndex], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });

  }

  PreviousMol() {

    this.molIndex--;
    this.noNextMol = false;
    if (this.molIndex === 0) {
      this.noPreviousMol = true;
    }
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.molIndex], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });

  }

  NextModel() {

    this.submodelsIndex++;
    this.noPreviousModel = false;
    if ((this.submodels.length - 1) === this.submodelsIndex) {
      this.noNextModel = true;
    }
  }

  PreviousModel() {

    this.submodelsIndex--;
    this.noNextModel = false;
    if (this.submodelsIndex === 0) {
      this.noPreviousModel = true;
    }
  }

  ngOnChanges(): void {
    this.noNextMol = false;
    this.noPreviousMol = true;
    this.noNextModel = false;
    this.noPreviousModel = true;
    this.molIndex = 0;
    this.submodelsIndex = 0;
    this.modelBuildInfo = {};
    this.getInfo();
    this.getDocumentation();
    this.getPrediction();
  }

  getInfo(): void {

    this.commonService.getModel(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        for (const info of result) {
          this.modelBuildInfo[info[0]] = info[2];
        }
        if (this.modelBuildInfo['ensemble']) {

          let version = '0';
          this.submodels = [];
          this.modelBuildInfo['ensemble_names'].forEach((submodel, index) => {

            if (this.modelBuildInfo['ensemble_names']) {
              version = this.modelBuildInfo['ensemble_versions'][index];
            } else {
              version = '0';
            }
            this.submodels[index] = {};
            this.submodels[index]['name'] = submodel;
            this.submodels[index]['version'] = version;
            this.commonService.getModel(submodel, version).subscribe(
              result3 => {
                for (const info of result3) {
                  this.submodels[index][info[0]] = info[2];
                }
              },
              error => {
              }
            );
          });
        }
      },
      error => {
      }
    );
  }

  getDocumentation() {

    this.commonService.getDocumentation(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        this.modelDocumentation = result;
      },
      error => {
        this.modelDocumentation = undefined;
      }
    );

  }

  castValue(value: any) {

    if (this.modelBuildInfo['quantitative']) {
      return value.toFixed(3);
    } else {
      if (value === 0) {
        return 'Negative';
      } else if (value === 1) {
        return 'Positive';
      } else {
        return 'Uncertain';
      }
    }
  }

  getPrediction() {
    this.predictionVisible = false;
    this.predictionResult = undefined;
    $('#prediction').DataTable().destroy();
    $('#predictionOne').DataTable().destroy();

    this.modelValidationInfo = {};

    this.commonService.getPrediction(this.predictionName).subscribe(
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

          const settingsObj: any = {
            dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
            '<"row"<"col-sm-12"tr>>' +
            '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            buttons: [
              { 'extend': 'copy', 'text': 'Copy', 'className': 'btn-primary' , title: ''},
              { 'extend': 'excel', 'text': 'Excel', 'className': 'btn-primary' , title: ''},
              { 'extend': 'pdf', 'text': 'Pdf', 'className': 'btn-primary' , title: ''},
              { 'extend': 'print', 'text': 'Print', 'className': 'btn-primary' , title: ''}
            ],
            order: []
          };
          const table = $('#prediction').DataTable(settingsObj);

          this.predictionVisible = true;
          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              const options = {'width': 600, 'height': 300};
              const smilesDrawer = new SmilesDrawer.Drawer(options);
              SmilesDrawer.parse(me.predictionResult.SMILES[me.molIndex], function(tree) {
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
