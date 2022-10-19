import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { CustomHTMLElement, Prediction, Profile } from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonFunctions } from '../common.functions';
import * as PlotlyJS from 'plotly.js-dist-min';
import { SplitComponent } from 'angular-split';
import { ProfilingService } from '../profiling.service';
import { PredictorService } from '../predictor/predictor.service';
@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit {

  objectKeys = Object.keys;
  molIndex: number = undefined;
  molSelected: string = '';
  dmodx = false;
  isConfidential: boolean = false;
  modelBuildInfo = {};
  submodels = [];
  modelPresent: boolean = true;
  modelMatch: boolean;
  isQuantitative: any;
  isMajority: boolean;
  dmodx_val = [];
  activity_val = [];
  showConcentration = false;

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
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
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
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
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
      width: 800,
      height: 600,
      hovermode: 'closest',
      margin: {r: 10, t: 30, pad: 0 },
      showlegend: false,
      showtitle: true,
      titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
      title: 'Prediction projected on training series',
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
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_prediction',
        width: 800,
        height: 600,
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
  constructor(
    public prediction: Prediction,
    private commonService: CommonService,
    public commonFunctions: CommonFunctions,
    private service: PredictorService,
    public profile: Profile,
    private profiling : ProfilingService,
  ) {}

  ngOnInit(): void {
    this.commonService.idxmodelmol$.subscribe((index) => {
      this.molIndex = index[0];
      this.getInfo();
      this.getValidation();
      this.getProfileItem(index[1]);
      this.renderData();   
    });
  }
  // angular-split function
  @ViewChild('mySplit') mySplitEl: SplitComponent
    // area size
    _size1=50;
    _size2=50;
  get size1() {
    return this._size1;
  }

  set size1(value) {
      this._size1 = value;
  }
  get size2() {
    return this._size2;
  }

  set size2(value) {
      this._size2 = value;
  }
  gutterClick(e) {
    if(e.gutterNum === 1) {
        if(e.sizes[1] !== 0 ) {
          this.size1 = 100;
          this.size2 = 0;
        }
        else{
          this.size2 = 50;
          this.size1 = 50;
        } 
    }
}
  getValidation(){
    this.commonService.getValidation(this.prediction.modelName,this.prediction.modelVersion).subscribe(
      result => {
        this.modelPresent = true;
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
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
            } else {
              this.plotScores.layout.xaxis.title = labelX
              this.plotScores.layout.yaxis.title = labelY
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
            }
        }
      },error => {
        this.modelPresent = false;
      }
    )
  }

  getProfileItem(idxModel:number){
    this.profiling.profileItem(this.profile.name,idxModel).subscribe(result => {
      if(result) {
        this.profile.item = result;
        this.plotScores.data[1].x = [result['PC1proj'][this.molIndex]];
        this.plotScores.data[1].y = [result['PC2proj'][this.molIndex]];

        this.plotScores.data[1].text = [this.prediction.molSelected];
        
        this.activity_val = this.profile.item.values[this.molIndex]

        if (!this.isQuantitative){
          for (var i=0; i<this.activity_val.length; i++){
            if (this.activity_val[i]<0.0) {
              this.activity_val[i]=0.5;
            }
          }
        }
        this.plotScores.data[1].meta = [this.activity_val];



        if ('PCDMODX' in result) {
          this.dmodx = true;
          this.plotScores.data[1].marker.color = result['PCDMODX'];
          this.dmodx_val = result['PCDMODX'];
        }
        else {
          this.dmodx = false;
            this.plotScores.data[1].marker.color[0] = 0.0;
            this.dmodx_val[0] = 0.0;
        }
      
        this.updatePlotCombo();
        
        setTimeout(() => {
          this.setScoresPlot(result,this.molIndex)
        },40)
      }
    }, error => {
      console.log(error);
    })
  }

  drawReportHeader() {
    const options = { width: 600, height: 300 };
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(
      this.profile.summary.SMILES[this.molIndex],
      function (tree) {
        // Draw to the canvas
        smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  backConc(value: any) {
    return (Math.pow(10,6-value).toFixed(4))
  }

  renderData() {
    this.prediction.molSelected = this.profile.summary.obj_nam[this.molIndex];
    setTimeout(() => {
      this.showConcentration = false;
      this.commonService.getDocumentation(this.prediction.modelName ,this.prediction.modelVersion,'JSON').subscribe((res) => {
        this.prediction.modelDocumentation = res;
        let unit = this.prediction.modelDocumentation['Endpoint_units'].value;
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


      },error => {
        console.log(error)
      })
      setTimeout(() => {
        this.drawReportHeader();
        this.drawSimilars();
      }, 150);
      
    },50)
  }

  drawSimilars () {
      // draw similar compounds (if applicable)
      if (this.profile.item.hasOwnProperty('search_results')) {
        const optionsA = {'width': 400, 'height': 150};
        const smiles = this.profile.item.search_results[this.molIndex].SMILES;
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
  }

  updatePlotCombo() {
    const xi = this.profile.item.xmatrix[this.molIndex];
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
      for (let i=0; i<this.profile.item.var_nam.length; i++) {
        const varlist=String(this.profile.item.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];

        if (this.isQuantitative){
          this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboQ.data[1].x[i] = this.profile.item.values[this.molIndex];
        }

      }
      var drawCI = false;
      if (this.profile.item['ensemble_ci']){
        drawCI = true
        var cilist = this.profile.item.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.profile.item['ensemble_confidence']){
          drawCI = true
          var cilist = this.profile.item.ensemble_confidence[this.molIndex];
         }
      }
      if (drawCI){
        for (let i=0; i<this.profile.item.var_nam.length; i++) {
          var cia = cilist[1+(i*2)] - xi[i];
          var cib = xi[i] - cilist[i*2];

          // avoid using c0 and c1 as CI ranges. c0/c1 are integers -1, 0 or 1
          if (!Number.isInteger(cia) && !Number.isInteger(cib) ) {
            this.plotComboQ.data[0].error_x.array[i] = cia;
            this.plotComboQ.data[0].error_x.arrayminus[i] = cib;
          }
        }

        if (this.isQuantitative && this.profile.item['upper_limit']){
          for (let i=0; i<this.profile.item.var_nam.length; i++) {
            const varlist=String(this.profile.item.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[i] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[i] = this.profile.item.upper_limit[this.molIndex];
          }
          let j = this.profile.item.var_nam.length;
          for (let i=this.profile.item.var_nam.length-1; i>-1; i--) {
            const varlist=String(this.profile.item.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[j] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[j] = this.profile.item.lower_limit[this.molIndex];
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
      if (this.profile.item['ensemble_ci']){
        drawCI = true
        var class_list = this.profile.item.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.profile.item['ensemble_confidence']){
          drawCI = true
          var class_list = this.profile.item.ensemble_confidence[this.molIndex];
         }
      }

      if (drawCI) {

        for (let i=0; i<this.profile.item.var_nam.length; i++) {
          const varlist=String(this.profile.item.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          
          this.plotComboC.data[0].x[i] = 0;
          this.plotComboC.data[1].x[i] = 0;
        }
        for (let i=0; i<this.profile.item.var_nam.length; i++) {
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

        for (let i=0; i<this.profile.item.var_nam.length; i++) {
          const varlist=String(this.profile.item.var_nam[i]).split(':');
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

  castValue(value:number) {
    if (this.modelBuildInfo['quantitative']) return value.toFixed(3) 
    return value == 1 ? 'Positive' : value == 0 ? 'Negative' : 'Uncertain';
  }
  getInfo(): void {
    this.isConfidential = false;
    this.modelBuildInfo['confidential'] = false;
    this.commonService.getModel(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        for (const info of result) {
          this.modelBuildInfo[info[0]] = info[2];
        }
        if(this.modelBuildInfo['confidential']){
          this.isConfidential = true;
          this.size1 = 100;
          this.size2 = 0;
        } else {
          this.size1 = 50;
          this.size2 = 50;
        }
        //support for legacy models using significance instead of confidence
        if (this.modelBuildInfo['conformal_significance']!=undefined){
          this.modelBuildInfo['conformal_confidence'] = 1.0 - this.modelBuildInfo["conformal_significance"];
        }

        this.modelPresent = true;

        this.modelMatch = (this.modelBuildInfo['modelID'] === this.prediction.modelID);
        console.log(this.modelMatch)

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
  public changeProjectStyleTrainingMark (event:any) {
    var value = event.target.value;
    var update = {'visible':[true, true, false]}
    if (value == 'density') {
      update = {'visible':[false, true, true]}
    }
    if (value == 'both') {
      update = {'visible':[true, true, true]}
    }
    PlotlyJS.restyle('scoresPreDIV', update);
  }
  public changeProjectStylePredictionMark (event:any) {
    var value = event.target.value;
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
  public changeProjectStyleTrainingColor (event:any) {
    var value = event.target.value;
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
  public changeProjectStylePredictionColor (event:any) {
    var value = event.target.value;
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
  public changeProjectStyle (event) {
    var value = event.target.value;
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
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
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




  setScoresPlot (result,molIndex) {
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
        SmilesDrawer.parse(result['SMILES'][molIndex], function(tree) {
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

}
