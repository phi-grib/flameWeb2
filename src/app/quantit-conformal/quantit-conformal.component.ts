import { Component, Input, OnChanges } from '@angular/core';
import { CommonService } from '../common.service';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { Model, CustomHTMLElement } from '../Globals';

@Component({
  selector: 'app-quantit-conformal',
  templateUrl: './quantit-conformal.component.html',
  styleUrls: ['./quantit-conformal.component.css']
})
export class QuantitConformalComponent implements OnChanges {

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

    plotFitted = {
      data: [{ x: [], 
              y: [], 
              text: [],
              type: 'scatter', 
              mode: 'markers', 
              marker: {
                color: 'rgba(255,0,0,0.2)',
                size: 12,
                line: {
                  color: 'red',
                  width: 2
                },

              },
              hovertemplate:'<b>%{text}</b><br>(%{x:.2f} %{y:.2f})<extra></extra>',
              error_y: {
                type: 'data',
                color: 'rgba(0,0,0,0.2)',
                symmetric: false,
                array: [],
                arrayminus: []
              }
            },
            { x: [], 
              y: [], 
              type: 'scatter', 
              mode: 'lines', 
              line: {
                color: 'black',
                width: 2
              }
            }
          ]
    };
    
    plotPredicted = {
      data: [
        { x: [], 
          y: [], 
          text: [],
          type: 'scatter', 
          mode: 'markers', 
          marker: {
            color: 'rgba(255,0,0,0.2)',
            size: 12,
            line: {
              color: 'red',
              width: 2
            }
          },
          hovertemplate:'<b>%{text}</b><br>(%{x:.2f} %{y:.2f})<extra></extra>',
          error_y: {
            type: 'data',
            color: 'rgba(0,0,0,0.2)',
            symmetric: false,
            array: [],
            arrayminus: []
          }
        },
        { x: [], 
          y: [], 
          type: 'scatter', 
          mode: 'lines', 
          line: {
            color: 'black',
            width: 2
          }
        }
      ],
    }

    plotScatter = {
      layout: { 
        width: 700,
        height: 500,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 10 },
        showlegend: false,
        showtitle: false,
        

        xaxis: {
          range: [],
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Experimental',
          titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
          tickfont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        },
        yaxis: {
          range: [],
          hoverformat: '.2f',
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Model',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        },
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_scatter',
          width: 800,
          height: 550,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']    
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
            colorscale: 'RdBu', 
            showscale: true, 
            cauto: true,
            size: 14,
            colorbar: {
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
              title: 'Activity'
            }
          },
          hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        }
      ],
      layout: { 
        width: 700,
        height: 500,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 0  },
        showlegend: false,
        showtitle: true,
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
        title: 'Training series (using model X matrix)', 
        xaxis: {
          zeroline: true,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'PCA PC1',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif',size: 18},
          tickfont: {family: 'Barlow Semi Condensed, sans-serif',size: 16},
        },
        yaxis: {
          zeroline: true,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'PCA PC2',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif',size: 18},
          tickfont: {family: 'Barlow Semi Condensed, sans-serif',size: 16},
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
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
    }

    plotViolin= {
      data : [{
        type: 'violin',
        // orientation: 'h',
        y: [],
        text: [],
        points: 'all',
        pointpos: 2,
        hoveron: "violins+points",
        box: { visible: true },
        boxpoints: true,
        hoverlabel: { bgcolor: "#22577"},
        line: {color: '#22577'},
        hovertemplate: '<b>%{text}</b><br>%{y:.2f}<extra></extra>',
        fillcolor: "#B8DCED",
        opacity: 0.8,
        meanline: {visible: true},
        name: 'Activity'
      }],
      layout : {
        width: 300,
        height: 250,
        hovermode: 'closest',
        margin: {r: 10, t: 30, b: 0, l:10, pad: 0},
        xaxis: {
          zeroline: false,
          tickfont: {family: 'Barlow Semi Condensed, sans-serif' },
        }
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_violin',
          width: 600,
          height: 500,
          scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
      
    }
    
    plotFeatures= {
      data : [{
        type: 'bar',
        y: [],
        x: [],
        // text: [],
        // points: 'all',
        // pointpos: 2,
        // hoveron: "points",
        hoverlabel: { bgcolor: "#22577"},
        // line: {color: '#22577'},
        // hovertemplate: '<b>%{text}</b><br>%{y:.2f}<extra></extra>',
        hovertemplate: '<b>%{x}</b><br>%{y:.2f}<extra></extra>',
        fillcolor: "#B8DCED",
        // opacity: 0.8,
        // meanline: {visible: true},
        // name: 'Feature importance'
      }],
      layout : {
        title: 'Feature importance',
        font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        width: 800,
        height: 600,
        hovermode: 'closest',
        // margin: {r: 10, t: 30, b: 0, l:10, pad: 0},
        // margin: {r: 0, t: 50, b: 150, l:40, pad: 0},
        margin: {b:200, t:50, pad: 10},
        xaxis: {
          tickangle: -45,
          // categoryorder: 'array',
          // categoryarray: [],
          // zeroline: false,
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
            x: ['R2/Q2', 'Conformal accuracy'],
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
            x: ['R2/Q2', 'Conformal accuracy'],
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
        displayModeBar: false
        // displaylogo: false,
        // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
      }
    }

    ngOnChanges(): void {
      this.modelVisible = false;
      this.modelWarning = '';
      this.plotFitted.data[0].x = [];
      this.plotFitted.data[0].y = [];
      this.plotFitted.data[0].error_y.array = [];
      this.plotFitted.data[0].error_y.arrayminus = [];
      this.plotFitted.data[0].text = [];
      
      this.plotPredicted.data[0].x = [];
      this.plotPredicted.data[0].y = [];
      this.plotPredicted.data[0].error_y.array = [];
      this.plotPredicted.data[0].error_y.arrayminus = [];
      this.plotPredicted.data[0].text = [];

      this.plotScores.data[0].x =[];
      this.plotScores.data[0].y =[];
      this.plotScores.data[0].text =[];
      this.plotScores.data[0].meta = [];
      this.plotScores.data[0].marker.color = [];
      this.plotViolin.data[0].y =[];
      this.plotViolin.data[0].text =[];
      this.plotFeatures.data[0].y =[];
      this.plotFeatures.data[0].x =[];
      this.plotSummary.data[0].y = [];
      this.plotSummary.data[1].y = [];
      
      this.getValidation();
      this.getDocumentation();
      // this.modelVisible = true;
    }

    isObject(val) {
      if (val === null) {
        return false;
      }
      return typeof val === 'object';
    }

    getDocumentation() {
      this.commonService.getDocumentation(this.modelName, this.modelVersion, 'JSON').subscribe(
        result => {
          let label_units = '';
          if (result['Endpoint_units'].value != undefined) {
            label_units = ': '+ result['Endpoint_units'].value;
          }
          this.plotScatter.layout.xaxis.title= 'Experimental'+label_units;
          this.plotScatter.layout.xaxis.titlefont = { family: 'Barlow Semi Condensed, sans-serif', size: 18 };
          this.plotScatter.layout.yaxis.title= 'Model'+label_units;
          this.plotScatter.layout.yaxis.titlefont = { family: 'Barlow Semi Condensed, sans-serif', size: 18 };
        }
      );
    }

    getValidation() {
      this.commonService.getValidation(this.modelName, this.modelVersion).subscribe(
        result => {
          const info = result;
          // console.log(this.modelID);
          
          this.model.input_type = info.meta.input_type;
          // console.log(this.model.input_type);

          // process warnings
          if (info.warning){
            this.modelWarning = info.warning;
          }

          this.modelValidationInfo = {};

          for (const modelInfo of info['model_valid_info']) {
            
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }

            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            } 

            // translation for back_compatibility
            if (modelInfo[0]==='Conformal_accuracy_fitting') {
              this.modelValidationInfo ['Conformal_accuracy_f'] = [modelInfo[1], modelInfo[2]];
            }

            // translation for back_compatibility
            if (modelInfo[0]==='Conformal_mean_interval_fitting') {
              this.modelValidationInfo ['Conformal_mean_interval_f'] = [modelInfo[1], modelInfo[2]];
            }

            // else {
            //   if (this.model.conformal){
            //     this.modelConformal[modelInfo[0]] = modelInfo[2];
            //   }
            // }
          }

          for (let ielement of info['model_build_info']) {
            this.modelBuildInfo[ielement[0]]=[ielement[1], ielement[2]]
          }
          for (let ielement of info['model_type_info']) {
            this.modelTypeInfo[ielement[0]]=[ielement[1], ielement[2]]
          }

          setTimeout(() => {

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
              this.plotScores.data[0].meta = info['SMILES'];
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


            this.plotViolin.data[0].y = info['ymatrix'];
            this.plotViolin.data[0].text = info['obj_nam'];
            
            
            const fval = info['feature_importances'];
            const fnam = info['var_nam'];

            const indices = Array.from(fval.keys());
            indices.sort((a, b) => fval[b] - fval[a]);
            
            const sortedFval = indices.map(i => fval[i]);
            const sortedFnam = indices.map(i => fnam[i]);

            const nfeatures = Math.min(fval.length, 50)

            this.plotFeatures.data[0].y = sortedFval.slice(0,nfeatures);
            this.plotFeatures.data[0].x = sortedFnam.slice(0,nfeatures);
            

            if (this.modelValidationInfo['Conformal_accuracy'] && this.modelValidationInfo['Conformal_accuracy_f']) {
              this.plotSummary.data[1].y = [
                this.modelValidationInfo['Q2'][1],
                this.modelValidationInfo['Conformal_accuracy'][1]];
              
              this.plotSummary.data[0].y = [
                this.modelValidationInfo['R2'][1],
                this.modelValidationInfo['Conformal_accuracy_f'][1]];
            }
            else {
              this.plotSummary.data[1].y = [
                this.modelValidationInfo['Q2'][1]];
              this.plotSummary.data[0].y = [
                this.modelValidationInfo['R2'][1]];
            }

            // predicted data
            if ('Y_pred' in info) {
              this.plotPredicted.data[0].x = info['ymatrix'] ;
              this.plotPredicted.data[0].y = info['Y_pred'];
              
              if (('upper_limit' in info) && ('lower_limit' in info)) {
                for (const i in info['ymatrix']) {
                  this.plotPredicted.data[0].error_y.array[i] = info['upper_limit'][i]- info['Y_pred'][i];
                  this.plotPredicted.data[0].error_y.arrayminus[i] = info['Y_pred'][i] - info['lower_limit'][i];
                }
              }
              else {
                if (this.model.conformal) {
  
                  // const yintpred  = this.modelConformal['Conformal_prediction_ranges']; // (min, max)
                  if ('Conformal_prediction_ranges' in info){
                    const yintpred  = info['Conformal_prediction_ranges']; // (min, max)
                    for (const i in info['ymatrix']) {
                      this.plotPredicted.data[0].error_y.array[i] = yintpred[i][1] - info['Y_pred'][i];
                      this.plotPredicted.data[0].error_y.arrayminus[i] = info['Y_pred'][i] - yintpred[i][0];
                    }
                  }
                  else {
                    console.log('CI prediction info not found, please update your model');
                  }
                }
              }
              
              this.plotPredicted.data[0].text = info['obj_nam'];
              const plot_min = Math.min ( Math.min.apply(Math, info['ymatrix']), Math.min.apply(Math, info['Y_pred'])); 
              const plot_max = Math.max ( Math.max.apply(Math, info['ymatrix']), Math.max.apply(Math, info['Y_pred'])); 
              this.plotPredicted.data[1].x = [ plot_min, plot_max];
              this.plotPredicted.data[1].y = [ plot_min, plot_max];

              let low_range;
              let high_range;
              if (plot_min>0) {
                low_range = plot_min - (plot_min/10.0);
                high_range = plot_max + (plot_max/10.0)
              } else {
                low_range = plot_min + (plot_min/10.0);
                high_range = plot_max - (plot_max/10.0);
              }

              this.plotScatter.layout.yaxis.range = [low_range, high_range];

              // this.plotPredicted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              // this.plotPredicted.data[1].y = [ Math.min.apply(Math, info['Y_pred']), Math.max.apply(Math, info['Y_pred'])];
            }

            // ajusted data
            if ('Y_adj' in info) {
              this.plotFitted.data[0].x = info['ymatrix'] ;
              this.plotFitted.data[0].y = info['Y_adj'];
              
              if (('upper_limit' in info) && ('lower_limit' in info)) {
                for (const i in info['ymatrix']) {
                  this.plotFitted.data[0].error_y.array[i] = info['upper_limit'][i]- info['Y_adj'][i];
                  this.plotFitted.data[0].error_y.arrayminus[i] = info['Y_adj'][i] - info['lower_limit'][i];
                }
              }
              else {
                if (this.model.conformal) {
                  if ('Conformal_prediction_ranges_fitting' in info){
                    // const yintfit  = this.modelConformal['Conformal_prediction_ranges_fitting']; // (min, max)
                    const yintfit  = info['Conformal_prediction_ranges_fitting']; // (min, max)
                    for (const i in info['ymatrix']) {
                      this.plotFitted.data[0].error_y.array[i] = yintfit[i][1] - info['Y_adj'][i];
                      this.plotFitted.data[0].error_y.arrayminus[i] = info['Y_adj'][i] - yintfit[i][0];
                    }
                  }
                  else {
                    console.log('CI fitting info not found, please update your model');
                  }
                }
              }
              
              this.plotFitted.data[0].text = info['obj_nam'];
              const plot_min = Math.min ( Math.min.apply(Math, info['ymatrix']), Math.min.apply(Math, info['Y_adj'])); 
              const plot_max = Math.max ( Math.max.apply(Math, info['ymatrix']), Math.max.apply(Math, info['Y_adj'])); 
              this.plotFitted.data[1].x = [ plot_min, plot_max];
              this.plotFitted.data[1].y = [ plot_min, plot_max];

              // this.plotFitted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              // this.plotFitted.data[1].y = [ Math.min.apply(Math, info['Y_adj']),Math.max.apply(Math, info['Y_adj'])];
            }

            const me = this;
            // predicted plot                 
            const canvas_pred = <HTMLCanvasElement>document.getElementById('scatter_pred_canvas');
            const context_pred = canvas_pred.getContext('2d');

            PlotlyJS.newPlot('scatterPredDIV', this.plotPredicted.data, this.plotScatter.layout, this.plotScatter.config);
            
            let myPlotPred = <CustomHTMLElement>document.getElementById('scatterPredDIV');

            // on hover, draw the molecule
            myPlotPred.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              SmilesDrawer.parse(info['SMILES'][points.pointNumber], function(tree) {
                smilesDrawer.draw(tree, 'scatter_pred_canvas', 'light', false);
              });
            });

            // on onhover, clear the canvas
            myPlotPred.on('plotly_unhover', function(data){
              context_pred.clearRect(0, 0, canvas_pred.width, canvas_pred.height);
            });

            // fitted plott
            const canvas_fit = <HTMLCanvasElement>document.getElementById('scatter_fit_canvas');
            const context_fit = canvas_fit.getContext('2d');

            PlotlyJS.newPlot('scatterFitDIV', this.plotFitted.data, this.plotScatter.layout, this.plotScatter.config);
            
            let myPlotFit = <CustomHTMLElement>document.getElementById('scatterFitDIV');
            
            // on hover, draw the molecule
            myPlotFit.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              SmilesDrawer.parse(info['SMILES'][points.pointNumber], function(tree) {
                smilesDrawer.draw(tree, 'scatter_fit_canvas', 'light', false);
              });
            });
            // on onhover, clear the canvas
            myPlotFit.on('plotly_unhover', function(data){
              context_fit.clearRect(0, 0, canvas_fit.width, canvas_fit.height);
            });

            myPlotFit.on ('plotly_afterplot', function(data){
              me.modelVisible = true;
            });


          }, 100);
        },
        error => {
          alert('Error getting model information');
        }
        );
            
            
        };
    }


