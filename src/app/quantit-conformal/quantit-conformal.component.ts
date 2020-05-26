import { Component, Input, OnChanges } from '@angular/core';
import { QuantitConformalService } from './quantit-conformal.service';
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
    private service: QuantitConformalService,
    public model: Model) { }

    @Input() modelName;
    @Input() modelVersion;
    @Input() modelID;

    objectKeys = Object.keys;
    modelValidationInfo = {};
    // modelConformal = {};
    modelWarning = '';

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
        width: 800,
        height: 550,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 10 },
        showlegend: false,
        showtitle: false,
        xaxis: {
          hoverformat: '.2f',
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Experimental',
          titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 24 },
          tickfont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
        },
        yaxis: {
          hoverformat: '.2f',
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Model',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
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
              tickfont: {
                family: 'Barlow Semi Condensed, sans-serif',
                size: 20
              }
            }
          },
          hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        }
      ],
      layout: { 
        width: 800,
        height: 600,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 0  },
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
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_scores',
          width: 800,
          height: 600,
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

    ngOnChanges(): void {
      // console.log('onChanges', this.modelID);
        
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
      
      this.getValidation();
    }

    isObject(val) {
      if (val === null) {
        return false;
      }
      return typeof val === 'object';
    }

    getValidation() {
      this.service.getValidation(this.modelName, this.modelVersion).subscribe(
        result => {
          const info = result;
          // console.log(this.modelID);
          
          // process warnings
          if (info.warning){
            this.modelWarning = info.warning;
          }

          for (const modelInfo of info['model_valid_info']) {
            
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }

            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            } 
            // else {
            //   if (this.model.conformal){
            //     this.modelConformal[modelInfo[0]] = modelInfo[2];
            //   }
            // }
          }

          setTimeout(() => {

            // PCA scores plot
            if ('PC1' in info) {
              this.plotScores.data[0].x = info['PC1'];
              this.plotScores.data[0].y = info['PC2'];
              this.plotScores.data[0].text = info['obj_nam'];
              this.plotScores.data[0].meta = info['SMILES'];
              this.plotScores.data[0].marker.color = info['ymatrix'];
            }

            // common to all plots in this component
            const options = {'width': 300, 'height': 300};
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


          }, 100);
        },
        error => {
          alert('Error getting model');
        }
        );
            
            
        };
    }


