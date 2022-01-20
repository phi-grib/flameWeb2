import { Component, Input, OnChanges} from '@angular/core';
import { CommonService } from '../common.service';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { Model, CustomHTMLElement } from '../Globals';

@Component({
  selector: 'app-qualit-conformal',
  templateUrl: './qualit-conformal.component.html',
  styleUrls: ['./qualit-conformal.component.css']
})
export class QualitConformalComponent implements OnChanges {
  
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
        width: 350,
        // height: 300,
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
            opacity: 0.6,
            colorscale: 'Bluered', 
            showscale: false,
            cmax: 1.0,
            cmin: 0.0,
            size: 14,
            // line: {
            //   width: 2
            // },
            colorbar: {
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
            }
          },
          hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        }
      ],
      layout: { 
        width: 700,
        height: 500,
        showtitle: true,
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
        title: 'Training series (using model X matrix)', 
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
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
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
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
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
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
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
            width: 300,
            height: 200,
            showlegend: false,
            margin: { r: 30, t: 30, b: 10, l: 30, pad: 0 },
      },
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
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
        title: 'Feature importance',
        font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        width: 800,
        height: 600,
        hovermode: 'closest',
        margin: {b:200, t:50, pad: 10},
        xaxis: {
          tickangle: -45,
          tickfont: {family: 'Barlow Semi Condensed, sans-serif' },
        }
      },
      config: {
        displaylogo: false,
        showtitle: true, 
        showlegend: false, 
        xaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 12 },
        },
        yaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        },
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
            textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
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
            textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
            marker: {
              color: 'rgba(156,198,221,0.8)',
            }
          }],
      layout: {
            yaxis: {
              range: [0.0,1.0],
              // titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
            },
            xaxis: {
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
            },
            width: 600,
            height: 400,
            showlegend: true,
            barmode: 'group'
      },
      config: {
        // displaylogo: false,
        displayModeBar: false
        // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
      }
    }
   
          
    ngOnChanges(): void {
      this.modelVisible = false;
      this.features = false;
      this.modelWarning = '';
      this.plotScores.data[0].x =[];
      this.plotScores.data[0].y =[];
      this.plotScores.data[0].text =[];
      this.plotScores.data[0].marker.color = [];
      this.predictData[0].r = [0, 0, 0, 0];
      this.fittingData[0].r = [0, 0, 0, 0];
      this.plotPie.data[0].values = [];
      this.plotFeatures.data[0].y =[];
      this.plotFeatures.data[0].x =[];
      this.plotSummary.data[0].y = [];
      this.plotSummary.data[1].y = [];
      this.getValidation();
      // this.modelVisible = true;
    }
    
    isObject(val) {
      if (val === null) {
        return false;
      }
      return typeof val === 'object';
    }
      
    getValidation() {
      this.commonService.getValidation(this.modelName, this.modelVersion).subscribe(
        result => {
          const info = result;
          
          this.model.input_type = info.meta.input_type;
          // console.log(this.model.input_type);

          // process warnings
          if (info.warning){
            this.modelWarning = info.warning;
          }

          // PCA scores plot
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
            this.plotScores.data[0].text = info['obj_nam'];
            this.plotScores.data[0].marker.color = info['ymatrix'];

            if ('SSX' in info) {
              this.plotScores.layout.xaxis.title = labelX + ' ('+(100.0*(info['SSX'][0])).toFixed(1)+'% SSX)';
              this.plotScores.layout.yaxis.title = labelY + ' ('+(100.0*(info['SSX'][1])).toFixed(1)+'% SSX)';
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
            } else {
              this.plotScores.layout.xaxis.title = labelX;
              this.plotScores.layout.yaxis.title = labelY;
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
            }
          }

          // INFO ABOUT VALIDATION
          this.modelValidationInfo = {};
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

          if ('feature_importances' in info && info['feature_importances']!= null) {

            const fval = info['feature_importances'];
            const fnam = info['var_nam'];

            // sort the values and select the 50 top 
            const indices = Array.from(fval.keys());
            indices.sort((a, b) => fval[b] - fval[a]);
            const sortedFval = indices.map(i => fval[i]);
            const sortedFnam = indices.map(i => fnam[i]);

            const nfeatures = Math.min(fval.length, 50);

            this.plotFeatures.data[0].y = sortedFval.slice(0,nfeatures);
            this.plotFeatures.data[0].x = sortedFnam.slice(0,nfeatures);
            this.features = true;
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

                                                    // bar plot with feature importances 

              this.plotSummary.data[1].y = [
                                        this.modelValidationInfo['Sensitivity'][1],
                                        this.modelValidationInfo['Specificity'][1],
                                        this.modelValidationInfo['MCC'][1]];
              if (this.modelValidationInfo['Conformal_coverage']) {
                // this.plotSummary.data[1].x.push('Coverage');
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
            const options = {'width': 300, 'height': 250};
            const smilesDrawer = new SmilesDrawer.Drawer(options);

            // scores plot                 
            const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas');
            const context = canvas.getContext('2d');

            PlotlyJS.newPlot('scoresDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresDIV');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              SmilesDrawer.parse(info['SMILES'][points.pointNumber], function(tree) {
                smilesDrawer.draw(tree, 'scores_canvas', 'light', false);
              });
            });
            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(data){
              context.clearRect(0, 0, canvas.width, canvas.height);
            });

            myPlot.on ('plotly_afterplot', function(data){
              me.modelVisible = true;
            });

          }, 100);
        },
        error => {
          alert('Error getting model information');
        }
      );
    } 

}
