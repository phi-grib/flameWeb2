import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, Input, OnChanges, OnInit } from '@angular/core';
import { Prediction} from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PredictionService } from './prediction.service';
import { CustomHTMLElement } from '../Globals';
import 'datatables.net-bs4';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']/*,
  encapsulation: ViewEncapsulation.ShadowDom*/
})
export class PredictionComponent implements AfterViewInit, OnChanges {

  @Input() predictionName;
  @ViewChildren('cmp') components: QueryList<ElementRef>;
  // @ViewChildren('cmpone') componentOne: QueryList<ElementRef>;
  
  objectKeys = Object.keys;
  predictionVisible = false;
  modelMatch = true;
  modelPresent = true;
  q_measures = ['TP', 'FP', 'TN', 'FN'];
  table: any = undefined;
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

  predictData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FN", "TN", "FP"],
    meta: ["TP", "FN", "TN", "FP"],
    marker: {
      opacity: 0.8,
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"]
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  plotCommon = {
    layout :{
      width: 350,
      height: 350,
      // margin: {r: 10, t: 30, b:0, pad: 0 },
      polar: {
        bargap: 0,
        gridcolor: "grey",
        gridwidth: 1,
        radialaxis: {
          angle: 90,
          ticks: '', 
          tickfont: { size: 12, fontStyle: 'Barlow Semi Condensed, sans-serif' },
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
        meta: [],
        type: 'scatter', 
        mode: 'markers', 
        marker: {
          color: [],
          opacity: 0.6,
          size: 10,
          colorscale: 'RdBu', 
          showscale: true, 
          cauto: true,
          colorbar: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 }
          }
        },
        hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
      },
      { x: [], 
        y: [], 
        text: [],
        meta: [],
        type: 'scatter', 
        mode: 'markers+text', 
        textfont : {
          fontStyle: 'Barlow Semi Condensed, sans-serif',
          color: '#59c427',
          size: 16
        },
        textposition: 'top right',
        marker: {
          color: '#6be831',
          symbol: 'circle-open',
          opacity: 1,
          size: 14,
          line: {
            color: '#6be831',
            width: 3
          }

        },
        hovertemplate:'<b>%{text}</b><br>%{meta:.2f}<extra></extra>',
      },
    ],
    layout: { 
      width: 800,
      height: 600,
      hovermode: 'closest',
      margin: {r: 10, t: 30, pad: 0 },
      showlegend: false,
      showtitle: false,
      xaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC1',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18},
      },
      yaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC2',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18},
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
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_prediction',
        width: 800,
        height: 600,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']
    }
  };

  plotComboQ = {
    data : [{
      x: [],
      y: [],
      text: [],
      type: 'scatter',
      mode: 'markers', 
      marker: {
        symbol: 'diamond',
        color: 'rgba(0,0,0,0.6)',
        size: 18,
        line: {
          color: 'black',
          width: 2
        },
        textfont: {family: 'Barlow Semi Condensed, sans-serif', 
                  size: 20 },
        texttemplate: '{x:.2f}'
      },
      error_x: {
        type: 'data',
        color: 'rgba(0,0,0,0.6)',
        symmetric: false,
        array: [],
        arrayminus: []
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
    },
      {x: [],
       y: [],
       type: 'scatter',
       mode: 'lines',
       line: {
        color: 'red',
        width: 3
       },
       hovertemplate:'<b>ensemble</b>: %{x:.2f}<extra></extra>'
      },
      {x: [],
       y: [],
       type: "scatter",
       fill: "tozeroy", 
       fillcolor: "rgba(255,0,0,0.2)", 
       line: {color: "transparent"}, 
       hovertemplate:'<b>ensemble CI</b>: %{x:.2f}<extra></extra>'
      },
    ],
    layout : {
      width: 800,
      // height: 600,
      hovermode: 'x',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 20 } },
      xaxis: {
        zeroline: false,
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 800,
        // height: 600,
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }

  plotComboC = {
    data : [{
      x: [],
      y: [],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: "rgba(0,0,255,0.6)",
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
      },
      {
      x: [],
      y: [],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(255,0,0,0.6)',
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
      },
    ],
    layout : {
      width: 800,
      // height: 600,
      // margin: {r: 10, t: 30, b:0, pad: 0 },
      barmode: 'relative',
      hovermode: 'closest',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 20 } },
      xaxis: {
        range: [-1.1, 1.1],
        zeroline: true,
        zerolinewidth: 4,
        zerolinecolor: 'black',
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickvals: [-1.1, 0, 1.1],
        ticktext: ['negative', 'undefined', 'positive']
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 800,
        // height: 600,
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }

  // icon1 : {
  //   'width': 500,
  //   'height': 600,
  //   'path': 'M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
  // }

  // colored = true;

  constructor(public prediction: Prediction,
    public service: PredictionService,
    private commonService: CommonService) { }
  
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
    this.updatePlotCombo();
  }

  PreviousMol() {
    this.molIndex--;
    this.noNextMol = false;
    if (this.molIndex === 0) {
      this.noPreviousMol = true;
    }
    this.drawReportHeader();
    this.drawSimilars();
    this.updatePlotCombo();
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
    this.plotScores.data[0].meta = [];
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
          setTimeout(() => {
            this.plotScores.data[0].x = info['PC1'];
            this.plotScores.data[0].y = info['PC2'];
            this.plotScores.data[0].text = info['obj_nam'];
            this.plotScores.data[0].meta = info['SMILES'];
            this.plotScores.data[0].marker.color = info['ymatrix'];
            this.plotScores.data[0].marker.showscale = this.isQuantitative;
            if (this.isQuantitative) {
              this.plotScores.data[0].marker.colorscale= 'RdBu';
            }
            else {
              this.plotScores.data[0].marker.colorscale= 'Bluered';
            } 
          }, 100);
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

        this.modelPresent = true;

        this.modelMatch = (this.modelBuildInfo['modelID'] === this.prediction.modelID);

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
        this.modelPresent = false;
        this.modelMatch = true; // prevent showing also this error!
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

  updatePlotCombo() {

    //Quantitative
    if (this.isQuantitative) {
      this.plotComboQ.data[0].x = [];
      this.plotComboQ.data[1].x = [];
      this.plotComboQ.data[2].x = [];
      this.plotComboQ.data[0].y = [];
      this.plotComboQ.data[1].y = [];
      this.plotComboQ.data[2].y = [];

      const xi = this.predictionResult.xmatrix[this.molIndex];
      this.plotComboQ.data[0].x = xi;
      for (let i=0; i<this.predictionResult.var_nam.length; i++) {
        const varlist=String(this.predictionResult.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];
        this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
        this.plotComboQ.data[1].x[i] = this.predictionResult.values[this.molIndex];
      }
      if (this.predictionResult['ensemble_confidence']){
        const cilist = this.predictionResult.ensemble_confidence[this.molIndex];
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          this.plotComboQ.data[0].error_x.array[i] = cilist[1+(i*2)] - xi[i];
          this.plotComboQ.data[0].error_x.arrayminus[i] = xi[i] - cilist[i*2];
        }
        if (this.predictionResult['upper_limit']){
          for (let i=0; i<this.predictionResult.var_nam.length; i++) {
            const varlist=String(this.predictionResult.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[i] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[i] = this.predictionResult.upper_limit[this.molIndex];
          }
          let j = this.predictionResult.var_nam.length;
          for (let i=this.predictionResult.var_nam.length-1; i>-1; i--) {
            const varlist=String(this.predictionResult.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[j] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[j] = this.predictionResult.lower_limit[this.molIndex];
            j++;
          }
        }

      }
    }
    // Qualitative
    // TODO: show ensemble prediction
    else {
      const xi = this.predictionResult.xmatrix[this.molIndex];
      this.plotComboC.data[0].x = [];
      this.plotComboC.data[1].x = [];
      this.plotComboC.data[0].y = [];
      this.plotComboC.data[1].y = [];

      // Conformal, add classes
      if (this.predictionResult.ensemble_confidence) {
        const class_list = this.predictionResult.ensemble_confidence[this.molIndex];
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          const varlist=String(this.predictionResult.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          
          this.plotComboC.data[0].x[i] = 0;
          this.plotComboC.data[1].x[i] = 0;
        }
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          if (class_list[i*2]===1) {
            this.plotComboC.data[0].x[i] += -1;
          }
          if (class_list[1+(i*2)]===1) {
            this.plotComboC.data[1].x[i] += 1;
          }
        }

      }
      // non-conformal, just show final result (including uncertain)
      else {
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          const varlist=String(this.predictionResult.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
  
          if (xi[i]===0) {
            this.plotComboC.data[0].x[i] = -1;
            this.plotComboC.data[1].x[i] = 0;
          } else if (xi[i]===1) {
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 1;
          } else {
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 0;
          }
        }
      }
    }
  }

  getPrediction() {
    this.predictionVisible = false;
    this.predictionResult = undefined;
    $('#prediction').DataTable().destroy();
    // $('#predictionOne').DataTable().destroy();

    this.modelValidationInfo = {};

    this.commonService.getPrediction(this.predictionName).subscribe(
      result => {
        if (result['error']) {
          this.predictionError = result['error']; 
        }

        setTimeout(() => {
          if ('PC1proj' in result) {
            this.plotScores.data[1].x = result['PC1proj'];
            this.plotScores.data[1].y = result['PC2proj'];
            this.plotScores.data[1].text = result['obj_nam'];
            this.plotScores.data[1].meta = result['values'];
          };
        }, 100);

        this.predictionResult = result;

        this.updatePlotCombo();

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
        }
        
        const options_list = {'width': 300, 'height': 150};
        const smilesDrawer = new SmilesDrawer.Drawer(options_list);
        
        // use a long timeout because this can take a lot of time
        setTimeout(() => {

          this.components.forEach((child) => {
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
            destroy: true,
            deferRender: true,
            // order: []
          };

          $('#prediction').DataTable(settingsObj);

          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              me.drawReportHeader();
              me.drawSimilars();
            }
          });
          

          // if (this.modelMatch){
          if (this.modelMatch){

            const options = {'width': 300, 'height': 300};
            const smilesDrawerScores = new SmilesDrawer.Drawer(options);    
    
            const canvas_ref = <HTMLCanvasElement>document.getElementById('scores_canvas_ref');
            const context_ref = canvas_ref.getContext('2d');
    
            const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas_pre');
            const context = canvas.getContext('2d');
            
            PlotlyJS.newPlot('scoresPreDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresPreDIV');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              // console.log (points)
              if (points.curveNumber === 1) {
                SmilesDrawer.parse(result['SMILES'][points.pointNumber], function(tree) {
                  smilesDrawerScores.draw(tree, 'scores_canvas_ref', 'light', false);
                });   
                context_ref.font = "30px Barlow Semi Condensed";
                context_ref.fillText(result['obj_nam'][points.pointNumber], 20, 50); 
              }
              else {
                SmilesDrawer.parse(points.meta, function(tree) {
                  smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
                });
              }
            });
            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(eventdata){
              var points = eventdata.points[0];
              if (points.curveNumber === 0) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            });
            myPlot.on('plotly_click', function(eventdata){
              var points = eventdata.points[0];
              if (points.curveNumber === 1) {
                context_ref.clearRect(0, 0, canvas_ref.width, canvas_ref.height);
              }
            });
          }
            
            
          this.predictionVisible = true;
            
          }, 500);
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
