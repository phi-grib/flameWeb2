import { Component, ViewChildren, QueryList, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
import * as PlotlyJS from 'plotly.js-dist-min';
import { Prediction, CustomHTMLElement, Globals, Model, Compound } from '../Globals';
// import 'datatables.net-bs4';
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
export class PredictionComponent implements OnInit {
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


  
  constructor(public prediction: Prediction,public model: Model, public global: Globals,private commonService:CommonService, public compound: Compound) { }

  ngOnInit(): void {
    // this.commonService.idxmodelmol$.subscribe(result => {
    //   console.log(result);
    // })

  }

  PreviousModel() {
    this.submodelsIndex--;
    this.noNextModel = false;
    if (this.submodelsIndex === 0) {
      this.noPreviousModel = true;
    }
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
  public changeProjectStyleTrainingMark (target:any) {
    var update: any = {'visible':[true, true, false]}
    if (target.value == 'density') {
      update = {'visible':[false, true, true]}
    }
    if (target.value == 'both') {
      update = {'visible':[true, true, true]}
    }
    PlotlyJS.restyle('scoresPreDIV', update);
  }
  public changeProjectStyleTrainingColor (target:any) {
    var update0 = {};

    if (target.value == 'grey') {
      update0 = {
       'marker.colorscale': [this.bwcolorscale],
       'marker.opacity': 0.6,
       'marker.showscale': false,
      }
    }
    if (target.value == 'green') {
      update0 = {
       'marker.colorscale': [this.greencolorscale],
       'marker.opacity': 0.2,
       'marker.showscale': false,
      }
    }
    if (target.value == 'activity') {
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

  public changeProjectStylePredictionColor (target:any) {
    var update1 = {};
    if (target.value == 'red'){
      update1 =  {
        "marker.color": 'red',
        "textfont.color": 'red',
        'marker.showscale': false,
      };
    }
    if (target.value == 'activity') {
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
    if (target.value == 'dmodx') {
      update1 =  {
        'marker.color': [this.dmodx_val],
        "textfont.color": 'black',
        'marker.colorscale': 'RdBu',
        'marker.showscale': true,
      };
    }
    PlotlyJS.restyle('scoresPreDIV', update1, [1]);
  }

  public changeProjectStylePredictionMark (target:any) {
    var update1 = {};
    if (target.value == 'dots'){
      update1 = {
        "mode": "markers",
        "marker.symbol": 'circle',
        "marker.line.width": 0
      }
    }
    if (target.value == 'crosses'){
      update1 = {
        "mode": "markers",
        "marker.symbol": 'cross',
      }
    }
    if (target.value == 'names') {
      update1 = {
        "mode": "markers+text",
        "marker.symbol": 'circle-open',
        "marker.line.width":3
      }
    }
    PlotlyJS.restyle('scoresPreDIV', update1, [1]);
  }

  updatePlotCombo() {
    console.log("updateplot")
    console.log(this.molIndex)
    const xi = this.prediction.result.xmatrix[this.molIndex];
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
      for (let i=0; i<this.prediction.result.var_nam.length; i++) {
        const varlist=String(this.prediction.result.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];

        if (this.isQuantitative){
          this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboQ.data[1].x[i] = this.prediction.result.values[this.molIndex];
        }

      }
      var drawCI = false;
      if (this.prediction.result['ensemble_ci']){
        drawCI = true
        var cilist = this.prediction.result.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.prediction.result['ensemble_confidence']){
          drawCI = true
          var cilist = this.prediction.result.ensemble_confidence[this.molIndex];
         }
      }
      if (drawCI){
        for (let i=0; i<this.prediction.result.var_nam.length; i++) {
          var cia = cilist[1+(i*2)] - xi[i];
          var cib = xi[i] - cilist[i*2];

          // avoid using c0 and c1 as CI ranges. c0/c1 are integers -1, 0 or 1
          if (!this.isInteger(cia) && !this.isInteger(cib) ) {
            this.plotComboQ.data[0].error_x.array[i] = cia;
            this.plotComboQ.data[0].error_x.arrayminus[i] = cib;
          }
        }

        if (this.isQuantitative && this.prediction.result['upper_limit']){
          for (let i=0; i<this.prediction.result.var_nam.length; i++) {
            const varlist=String(this.prediction.result.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[i] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[i] = this.prediction.result.upper_limit[this.molIndex];
          }
          let j = this.prediction.result.var_nam.length;
          for (let i=this.prediction.result.var_nam.length-1; i>-1; i--) {
            const varlist=String(this.prediction.result.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[j] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[j] = this.prediction.result.lower_limit[this.molIndex];
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
      if (this.prediction.result['ensemble_ci']){
        drawCI = true
        var class_list = this.prediction.result.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.prediction.result['ensemble_confidence']){
          drawCI = true
          var class_list = this.prediction.result.ensemble_confidence[this.molIndex];
         }
      }

      if (drawCI) {

        for (let i=0; i<this.prediction.result.var_nam.length; i++) {
          const varlist=String(this.prediction.result.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          
          this.plotComboC.data[0].x[i] = 0;
          this.plotComboC.data[1].x[i] = 0;
        }
        for (let i=0; i<this.prediction.result.var_nam.length; i++) {
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

        for (let i=0; i<this.prediction.result.var_nam.length; i++) {
          const varlist=String(this.prediction.result.var_nam[i]).split(':');
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
  NextMol() {
    this.molIndex++;
    this.noPreviousMol = false;
    if ((this.prediction.result.SMILES.length - 1) === this.molIndex) {
      this.noNextMol = true;
    }
    this.drawReportHeader();
    this.drawSimilars();
    this.updatePlotCombo();
  }
  isInteger(value: any) {
    return value % 1 == 0;
  }
  drawSimilars () {
    setTimeout(() => {
      // draw similar compounds (if applicable)
      if (this.prediction.result.hasOwnProperty('search_results')) {
        const optionsA = {'width': 300, 'height': 200};
        const smiles = this.prediction.result.search_results[this.molIndex].SMILES;
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
  backConc(value: any) {
    return (Math.pow(10,6-value).toFixed(4))
  }
  castValue(value: any) {

    if (this.prediction.modelBuildInfo['quantitative']) {
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

  drawReportHeader () {
    const options = {'width': 400, 'height': 200};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.prediction.result.SMILES[this.molIndex], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }


}
