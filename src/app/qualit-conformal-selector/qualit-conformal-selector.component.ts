import { Component, Input, OnChanges } from '@angular/core';
import { CommonService } from '../common.service';
import { CustomHTMLElement, Model } from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js-dist-min';
declare var $:any;

@Component({
  selector: 'app-qualit-conformal-selector',
  templateUrl: './qualit-conformal-selector.component.html',
  styleUrls: ['./qualit-conformal-selector.component.css']
})
export class QualitConformalSelectorComponent implements OnChanges {
    
  constructor(
    private commonService: CommonService,
    public model: Model) { }
    
  @Input() modelName;
  @Input() modelVersion;
  @Input() modelID;
  
  objectKeys = Object.keys;
  modelValidationInfo = {};
  modelTypeInfo = {};
  modelBuildInfo = {};
  modelWarning = '';
  modelVisible = false;
  features = false;
  scores = '';
  scoresLabelX:string;
  scoresLabelY:string;
  ensembleNames = [];
  optimization = false;
  features_method = '';
  featuresTSV = '';
  innerPCA = {};
  
  predictData = [{
      offset: 45, 
      r: [],
      theta: ["TP", "FN", "TN", "FP"],
      meta: ["TP", "FN", "TN", "FP"],
      marker: {
        opacity: 0.8,
        color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],
      },
      type: "barpolar",
      hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  fittingData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FP", "TN", "FN"],
    meta: ["TP", "FP", "TN", "FN"],
    marker: {
      opacity: 0.8,
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  plotCommon = {
    layout :{
      width: 300,
      height: 300,
      // margin: {r: 10, t: 30, b:30, pad: 0 },
      polar: {
        bargap: 0,
        gridcolor: "grey",
        gridwidth: 1,
        radialaxis: {
          angle: 90,
          ticks: '', 
          tickfont: { size: 12, fontStyle: 'Barlow Semi Condensed, sans-serif'},
        },
        angularaxis: {
          showticklabels: false, 
          ticks:'',
        }
      }
    },
    config: {
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
          colorscale: 'Bluered', 
          showscale: false,
          cmax: 1.0,
          cmin: 0.0,
          // size: 14,
          size: 10,
          // line: {
          //   width: 2
          // },
          colorbar: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 }
          }
        },
        hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
      },
      {
        x: [],
        y: [],
        colorscale: 'Greys',
        autocontour: true,
        reversescale: true,
        showscale: false,
        visible: false, 
        type: 'histogram2dcontour',
        hoverinfo: 'skip',
        // contours: { 
        //   // coloring: "none", 
        //   showlines: false,
        //   coloring: 'heatmap' 
        // }
      },
      {
        x: [],
        y: [],
        // text: [],
        type: 'scatter', 
        mode: 'markers', 
        marker: {
          symbol: 'circle',
          color: '#009999',
          opacity: 0.5,
          size: 20,
          // symbol: 'diamond-dot',
          // color: '#42DE2F',
          // opacity: 1.0,
          // size: 10,
          // line: {
          //   color: 'black',
          //   width: 1
          // }
        },
        hoverinfo: 'skip',
        // hovertemplate:'<b>%{text}</b><br>%{x:.2f}, %{y:.2f}<extra></extra>',
      }

    ],
    layout: { 
      width: 700,
      height: 500,
      showtitle: true,
      title: 'Training series (using model X matrix)', 
      titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
      hovermode: 'closest',
          margin: {r: 10, t: 30, pad: 0 },
          showlegend: false,
          xaxis: {
            hoverformat: '.2f',
            zeroline: true,
            showgrid: true,
            showline: true,
            gridwidth: 1,
            linecolor: 'rgb(200,200,200)',
            linewidth: 2,
            title: 'PCA PC1',
            titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
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
            titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          },
    },
    config: {
          displaylogo: false,
          toImageButtonOptions: {
            format: 'svg', // one of png, svg, jpeg, webp
            filename: 'flame_scores',
            width: 700,
            height: 500,
            scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
          },
          // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
          modeBarButtonsToRemove: ['autoScale2d', 'hoverCompareCartesian']    
    }
  };

  plotPie = {
    data:  [{
          values: [],
          labels: ['positive', 'negative'],
          textinfo: "label+percent",
          marker: { colors: ["red", "blue"] },
          type: 'pie'
    }],
    layout: {
          width: 150,
          height: 200,
          showlegend: false,
          // margin: { r: 30, t: 30, b: 10, l: 30, pad: 0 },
          margin: { r: 0, t: 30, b: 0, l: 0, pad: 0 },
    },
    config: {
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
    }
  }

  plotOptimization= {
    data : [{
      type: 'bar',
      x: [],
      y: [],
      // orientation: 'h', 
      error_y: {
        type: 'data',
        array: []
      },
      marker: {
        color: []
      },
      hovertemplate: '<b>%{x}</b><br>%{y:.3f}<extra></extra>'
    }],
    layout : {
      title: 'Optimization results (scorer mean +/- sd)',
      font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
      width: 900,
      height: 600,
      hovermode: 'closest',
      margin: {b:10, t:50, pad: 10},
      xaxis: {
        showticklabels: false, 
        // ticklabeloverflow: 'allow',
        // tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 12 },
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
      },
    },
    config: {
      displaylogo: false,
      showtitle: true, 
      showlegend: false, 
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'optimization_results',
        width: 900,
        height: 600,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }

  plotFeatures= {
    data : [{
      type: 'bar',
      y: [],
      x: [],
      hoverlabel: { bgcolor: "#22577"},
      hovertemplate: '<b>%{x}</b><br>%{y:.3f}<extra></extra>',
      fillcolor: "#B8DCED",
    }],
    layout : {
      title: 'Feature importances (top 50)',
      font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
      width: 900,
      height: 600,
      barmode: 'overlay',
      hovermode: 'closest',
      margin: {b:200, t:50, pad: 10},
      xaxis: {
        tickangle: -45,
        dtick: 1, 
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 12 },
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
      },
    },
    config: {
      displaylogo: false,
      showtitle: true, 
      showlegend: false, 
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_features',
        width: 600,
        height: 500,
        scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }

  plotSummary = {
    data:  [{
          x: ['Sensitivity', 'Specificity', 'MCC', 'Coverage'],
          y: [],
          name:'fitting',
          type: 'bar',
          texttemplate: "%{y:.2f}",
          textposition: 'auto',
          textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          marker: {
            color: 'rgba(70,143,184,0.8)',
          }
        },{
          x: ['Sensitivity', 'Specificity', 'MCC', 'Coverage'],
          y: [],
          name:'prediction',
          type: 'bar',
          texttemplate: "%{y:.2f}",
          textposition: 'auto',
          textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          marker: {
            color: 'rgba(156,198,221,0.8)',
          }
        }],
    layout: {
          yaxis: {
            range: [0.0,1.0],
            // titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          },
          xaxis: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          },
          width: 500,
          height: 300,
          margin: {r: 5, t: 20, b: 20, l:30},
          showlegend: true,
          barmode: 'group'
    },
    config: {
      // displaylogo: false,
      displayModeBar: false
      // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
    }
  }

  public changeProjectStyleMark (value:string) {
    var update = {'visible':[true, false]}
    if (value == 'density') {
      update = {'visible':[false, true]}
    }
    if (value == 'both') {
      update = {'visible':[true, true]}
    }
    PlotlyJS.restyle('scoresDIV_sel', update);
  }
 
  public setInnerModel (value) {

    var innerPCA = undefined;
    for (let i in this.ensembleNames) {
      if (value == this.ensembleNames[i]) {
        innerPCA = this.innerPCA[i];
        break;
      } 
    }
    if (innerPCA == undefined) return;

    this.plotScores.data[0].x = innerPCA['PCA1'];
    this.plotScores.data[0].y = innerPCA['PCA2'];
    this.plotScores.data[2].x = innerPCA['pointsx'];
    this.plotScores.data[2].y = innerPCA['pointsy'];            
    // this.plotScores.data[2].text = [innerPCA['label']];     
    if ('explvar' in innerPCA) {
      this.plotScores.layout.xaxis.title = this.scoresLabelX + ' ('+(100.0*(innerPCA['explvar'][0])).toFixed(1)+'% SSX)';
      this.plotScores.layout.yaxis.title = this.scoresLabelY + ' ('+(100.0*(innerPCA['explvar'][1])).toFixed(1)+'% SSX)';
    }
    else {
      this.plotScores.layout.xaxis.title = this.scoresLabelX;
      this.plotScores.layout.yaxis.title = this.scoresLabelY;
    }
    PlotlyJS.react('scoresDIV_sel',this.plotScores.data, this.plotScores.layout, this.plotScores.config );
  }

  ngOnChanges(): void {
    this.modelVisible = false;
    this.modelTypeInfo = {};
    this.modelValidationInfo = {};
    this.modelBuildInfo = {};
    this.features = false;
    this.scores = '';
    this.scoresLabelX = '';
    this.scoresLabelY = '';
    this.ensembleNames = [];
    this.optimization = false;
    this.features_method = '';
    this.modelWarning = '';
    this.plotScores.data[0].x =[];
    this.plotScores.data[0].y =[];
    this.plotScores.data[0].meta = [];
    this.plotScores.data[1].x =[];
    this.plotScores.data[1].y =[];
    this.plotScores.data[2].x =[];
    this.plotScores.data[2].y =[];
    this.plotScores.data[0].text =[];
    this.plotScores.data[2].text =[];
    this.plotScores.data[0].marker.color = [];
    this.predictData[0].r = [0, 0, 0, 0];
    this.fittingData[0].r = [0, 0, 0, 0];
    this.plotPie.data[0].values = [];
    this.plotFeatures.data[0].y =[];
    this.plotFeatures.data[0].x =[];
    this.plotOptimization.data[0].y =[];
    this.plotOptimization.data[0].x =[];
    this.plotOptimization.data[0].error_y.array =[];
    this.plotOptimization.data[0].marker.color =[];
    this.plotSummary.data[0].y = [];
    this.plotSummary.data[1].y = [];
    this.featuresTSV = '';

    this.getValidation();
  }
  
  isObject(val) {
    if (val === null) {
      return false;
    }
    return typeof val === 'object';
  }
    
  downloadFeatures () {
    var element = document.createElement("a");
    element.setAttribute('href', 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(this.featuresTSV));
    element.setAttribute('download', 'feature_importances'+this.modelName+'v'+this.modelVersion+'.tsv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getValidation() {
    this.commonService.getValidation(this.modelName, this.modelVersion).subscribe(
      result => {
        const info = result;
        
        this.model.input_type = info.meta.input_type;

        // process warnings
        if (info.warning){
          this.modelWarning = info.warning;
        }

        for (const modelInfo of info['model_valid_info']) {
          if (typeof modelInfo[2] === 'number') {
            modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
          }
          if (typeof modelInfo[2] !== 'object') {
            this.modelValidationInfo[modelInfo[0]] = [modelInfo[1], modelInfo[2]];
          }
        }
        
        for (let ielement of info['model_build_info']) {
          this.modelBuildInfo[ielement[0]]=[ielement[1], ielement[2]]
        }
        
        for (let ielement of info['model_type_info']) {
          this.modelTypeInfo[ielement[0]]=[ielement[1], ielement[2]]
        }

        // PCA scores plot
        if ('PC1' in info) {
          this.scores = 'training';

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
          this.plotScores.data[1].x = info['PC1'];
          this.plotScores.data[1].y = info['PC2'];            
          this.plotScores.data[0].text = info['obj_nam'];
          this.plotScores.data[0].meta = info['SMILES'];
          this.plotScores.data[0].marker.color = info['ymatrix'];

          // set title
          this.plotScores.layout.title = 'Training series (using model X matrix)';
          this.plotScores.layout.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};

          if ('SSX' in info) {
            this.plotScores.layout.xaxis.title = labelX + ' ('+(100.0*(info['SSX'][0])).toFixed(1)+'% SSX)';
            this.plotScores.layout.yaxis.title = labelY + ' ('+(100.0*(info['SSX'][1])).toFixed(1)+'% SSX)';
            this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
            this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
          } else {
            this.plotScores.layout.xaxis.title = labelX;
            this.plotScores.layout.yaxis.title = labelY;
            this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
            this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
          }
        }
        
        // Inner PCA scores plot
        if ('InnerPCASet' in info) {
          this.scores = 'ensemble';

          // store the values for all models
          this.innerPCA = info['InnerPCASet'];

          // compile ensemble name models to use in the selector
          this.ensembleNames = [];
          for (let i in this.innerPCA) {
            let imodel = this.innerPCA[i];
            this.ensembleNames.push(imodel['label']);
          }

          // set fixed features for all models: molecule names and Y values
          this.plotScores.data[0].text = info['obj_nam'];
          this.plotScores.data[0].marker.color = info['ymatrix'];
          
          // define appropriate labels extracting from manifest
          const manifest = info['manifest'];
          this.scoresLabelX = 'PCA PC1';
          this.scoresLabelY = 'PCA PC2';
          for (var iman in manifest) {
            if (manifest[iman]['key'] == 'PC1') {
              this.scoresLabelX = manifest[iman]['label'];
            }
            if (manifest[iman]['key'] == 'PC2') {
              this.scoresLabelY = manifest[iman]['label'];
            }
          }

          // set title
          this.plotScores.layout.title = 'Reference series (projected on low-level model)';
          this.plotScores.layout.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};

          this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
          this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18};
          
          this.setInnerModel(this.ensembleNames[0]);
        }
        

        if ('feature_importances' in info && info['feature_importances']!= null) {
          
          const fval = info['feature_importances'];
          const fnam = info['var_nam'];

          for (let i = 0; i<fval.length; i++){
            this.featuresTSV+= fnam[i] + '\t' + fval[i].toFixed(4) + '\n';
          }

          // sort the values and select the 50 top 
          const indices = Array.from(fval.keys());
          indices.sort((a:number, b:number) => fval[b] - fval[a]);

          const sortedFval = indices.map(function(num:number) { return fval[num]});
          const sortedFnam = indices.map(function(num:number) {return fnam[num]});

          const nfeatures = Math.min(fval.length, 50);

          this.plotFeatures.data[0].y = sortedFval.slice(0,nfeatures);
          this.plotFeatures.data[0].x = sortedFnam.slice(0,nfeatures);
          this.features = true;
        }
        this.features_method = info['feature_importances_method'];

        if ('optimization_results' in info && 
          info['optimization_results']['means']!= null &&
          info['optimization_results']['labels']!= null) {
            this.plotOptimization.data[0].y = info['optimization_results']['means'];
            this.plotOptimization.data[0].x = info['optimization_results']['labels'];
            this.plotOptimization.data[0].error_y.array = info['optimization_results']['stds'];
            for (let i = 0; i<info['optimization_results']['labels'].length; i++){
              if (info['optimization_results']['labels'][i]!= info['optimization_results']['best']) {
                this.plotOptimization.data[0].marker.color[i] = "#0076a3";
              }
              else {
                this.plotOptimization.data[0].marker.color[i] = "#e59300";
              }
            }
          this.plotOptimization.layout.title= info['optimization_results']['scorer'];

          this.optimization = true;
        }
        
        setTimeout(() => {
          if (this.modelValidationInfo['TP']) {
            this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
                                      this.modelValidationInfo['FN'][1],
                                      this.modelValidationInfo['TN'][1], 
                                      this.modelValidationInfo['FP'][1]];

            this.plotPie.data[0].values = [ this.modelValidationInfo['TP'][1]+
                                      this.modelValidationInfo['FN'][1],
                                      this.modelValidationInfo['TN'][1]+
                                      this.modelValidationInfo['FP'][1]];

            this.plotSummary.data[1].y = [
                                      this.modelValidationInfo['Sensitivity'][1],
                                      this.modelValidationInfo['Specificity'][1],
                                      this.modelValidationInfo['MCC'][1]];
            if (this.modelValidationInfo['Conformal_coverage']) {
              this.plotSummary.data[1].y.push((this.modelValidationInfo['Conformal_coverage'][1]));
            }
          }
          if (this.modelValidationInfo['TP_f']) {
            this.fittingData[0].r = [this.modelValidationInfo['TP_f'][1], 
                                      this.modelValidationInfo['FN_f'][1],
                                      this.modelValidationInfo['TN_f'][1], 
                                      this.modelValidationInfo['FP_f'][1]];
            
            this.plotPie.data[0].values = [ this.modelValidationInfo['TP_f'][1]+
                                      this.modelValidationInfo['FN_f'][1],
                                      this.modelValidationInfo['TN_f'][1]+
                                      this.modelValidationInfo['FP_f'][1]];
            this.plotSummary.data[0].y = [
                                      this.modelValidationInfo['Sensitivity_f'][1],
                                      this.modelValidationInfo['Specificity_f'][1],
                                      this.modelValidationInfo['MCC_f'][1]];
            if (this.modelValidationInfo['Conformal_coverage_f']) {
              // this.plotSummary.data[0].x.push('Coverage');
              this.plotSummary.data[0].y.push((this.modelValidationInfo['Conformal_coverage_f'][1]));
            }
          }

          const me = this;
          
          // common to all plots in this component
          const options = {'width': 400, 'height': 250};
          const smilesDrawer = new SmilesDrawer.Drawer(options);

          // scores plot                 
          const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas_sel');
          const context = canvas.getContext('2d');

          // if (!this.model.secret) {
          if (this.scores != '') {
            PlotlyJS.newPlot('scoresDIV_sel', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresDIV_sel');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              SmilesDrawer.parse(info['SMILES'][points.pointNumber], function(tree) {
                smilesDrawer.draw(tree, 'scores_canvas_sel', 'light', false);
              });
            });

            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(data){
              context.clearRect(0, 0, canvas.width, canvas.height);
            });

            const sel_options = {'width': 200, 'height': 125};
            const smilesDrawerScoresSelected = new SmilesDrawer.Drawer(sel_options);  

            myPlot.on('plotly_selected', function(eventdata){
              var tbl = <HTMLTableElement>document.getElementById('tableSelectionsSelector');
              if (eventdata != null && 'points' in eventdata) {
                $('#btnCompoundsSelectedSel').prop('disabled', false);
                var points = eventdata.points;
                points.forEach(function(pt) {
                  const tr = tbl.insertRow();
        
                  var ismiles = info['SMILES'][pt.pointNumber];
                  var iactiv = pt["marker.color"];
                  var canvasid = 'qlseries'+pt.pointNumber;

                  // iactiv = pt.meta.toFixed(2);

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
                $('#btnCompoundsSelectedSel').prop('disabled', true);
                for(var i = 1;i<tbl.rows.length;){
                  tbl.deleteRow(i);
                }
              }  
            });
            
            myPlot.on ('plotly_afterplot', function(data){
              me.modelVisible = true;
            });
          }
          else {
            this.modelVisible = true;
          }

        }, 100);
      },
      error => {
        alert('Error getting model information');
      }
    );
  } 
  downloadCompoundsSelected(){
    var listCompounds = 'Name' + '\t' + 'SMILES' + '\t' + 'Activity' + '\t' + "x" + "\t" + "y" + "\n";
    let rows = document.getElementById("tableSelectionsSelector").getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
      const el = rows[i].getElementsByTagName('td')[0].textContent;
      for (let y = 0; y < this.plotScores.data[0].text.length; y++) {
        const element = this.plotScores.data[0].text[y];
        if(el === element){
         let smile = this.plotScores.data[0].meta[y]
         let activity = this.plotScores.data[0].marker.color[y]
         let x = this.plotScores.data[0].x[y]
         let Y = this.plotScores.data[0].y[y]
         listCompounds += el + '\t' + smile + '\t' + activity + '\t' + x + '\t' + Y + '\n';
        }
      } 
    }
    if(rows.length > 1){
    var element = document.createElement("a");
     element.setAttribute('href', 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(listCompounds));
     element.setAttribute('download', 'series'+this.modelName+'v'+this.modelVersion+'.tsv');
     element.style.display = 'none';
     document.body.appendChild(element);
     element.click();
     document.body.removeChild(element);
    }
  }

}

