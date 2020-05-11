import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Prediction} from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
// import { Subject } from 'rxjs';
// import { SingleDataSet, Label } from 'ng2-charts';
// import { ChartType} from 'chart.js';
import { PredictionService } from './prediction.service';
import 'datatables.net-bs4';
// import 'datatables.net-buttons-bs4';

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
  predictionError = '';
  isQuantitative = false;

  public predictData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FN", "TN", "FP"],
    meta: ["TP", "FN", "TN", "FP"],
    marker: {
      opacity: 0.8,
      // color: ['green','red','green','orange'],
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"]
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  public plotCommon = {
    layout :{
      width: 350,
      // height: 600,
      polar: {
        bargap: 0,
        gridcolor: "grey",
        gridwidth: 1,
        radialaxis: {
          angle: 90,
          ticks: '', 
          tickfont: {
            size: 12,
            fontStyle: 'Barlow Semi Condensed, sans-serif',
          },
          // dtick: 20,
        },
        angularaxis: {
          showticklabels: false, 
          ticks:'',
        }
      }
    },
    config: {
      // responsive: true,
        displayModeBar: false
      }
  };  

  plotScores = {
    data: [
      { x: [], 
        y: [], 
        text: [],
        type: 'scatter', 
        mode: 'markers', 
        marker: {
          color: [],
          opacity: 0.4,
          size: 10,
          colorscale: 'RdBu', 
          showscale: true, 
          colorbar: {
            tickfont: {
              family: 'Barlow Semi Condensed, sans-serif',
              size: 20
            }
          }
        },
        hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        // hovertemplate:'<b>%{text}</b><extra></extra>',
      },
      { x: [], 
        y: [], 
        text: [],
        meta: [],
        type: 'scatter', 
        mode: 'markers+text', 
        textfont : {
          fontStyle: 'Barlow Semi Condensed, sans-serif',
          color: 'black',
          size: 16
        },
        textposition: 'top right',
        marker: {
          color: 'black',
          symbol: 'circle-open',
          opacity: 0.9,
          size: 14,
          line: {
            color: 'black',
            width: 2
          }

        },
        hovertemplate:'<b>%{text}</b><br>%{meta:.2f}<extra></extra>',
        // hovertemplate:'<b>%{text}</b><extra></extra>',
      },
    ],
  }

  icon1 : {
    'width': 500,
    'height': 600,
    'path': 'M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
  }

  // colored = true;

  plotCommonScores = {
    layout: { 
      width: 950,
      height: 600,
      hovermode: 'closest',
      margin: {
        r: 10,
        t: 30,
        pad: 0
      },
      showlegend: false,
      showtitle: false,
      xaxis: {
        hoverformat: '.2f',
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC1',
        titlefont: {
          family: 'Barlow Semi Condensed, sans-serif',
          size: 24,
        },
        tickfont: {
          family: 'Barlow Semi Condensed, sans-serif',
          size: 18,
        },
      },
      yaxis: {
        hoverformat: '.2f',
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC2',
        titlefont: {
          family: 'Barlow Semi Condensed, sans-serif',
          size: 24,
        },
        tickfont: {
          family: 'Barlow Semi Condensed, sans-serif',
          size: 18,
        },
      },
    },
    config: {
      // responsive: true,
      displaylogo: false,
      // modeBarButtonsToAdd: [
      //   { name: 'color toggler',
      //     icon: this.icon1,
      //     click: function(gd) {
      //       if (this.colored) {
      //         var update = {
      //           'marker.colorscale': 'Greys'
      //         };
      //         PlotlyJS.restyle(gd, update, [0]);
      //         PlotlyJS.restyle(gd, 'marker.color', 'red', [1]);
      //         this.colored = false;
      //       }
      //       else {
      //         var update = {
      //           'marker.colorscale': 'Bluered'
      //         };
      //         PlotlyJS.restyle(gd, update, [0]);
      //         PlotlyJS.restyle(gd, 'marker.color', 'black', [1]);
      //         this.colored = true;
      //       }
      //     }}],
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    }
    };

  constructor(public prediction: Prediction,
    public service: PredictionService,
    private commonService: CommonService) { }
  
  dtOptions: DataTables.Settings = {};
  message = '';
  
  drawReportHeader () {
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.molIndex], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }

  drawSimilars () {
    setTimeout(() => {
      // draw similar compounds (if applicable)
      if (this.predictionResult.hasOwnProperty('search_results')) {
        const optionsA = {'width': 400, 'height': 150};
        const smiles = this.predictionResult.search_results[this.molIndex].SMILES;
        let iteratorCount = 0;
        for (var value of smiles) {
          const smilesDrawer = new SmilesDrawer.Drawer(optionsA);
          SmilesDrawer.parse(value, function(tree) {
            let canvasName = 'one_canvas';
            smilesDrawer.draw(tree,  canvasName.concat(iteratorCount.toString()), 'light', false);
          }, function (err) {
            console.log(err);
          });
          iteratorCount++;
        };  
      };
    },0);
  }

  NextMol() {
    this.molIndex++;
    this.noPreviousMol = false;
    if ((this.predictionResult.SMILES.length - 1) === this.molIndex) {
      this.noNextMol = true;
    }
    this.drawReportHeader();
    this.drawSimilars();
  }

  PreviousMol() {
    this.molIndex--;
    this.noNextMol = false;
    if (this.molIndex === 0) {
      this.noPreviousMol = true;
    }
    this.drawReportHeader();
    this.drawSimilars();
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
    this.predictData[0].r = [0, 0, 0, 0];
    this.predictionError = '';
    this.plotScores.data[0].x = [];
    this.plotScores.data[0].y = [];
    this.plotScores.data[0].text = [];
    this.plotScores.data[0].marker.color = [];
    this.plotScores.data[1].x = [];
    this.plotScores.data[1].y = [];
    this.plotScores.data[1].text = [];
    this.plotScores.data[1].meta = [];
    this.getInfo();
    this.getDocumentation();
    this.getPrediction();
    this.getValidation();
  }

  tabClickHandler(info: any): void {
    // console.log(info[0], info[1]);
    
    this.molIndex=parseInt(info[0])-1;

    this.noPreviousMol = false;
    this.noNextMol = false;
    if (this.molIndex == 0) {
      this.noPreviousMol = true;
    }
    if (this.molIndex == (this.predictionResult.SMILES.length - 1)) {
      this.noNextMol = true;
    }
    
    // var b = document.querySelector("#pills-all"); 
    // b.setAttribute('aria-selected', 'false');
    // b.setAttribute('tabindex', "-1");
    
    $('a[aria-controls="pills-home"]').removeClass('active');
    $('#pills-all').removeClass('active');
    $('#pills-all').removeClass('show');
    
    // var tab = document.querySelector("#pills-one"); 
    // tab.setAttribute('aria-selected', 'true');
    // tab.removeAttribute('tabindex');
    
    $('a[aria-controls="pills-one"]').addClass('active');
    $('#pills-one').addClass('active'); 
    $('#pills-one').addClass('show'); 
    
    this.drawReportHeader();
    this.drawSimilars();

  }

  getValidation() {
    this.commonService.getValidation(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        const info = result;

        if ('PC1' in info) {
          this.plotScores.data[0].x = info['PC1'];
          this.plotScores.data[0].y = info['PC2'];
          this.plotScores.data[0].text = info['obj_nam'];
          this.plotScores.data[0].marker.color = info['ymatrix'];
          this.plotScores.data[0].marker.showscale = this.isQuantitative;
          if (this.isQuantitative) {
            this.plotScores.data[0].marker.colorscale= 'RdBu';
          }
          else {
            this.plotScores.data[0].marker.colorscale= 'Bluered';
          } 
        }
      }
    )
  }

  getInfo(): void {

    this.commonService.getModel(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {

        for (const info of result) {
          this.modelBuildInfo[info[0]] = info[2];
        }

        this.isQuantitative = this.modelBuildInfo['quantitative'];

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
        if (result['error']) {
          this.predictionError = result['error']; 
        }

        
        if ('PC1proj' in result) {
          this.plotScores.data[1].x = result['PC1proj'];
          this.plotScores.data[1].y = result['PC2proj'];
          this.plotScores.data[1].text = result['obj_nam'];
          this.plotScores.data[1].meta = result['values'];
        }
        
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
          this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
          this.modelValidationInfo['FN'][1],
          this.modelValidationInfo['TN'][1], 
          this.modelValidationInfo['FP'][1]];

          // this.polarAreaChartData = [this.modelValidationInfo['TP'][1], this.modelValidationInfo['FP'][1],
          // this.modelValidationInfo['TN'][1], this.modelValidationInfo['FN'][1]];
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
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
              const self = this;
              $('td', row).unbind('click');
              $('td', row).bind('click', () => {
                this.tabClickHandler(data);
              });
              return row;
            },
            order: []
          };

          const table = $('#prediction').DataTable(settingsObj);

          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              me.drawReportHeader();
              me.drawSimilars();
            }
          });
          
          this.predictionVisible = true;

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
