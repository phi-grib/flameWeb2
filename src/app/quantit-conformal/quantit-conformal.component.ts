import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { QuantitConformalService } from './quantit-conformal.service';
import { Model } from '../Globals';

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
    // @ViewChild('QuantitConformalChart') QuantitConformalChart;

    objectKeys = Object.keys;
    // modelBuildInfo = {};
    modelValidationInfo = {};
    modelConformal = {};
    modelWarning = '';
    data: Array<any>;

    plotFittedConf = {
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
    
    plotPredictedConf = {
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
            colorscale: 'RdBu', 
            showscale: true, 
            cmax: 1.0,
            cmin: 0.0,
            size: 14,
            // line: {
            //   width: 2
            // },
            colorbar: {
              tickfont: {
                family: 'Barlow Semi Condensed, sans-serif',
                size: 20
              }
            }
          },
          hovertemplate:'Activity: %{marker.color:.2f}<br><b>%{text}</b>',
        }
      ],
    }

    // hovertemplate: '<i>Price</i>: $%{y:.2f}' +
    //                     '<br><b>X</b>: %{x}<br>' +
    //                     '<b>%{text}</b>',

    plotCommon = {
      layout: { 
            width: 950,
            height: 600,
            margin: {
              r: 10,
              t: 30,
              pad: 0
            },
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
              zeroline: false,
              showgrid: true,
              showline: true,
              gridwidth: 1,
              linecolor: 'rgb(200,200,200)',
              linewidth: 2,
              title: 'Model',
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
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']    }
    };

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
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    }
    };
      
    ngOnChanges(): void {
        
      this.modelWarning = '';
      this.plotFittedConf.data[0].x = [];
      this.plotFittedConf.data[0].y = [];
      this.plotFittedConf.data[0].error_y.array = [];
      this.plotFittedConf.data[0].error_y.arrayminus = [];
      this.plotFittedConf.data[0].text = [];
      
      this.plotPredictedConf.data[0].x = [];
      this.plotPredictedConf.data[0].y = [];
      this.plotPredictedConf.data[0].error_y.array = [];
      this.plotPredictedConf.data[0].error_y.arrayminus = [];
      this.plotPredictedConf.data[0].text = [];

      this.plotScores.data[0].x =[];
      this.plotScores.data[0].y =[];
      this.plotScores.data[0].text =[];
      this.plotScores.data[0].marker.color = [];
      
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
            } else {
              if (this.model.conformal){
                this.modelConformal[modelInfo[0]] = modelInfo[2];
              }
            }
          }

          setTimeout(() => {

            // PCA scores plot
            if ('PC1' in info) {
              this.plotScores.data[0].x = info['PC1'];
              this.plotScores.data[0].y = info['PC2'];
              this.plotScores.data[0].text = info['obj_nam'];
              // this.plotScores.data[0].meta = info['ymatrix'];
              // var scale = [];
              var min = Math.min.apply(Math, info['ymatrix']);
              var max = Math.max.apply(Math, info['ymatrix'])
              this.plotScores.data[0].marker.cmin = min;
              this.plotScores.data[0].marker.cmax = max;
              this.plotScores.data[0].marker.color = info['ymatrix'];
            }

            // predicted data
            if ('Y_pred' in info) {
              this.plotPredictedConf.data[0].x = info['ymatrix'] ;
              this.plotPredictedConf.data[0].y = info['Y_pred'];
              
              if (this.model.conformal) {

                const yintpred  = this.modelConformal['Conformal_prediction_ranges']; // (min, max)
                for (const i in info['ymatrix']) {
                  this.plotPredictedConf.data[0].error_y.array[i] = yintpred[i][1] - info['Y_pred'][i];
                  this.plotPredictedConf.data[0].error_y.arrayminus[i] = info['Y_pred'][i] - yintpred[i][0];
                }
              }
              
              this.plotPredictedConf.data[0].text = info['obj_nam'];
              this.plotPredictedConf.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              this.plotPredictedConf.data[1].y = [ Math.min.apply(Math, info['Y_pred']),Math.max.apply(Math, info['Y_pred'])];
            }
            else { // legacy method
              if (this.model.conformal) {
                const ymean = this.modelConformal['Conformal_interval_medians'];
                const yint  = this.modelConformal['Conformal_prediction_ranges']; // (min, max)
    
                this.plotPredictedConf.data[0].x = info['ymatrix'] ;
                this.plotPredictedConf.data[0].y = ymean;
    
                for (const i in info['ymatrix']) {
                  this.plotPredictedConf.data[0].error_y.array[i] = yint[i][1] - ymean[i];
                  this.plotPredictedConf.data[0].error_y.arrayminus[i] = ymean[i] - yint[i][0];
                }
                
                this.plotPredictedConf.data[0].text = info['obj_nam'];
                this.plotPredictedConf.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
                this.plotPredictedConf.data[1].y = [ Math.min.apply(Math, ymean),Math.max.apply(Math, ymean)];
              }
            }

            // ajusted data
            if ('Y_adj' in info) {
              this.plotFittedConf.data[0].x = info['ymatrix'] ;
              this.plotFittedConf.data[0].y = info['Y_adj'];
              
              if (this.model.conformal) {
                const yintfit  = this.modelConformal['Conformal_prediction_ranges_fitting']; // (min, max)
                for (const i in info['ymatrix']) {
                  this.plotFittedConf.data[0].error_y.array[i] = yintfit[i][1] - info['Y_adj'][i];
                  this.plotFittedConf.data[0].error_y.arrayminus[i] = info['Y_adj'][i] - yintfit[i][0];
                }
              }
              
              this.plotFittedConf.data[0].text = info['obj_nam'];
              this.plotFittedConf.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              this.plotFittedConf.data[1].y = [ Math.min.apply(Math, info['Y_adj']),Math.max.apply(Math, info['Y_adj'])];
            }

          }, 50);
        },
        error => {
          alert('Error getting model');
        }
        );
    }

}
