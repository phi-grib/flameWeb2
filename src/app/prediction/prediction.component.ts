import { Component, ViewChildren, QueryList, ElementRef, Input, OnChanges } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
// import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PredictionService } from './prediction.service';
import { Prediction, CustomHTMLElement, Globals } from '../Globals';
import 'datatables.net-bs4';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
// import { flatten } from '@angular/compiler';
// import { stringify } from 'querystring';

declare var $: any;

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']/*,
  encapsulation: ViewEncapsulation.ShadowDom*/
})

// export class PredictionComponent implements AfterViewInit, OnChanges {
export class PredictionComponent implements OnChanges {

  @Input() predictionName;
  @ViewChildren('cmp') components: QueryList<ElementRef>;
  
  objectKeys = Object.keys;
  predictionVisible = false;
  modelMatch = true;
  modelPresent = true;
  dmodx = false;
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
  isMajority = false;
  showConcentration = false;
  activity_val = [];
  dmodx_val = [];

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
      width: 300,
      height: 300,
      // margin: {r: 10, t: 10, b:0, pad: 0 },
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
    
    bwcolorscale = [
      [0.0, 'rgb(160, 160, 160)'],
      [0.5, 'rgb(160, 160, 160)'],
      [1.0, 'rgb(160, 160, 160)'],
    ];
  
    greencolorscale = [
      [0.0, 'rgb(0, 107, 107)'],
      [0.5, 'rgb(0, 107, 107)'],
      [1.0, 'rgb(0, 107, 107)'],
    ];

    redcolorscale = [
      [0.0, 'rgb(255, 0, 0)'],
      [0.5, 'rgb(255, 0, 0)'],
      [1.0, 'rgb(255, 0, 0)'],
    ];

    // [0.1, '#6be831'],

  scores0defaults = {
    x: [], 
    y: [], 
    text: [],
    meta: [],
    type: 'scatter', 
    mode: 'markers', 
    visible: true, 
    marker: {
      color: [],
      opacity: 0.6,
      size: 10,
      colorscale: this.bwcolorscale,
      showscale: false, 
      cauto: true,
      colorbar: {
        x: -0.25,
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 }
      }
    },
    hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
  };

  scores1defaults = { x: [], 
    y: [], 
    text: [],
    meta: [],
    type: 'scatter', 
    mode: 'markers', 
    textfont : {
      color : 'red',
      size: 16
    },
    textposition: 'top right',
    marker: {
      color: [],
      symbol: 'circle',
      colorscale: this.redcolorscale, 
      showscale: false, 
      opacity: 1,
      size: 14,
      line: {},
      colorbar: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 }
      }
    },
    hovertemplate:'<b>%{text}</b><br>%{meta:.2f}<extra></extra>',
  };

  scores2defaults = {
    x: [],
    y: [],
    autocontour: 20,
    showscale: false,
    visible: false, 
    colorscale: 'Greys',
    reversescale: true,
    type: 'histogram2dcontour',
    hoverinfo: 'skip',
  };

  plotScores = {
    data: [
      JSON.parse(JSON.stringify(this.scores0defaults)),
      JSON.parse(JSON.stringify(this.scores1defaults)),
      JSON.parse(JSON.stringify(this.scores2defaults))
    ],
    layout: { 
      width: 700,
      height: 500,
      hovermode: 'closest',
      margin: {r: 10, t: 30, pad: 0 },
      showlegend: false,
      showtitle: true,
      titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
      title: 'Prediction projected on training series',
      xaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC1',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14},
      },
      yaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC2',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14},
      },
    },
    config: {
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_prediction',
        width: 600,
        height: 400,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['autoScale2d','hoverCompareCartesian']
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
      width: 700,
      height: 500,
      hovermode: 'x',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 14 } },
      xaxis: {
        zeroline: false,
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 600,
        height: 400,
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
      width: 700,
      height: 500,
      // margin: {r: 10, t: 30, b:0, pad: 0 },
      barmode: 'relative',
      hovermode: 'closest',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 14 } },
      xaxis: {
        range: [-1.1, 1.1],
        zeroline: true,
        zerolinewidth: 4,
        zerolinecolor: 'black',
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        tickvals: [-1.1, 0, 1.1],
        ticktext: ['negative', 'undefined', 'positive']
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 700,
        height: 500,
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
    private commonService: CommonService,
    public globals: Globals) { }
  
  message = '';
  
  public changeProjectStyleTrainingMark (value:string) {
    var update = {'visible':[true, true, false]}
    if (value == 'density') {
      update = {'visible':[false, true, true]}
    }
    if (value == 'both') {
      update = {'visible':[true, true, true]}
    }
    PlotlyJS.restyle('scoresPreDIV', update);
  }
  
  public changeProjectStylePredictionMark (value:string) {
    var update1 = {};
    if (value == 'dots'){
      update1 = {
        "mode": "markers",
        "marker.symbol": 'circle',
        "marker.line.width": 0
      }
    }
    if (value == 'crosses'){
      update1 = {
        "mode": "markers",
        "marker.symbol": 'cross',
      }
    }
    if (value == 'names') {
      update1 = {
        "mode": "markers+text",
        "marker.symbol": 'circle-open',
        "marker.line.width":3
      }
    }
    PlotlyJS.restyle('scoresPreDIV', update1, [1]);
  }

  public changeProjectStyleTrainingColor (value:string) {
    var update0 = {};

    if (value == 'grey') {
      update0 = {
       'marker.colorscale': [this.bwcolorscale],
       'marker.opacity': 0.6,
       'marker.showscale': false,
      }
    }
    if (value == 'green') {
      update0 = {
       'marker.colorscale': [this.greencolorscale],
       'marker.opacity': 0.2,
       'marker.showscale': false,
      }
    }
    if (value == 'activity') {
      var newcolorscale = 'Bluered';
      if (this.isQuantitative) newcolorscale = 'RdBu';

      // points colored by activity
      update0 = {
        'marker.colorscale': newcolorscale,
        'marker.opacity': 0.6,
        'marker.showscale': this.isQuantitative,
      }
    }
    PlotlyJS.restyle('scoresPreDIV', update0, [0]);
  }

  public changeProjectStylePredictionColor (value:string) {
    var update1 = {};
    if (value == 'red'){
      update1 =  {
        "marker.color": 'red',
        "textfont.color": 'red',
        'marker.showscale': false,
      };
    }
    if (value == 'activity') {
      if (this.isQuantitative) {
        update1 =  {
          'marker.color': [this.activity_val],
          "textfont.color": 'black',
          'marker.colorscale': 'RdBu',
          'marker.showscale': true,
          'marker.cauto': true
        };
      }
      else {
        update1 =  {
          'marker.color': [this.activity_val],
          "textfont.color": 'black',
          'marker.colorscale': 'Bluered',
          'marker.showscale': false,
          'marker.cauto': false,
          'marker.cmin': 0.0,
          'marker.cmax': 1.0
        };
      }

    }
    if (value == 'dmodx') {
      update1 =  {
        'marker.color': [this.dmodx_val],
        "textfont.color": 'black',
        'marker.colorscale': 'RdBu',
        'marker.showscale': true,
      };
    }
    PlotlyJS.restyle('scoresPreDIV', update1, [1]);
  }


  public changeProjectStyle (value:string) {
    var update0 = {};
    var update1 = {};
    
    const backup_colors0 = this.plotScores.data[0].marker.color;
    const backup_colors1 = this.plotScores.data[1].marker.color;

    if (value=='points' || value=='dmodx') {
      
      // grey background
      update0 = {
        marker: {
          color: backup_colors0,
          opacity: 0.6,
          size: 10,
          colorscale: this.bwcolorscale, 
          showscale: false, 
          cauto: true
        }
      }

      // DModX 
      if (this.dmodx && value=='dmodx') {
        update1 =  {
          mode: 'markers', 
          marker: {
            color: backup_colors1,
            symbol: 'circle',
            opacity: 0.6,
            size: 14,
            colorscale: 'RdBu',
            showscale: true,
            cauto: true,
            colorbar: {
              title: 'DModX',
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 }
            }
          }
        };
      }
      // red points
      else {
        update1 =  {
          mode: 'markers', 
          marker: {
            color: backup_colors1,
            symbol: 'circle',
            opacity: 0.6,
            size: 14,
            colorscale: this.redcolorscale,
            showscale: false,
          }
        };
      }

    }
    else {
      var newcolorscale = 'Bluered';
      if (this.isQuantitative) newcolorscale = 'RdBu';

      // points colored by activity
      update0 = {
        marker: {
          color: backup_colors0,
          opacity: 0.6,
          size: 10,
          colorscale: newcolorscale,
          showscale: this.isQuantitative, 
          cauto: true,
          colorbar: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
          }
        }
      }

      // markers + text
      update1 = {
        mode: 'markers+text', 
        marker: {
          symbol: 'circle-open',
          color: backup_colors1,
          colorscale: this.greencolorscale,
          showscale: false,
          opacity: 1,
          size: 14,
          line: {
            color: '#6be831',
            width: 3
          },
        },
      };
    }
    PlotlyJS.restyle('scoresPreDIV', update0, 0);
    PlotlyJS.restyle('scoresPreDIV', update1, 1);
    // console.log(update0);
  }

  drawReportHeader () {
    const options = {'width': 400, 'height': 200};
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
        const optionsA = {'width': 300, 'height': 200};
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

    this.activity_val = [];
    this.dmodx_val = [];
    this.plotScores.data = [
      JSON.parse(JSON.stringify(this.scores0defaults)),
      JSON.parse(JSON.stringify(this.scores1defaults)),
      JSON.parse(JSON.stringify(this.scores2defaults))
    ];

    this.getPrediction();
    this.getInfo();
    this.getDocumentation();  
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
    this.updatePlotCombo();

  }

  getValidation() {
    this.commonService.getValidation(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        const info = result;
        if ('PC1' in info) {

          // define appropriate labels extracting from manifest
          const manifest = info['manifest'];
          var labelX = 'PCA PC1';
          var labelY = 'PCA PC2';
          for (var iman in manifest) {
            if (manifest[iman]['key'] == 'PC1') {
              labelX = manifest[iman]['label'];
            }
            if (manifest[iman]['key'] == 'PC2') {
              labelY = manifest[iman]['label'];
            }
          }

          setTimeout(() => {
            this.plotScores.data[0].x = info['PC1'];
            this.plotScores.data[0].y = info['PC2'];
            this.plotScores.data[2].x = info['PC1'];
            this.plotScores.data[2].y = info['PC2'];
            this.plotScores.data[0].text = info['obj_nam'];
            this.plotScores.data[0].meta = info['SMILES'];
            this.plotScores.data[0].marker.color = info['ymatrix'];

            if ('SSX' in info) {
              this.plotScores.layout.xaxis.title = labelX + ' ('+(100.0*(info['SSX'][0])).toFixed(1)+'% SSX)';
              this.plotScores.layout.yaxis.title = labelY + ' ('+(100.0*(info['SSX'][1])).toFixed(1)+'% SSX)';
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
            } else {
              this.plotScores.layout.xaxis.title = labelX
              this.plotScores.layout.yaxis.title = labelY
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
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

        //support for legacy models using significance instead of confidence
        if (this.modelBuildInfo['conformal_significance']!=undefined){
          this.modelBuildInfo['conformal_confidence'] = 1.0 - this.modelBuildInfo["conformal_significance"];
        }

        this.modelPresent = true;

        this.modelMatch = (this.modelBuildInfo['modelID'] == this.prediction.modelID);

        this.isQuantitative = this.modelBuildInfo['quantitative'];
        this.isMajority = this.modelBuildInfo['model'] == 'combination:majority voting' || 
                          this.modelBuildInfo['model'] == 'combination:logical OR' ;

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
    this.showConcentration = false;
    this.commonService.getDocumentation(this.prediction.modelName, this.prediction.modelVersion, 'JSON').subscribe(
      result => {
        this.modelDocumentation = result;

        let unit = this.modelDocumentation['Endpoint_units'].value;
        if (unit != null) {
          if (unit.slice(-3)=='(M)') {
            if (unit.slice(0,1)=='p') {
              this.showConcentration = true;
            }
            if (unit.slice(0,4)=='-log') {
              this.showConcentration = true;
            }
          }

          //update plots with "Activity" and replace with units
        }
        
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

  backConc(value: any) {
    return (Math.pow(10,6-value).toFixed(4))
  }

  isInteger(value: any) {
    return value % 1 == 0;
  }

  updatePlotCombo() {
    const xi = this.predictionResult.xmatrix[this.molIndex];
    // console.log (xi);
     
    // the results are shown using plotComboQ but in the case
    // of majority. only in this case we are using qualitative low level models
    // as qualitative variables
    if (!this.isMajority) {
      this.plotComboQ.data[0].x = [];
      this.plotComboQ.data[1].x = [];
      this.plotComboQ.data[2].x = [];
      this.plotComboQ.data[0].y = [];
      this.plotComboQ.data[1].y = [];
      this.plotComboQ.data[2].y = [];
      this.plotComboQ.data[0].error_x.array = [];
      this.plotComboQ.data[0].error_x.arrayminus = [];

      this.plotComboQ.data[0].x = xi;
      for (let i=0; i<this.predictionResult.var_nam.length; i++) {
        const varlist=String(this.predictionResult.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];

        if (this.isQuantitative){
          this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboQ.data[1].x[i] = this.predictionResult.values[this.molIndex];
        }

      }
      var drawCI = false;
      if (this.predictionResult['ensemble_ci']){
        drawCI = true
        var cilist = this.predictionResult.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.predictionResult['ensemble_confidence']){
          drawCI = true
          var cilist = this.predictionResult.ensemble_confidence[this.molIndex];
         }
      }
      if (drawCI){
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          var cia = cilist[1+(i*2)] - xi[i];
          var cib = xi[i] - cilist[i*2];

          // avoid using c0 and c1 as CI ranges. c0/c1 are integers -1, 0 or 1
          if (!this.isInteger(cia) && !this.isInteger(cib) ) {
            this.plotComboQ.data[0].error_x.array[i] = cia;
            this.plotComboQ.data[0].error_x.arrayminus[i] = cib;
          }
        }

        if (this.isQuantitative && this.predictionResult['upper_limit']){
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
      this.plotComboC.data[0].x = [];
      this.plotComboC.data[1].x = [];
      this.plotComboC.data[0].y = [];
      this.plotComboC.data[1].y = [];

      // Conformal, add classes
      var drawCI = false;
      if (this.predictionResult['ensemble_ci']){
        drawCI = true
        var class_list = this.predictionResult.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.predictionResult['ensemble_confidence']){
          drawCI = true
          var class_list = this.predictionResult.ensemble_confidence[this.molIndex];
         }
      }

      if (drawCI) {

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
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 0;
          } else if (xi[i]===1) {
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 1;
          } else {
            this.plotComboC.data[0].x[i] = -1;
            this.plotComboC.data[1].x[i] = 0;
          }
        }
      }
    }
  }

  setScoresPlot (result) {
    const options = {'width': 400, 'height': 250};
    const smilesDrawerScores = new SmilesDrawer.Drawer(options);    

    // const canvas_ref = <HTMLCanvasElement>document.getElementById('scores_canvas_ref');
    // const context_ref = canvas_ref.getContext('2d');

    const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas_pre');
    const context = canvas.getContext('2d');
    
    PlotlyJS.newPlot('scoresPreDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
    
    let myPlot = <CustomHTMLElement>document.getElementById('scoresPreDIV');
    
    // on hover, draw the molecule
    myPlot.on('plotly_hover', function(eventdata){ 
      var points = eventdata.points[0];
      if (points.curveNumber === 1) {
        SmilesDrawer.parse(result['SMILES'][points.pointNumber], function(tree) {
          smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
          // smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
        });   
        // context_ref.font = "30px Barlow Semi Condensed";
        // context_ref.fillText(result['obj_nam'][points.pointNumber], 20, 50); 
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

    // myPlot.on('plotly_click', function(eventdata){
    //   var points = eventdata.points[0];
    //   if (points.curveNumber === 1) {
    //     context_ref.clearRect(0, 0, canvas_ref.width, canvas_ref.height);
    //   }
    // });
    
    const sel_options = {'width': 200, 'height': 125};
    const smilesDrawerScoresSelected = new SmilesDrawer.Drawer(sel_options);   

    myPlot.on('plotly_selected', function(eventdata){
      var tbl = <HTMLTableElement>document.getElementById('tablePredictionSelections');
      if (eventdata != null && 'points' in eventdata) {
        var points = eventdata.points;
        // console.log(points);
        points.forEach(function(pt) {
          const tr = tbl.insertRow();

          var ismiles = '';
          var iactiv = ''; 
          var canvasid = '';
          if (pt.curveNumber === 0) {
            ismiles = pt.meta;
            iactiv = pt["marker.color"];
            canvasid = 'reference'+pt.pointNumber;
          }
          else {
            tr.setAttribute('style', 'background: #f7f9ea');
            ismiles = result['SMILES'][pt.pointNumber];
            iactiv = pt.meta.toFixed(2);
            canvasid = 'prediction'+pt.pointNumber;
          }
          const tdname = tr.insertCell();
          tdname.appendChild(document.createTextNode(pt.text));
          tdname.setAttribute('style', 'max-width:100px')

          const tdsmiles = tr.insertCell();
          tdsmiles.setAttribute('class', 'align-middle text-center' )
          const icanvas = document.createElement('canvas')
          icanvas.setAttribute('id', canvasid);
          tdsmiles.appendChild(icanvas);
          SmilesDrawer.parse(ismiles, function(tree) {
            smilesDrawerScoresSelected.draw(tree, canvasid, 'light', false);
          });

          const tdactiv = tr.insertCell();
          tdactiv.setAttribute('class', 'align-right' )
          tdactiv.appendChild(document.createTextNode(iactiv));

        });
      }
      else {
        for(var i = 1;i<tbl.rows.length;){
          tbl.deleteRow(i);
        }
      }  
    });
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
        
        // setTimeout(() => {
          if ('PC1proj' in result) {
            this.plotScores.data[1].x = result['PC1proj'];
            this.plotScores.data[1].y = result['PC2proj'];
            this.plotScores.data[1].text = result['obj_nam'];
            this.activity_val = result['values']

            if (!this.isQuantitative){
              for (var i=0; i<this.activity_val.length; i++){
                if (this.activity_val[i]<0.0) {
                  this.activity_val[i]=0.5;
                }
              }
            }
            // this.plotScores.data[1].meta = result['values'];
            this.plotScores.data[1].meta = this.activity_val;
            if ('PCDMODX' in result) {
              this.dmodx = true;
              this.plotScores.data[1].marker.color = result['PCDMODX'];
              this.dmodx_val = result['PCDMODX'];
            }
            else {
              this.dmodx = false;
              for (var i=0; i<result['obj_nam'].length; i++) {
                this.plotScores.data[1].marker.color[i] = 0.0;
                this.dmodx_val[i] = 0.0;
              }
            }

          };
          
        // }, 100);

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
        
        
        const options_list = {'width': 200, 'height': 125};
        const smilesDrawer = new SmilesDrawer.Drawer(options_list);
        
        // use a long timeout because this can take a lot of time
        setTimeout(() => {

          // List Tab
          let istructure = 0;

          this.components.forEach((child) => {
            if (istructure < 100) {
              SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
                smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
                }, function (err) {
                  console.log(err);
                });
              istructure++;
            };
          });
          
          // add buttons to table
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
              // const self = this;
              $('td', row).unbind('click');
              $('td', row).bind('click', () => {
                this.tabClickHandler(data);
              });
              return row;
            },
            destroy: true,
            deferRender: true,
          };

          $('#prediction').DataTable(settingsObj);
          
          // Report tab
          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              me.drawReportHeader();
              me.drawSimilars();
            }
          });

          // Series tab
          // scores plot requires to define interactive behaviour
          if (this.modelMatch){
            this.setScoresPlot(result)
          }

          this.predictionVisible = true;
            
          }, 1000);
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

    // old version of autoTable

    // pdf.autoTable({
    //   head: [this.head],
    //   body: this.info,
    //   headStyles: {
    //     2: { halign: 'center'},
    //     3: { halign: 'center'},
    //   },
    //   columnStyles: {
    //     0: {columnWidth: 40},
    //     1: {columnWidth: 40},
    //     2: {columnWidth: 10, halign: 'center'},
    //     3: {columnWidth: 10, halign: 'center'},
    //   }
    // });

    // autoTable (pdf,{
    //   head: [this.head],
    //   body: this.info,
    //   columnStyles: {
    //     0: {cellWidth: 40},
    //     1: {cellWidth: 40},
    //     2: {cellWidth: 10},
    //     3: {cellWidth: 10}
    //   }
    // } );

    autoTable (pdf,{html: '#prediction'} );

    pdf.save(this.prediction.name + '.pdf');
  }

//   ngAfterViewInit() {
//     // pdf.autoTable({html: '#info'});
//     this.info = [];
//     this.head = ['Name', 'Mol'];

//     if (this.predictionResult !== undefined) {
//       if (this.predictionResult.ymatrix) {
//         this.head.push('Value');
//       }
//       if ( this.predictionResult.values) {
//         this.head.push('Prediction');
//       }
//       if ( this.predictionResult.upper_limit) {
//         this.head.push('Upper limit');
//       }
//       if ( this.predictionResult.lower_limit) {
//         this.head.push('Lower limit');
//       }
//       if ( this.predictionResult.c0) {
//         this.head.push('Inactive');
//       }
//       if ( this.predictionResult.c1) {
//         this.head.push('Active');
//       }
//       if ( this.predictionResult.ensemble_c0) {
//         this.head.push('Ensemble Class 0');
//       }
//       if ( this.predictionResult.ensemble_c1) {
//         this.head.push('Ensemble Class 1');
//       }

//       let prediction = [];
//       for (let i = 0; i < this.predictionResult.SMILES.length;) {
//         prediction = [];
//         prediction = [this.predictionResult.obj_nam[i], this.predictionResult.SMILES[i]];

//         if (this.predictionResult.ymatrix) {
//           prediction.push(this.predictionResult.ymatrix[i].toFixed(3));
//         }
//         if (this.predictionResult.values) {
//           prediction.push(this.predictionResult.values[i].toFixed(3));
//         }
//         if (this.predictionResult.upper_limit) {
//           prediction.push(this.predictionResult.upper_limit[i].toFixed(3));
//         }
//         if (this.predictionResult.lower_limit) {
//           prediction.push(this.predictionResult.lower_limit[i].toFixed(3));
//         }
//         if (this.predictionResult.c0) {
//           prediction.push(this.predictionResult.c0[i]);
//         }
//         if (this.predictionResult.c1) {
//           prediction.push(this.predictionResult.c1[i]);
//         }
//         if ( this.predictionResult.ensemble_c0) {
//           this.head.push(this.predictionResult.ensemble_c0[i].toFixed(3));
//         }
//         if ( this.predictionResult.ensemble_c1) {
//           this.head.push(this.predictionResult.ensemble_c1[i].toFixed(3));
//         }
//         this.info.push(prediction);
//         i = i + 1;
//       }
//     }
//   }
}
