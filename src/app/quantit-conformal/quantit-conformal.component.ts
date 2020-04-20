import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { QuantitConformalService } from './quantit-conformal.service';
import { Model } from '../Globals';
// import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
// import { Label, BaseChartDirective } from 'ng2-charts';
// import 'chartjs-plugin-error-bars';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-quantit-conformal',
  templateUrl: './quantit-conformal.component.html',
  styleUrls: ['./quantit-conformal.component.css']
})
export class QuantitConformalComponent implements OnChanges {


  constructor(private service: QuantitConformalService,
     public model: Model,
     private commonService: CommonService) { }


    @Input() modelName;
    @Input() modelVersion;
    modelDocumentation = undefined;
    orderDocumentation = ['ID', 'Version', 'Contact', 'Institution', 'Date', 'Endpoint',
               'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
              'Limits_applicability', 'Experimental_protocol', 'Model_availability',
              'Data_info', 'Algorithm', 'Software', 'Descriptors', 'Algorithm_settings',
              'AD_method', 'AD_parameters', 'Goodness_of_fit_statistics', 
              'Internal_validation_1', 'Internal_validation_2', 'External_validation',
              'Comments', 'Other_related_models', 'Date_of_QMRF', 'Data_of_QMRF_updates',
              'QMRF_updates', 'References', 'QMRF_same_models', 'Comment_on_the_endpoint',
              'Endpoint_data_quality_and_variability', 'Descriptor_selection'];
    objectKeys = Object.keys;
    modelBuildInfo = {};
    modelValidationInfo = {};
    modelConformal = {};
    data: Array<any>;
  


    @ViewChild('QuantitConformalChart') QuantitConformalChart;


    // // Options
    // public ChartOptions: ChartOptions = {
    //   responsive: true,
    //   animation: {
    //     duration: 0
    //   }, 
    //   tooltips: {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //           // var label = data.datasets[tooltipItem.datasetIndex].label || '';

    //           // if (label) {
    //           //     label += ': ';
    //           // }
    //           // var labelx = Math.round(tooltipItem.xLabel * 100) / 100;
    //           // var labely = Math.round(tooltipItem.yLabel * 100) / 100;
    //           // return '(' + labelx + ', ' + labely + ')';
    //           return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
    //       },
    //       title: function(tooltipItem, data) {
    //         const label = data.labels[tooltipItem[0].index];
    //         return label;
    //       }
    //     },
    //     titleFontSize: 16,
    //     bodyFontSize: 14
    //   },

    //   scales: {
    //     xAxes: [{
    //       type: 'linear',
    //       position: 'bottom',
    //       scaleLabel: {
    //         display: true,
    //         fontSize: 20,
    //         labelString: 'Experimental'
    //       }
    //     }],
    //     yAxes: [{
    //       scaleLabel: {
    //         display: true,
    //         fontSize: 20,
    //         labelString: 'Model'
    //       },
    //       ticks: {
    //         fontSize: 15
    //       }
    //     }]
    //   },
    //   legend: {
    //     display: false
    //   },
    //   plugins: {
    //     chartJsPluginErrorBars: {
    //       color: 'rgba(0,0,0,0.2)',
    //       lineWidth: 2,
    //       absoluteValues: true
    //     }
    //   }
    // };

    // public ChartOptionsFitted: ChartOptions = {
    //   responsive: true,
    //   animation: {
    //     duration: 0
    //   }, 
    //   tooltips: {
    //     callbacks: {
    //        label: function(tooltipItem, data) {
    //           return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
    //        },
    //        title: function(tooltipItem, data) {
    //         const label = data.labels[tooltipItem[0].index];
    //         return label;
    //        }
    //     }
    //   },
    //  scales: {
    //     xAxes: [{
    //       type: 'linear',
    //       position: 'bottom',
    //       scaleLabel: {
    //         display: true,
    //         labelString: 'experimental'
    //       }
    //     }],
    //     yAxes: [{
    //       position: 'bottom',
    //       scaleLabel: {
    //         display: true,
    //         labelString: 'Fitted'
    //       }/*,
    //       ticks: {
    //         min: -10,
    //         max: 0,
    //       }*/
    //     }]
    //   },
    //   legend: {
    //     display: false
    //   },
    //   plugins: {
    //     chartJsPluginErrorBars: {
    //       color: '#666',
    //       lineWidth: 2,
    //       absoluteValues: true
    //     }
    //   }
    // };

    // public ChartLabels: Label[] = [];

    // public ChartDataPredicted: ChartDataSets[] = [
    //   {
    //     data: [],
    //     pointRadius: 5,
    //     pointBorderWidth: 2,
    //     pointBorderColor: 'rgba(255,0,0,1)',
    //     pointBackgroundColor: 'rgba(255,0,0,0.2)',
    //     type: 'scatter',
    //     showLine: false,
    //     fill: true
    //   },
    //   {
    //     data: [],
    //     borderColor: 'rgba(0,0,0,0.8)',
    //     type: 'line',
    //     showLine: true,
    //     fill: false,
    //     pointRadius: 0,
    //     borderWidth: 3
    //   },
    // ];

    // public ChartDataFitted: any[] = [
    //   {
    //     errorBars : {},
    //     data: [],
    //     pointRadius: 5,
    //     pointBorderWidth: 2,
    //     pointBorderColor: 'rgba(255,0,0,1)',
    //     pointBackgroundColor: 'rgba(255,0,0,0.2)',
    //     type: 'scatter',
    //     showLine: false,
    //     fill: true
    //   },
    //   {
    //     data: [],
    //     borderColor: 'rgba(0,0,0,0.8)',
    //     type: 'line',
    //     showLine: true,
    //     fill: false,
    //     pointRadius: 0,
    //     borderWidth: 3
    //   },
    // ];

    // public ChartType: ChartType = 'line';


    public plotFittedConf = {
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
    public plotPredictedConf = {
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

    public plotCommon = {
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
            modeBarButtonsToRemove: ['lasso2d', 'autoScale2d']    }
    };
  
    ngOnChanges(): void {

      this.plotFittedConf.data[0].x = [];
      this.plotFittedConf.data[0].y = [];
      this.plotFittedConf.data[0].text = [];
  
      this.plotPredictedConf.data[0].x = [];
      this.plotPredictedConf.data[0].y = [];
      this.plotPredictedConf.data[0].text = [];

  
      // this.ChartDataFitted[0].data = [];
      // this.ChartDataFitted[1].data = [];
      // this.ChartLabels = [];
      this.getDocumentation();
      this.getValidation();
      // const toggler = document.getElementsByClassName('caret');
      // let i;

      // for (i = 0; i < toggler.length; i++) {
      //   toggler[i].addEventListener('click', function() {
      //     this.parentElement.querySelector('.nested').classList.toggle('active');
      //     this.classList.toggle('caret-down');
      //   });
      // }
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
          console.log(info);
          
          for (const modelInfo of info['model_build_info']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
              // do something
            }
            this.modelBuildInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
          }

          for (const modelInfo of info['model_valid_info']) {
            
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
              // do something
            }

            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            } else {
              this.modelConformal[modelInfo[0]] = modelInfo[2];
            }
          }

          console.log(info['Y_pred']);
          console.log(this.modelConformal['Conformal_prediction_ranges']);

          setTimeout(() => {
            // tslint:disable-next-line:forin

            // if ('Y_adj' in info) {
            //   this.plotFitted.data[0].x = info['ymatrix'] ;
            //   this.plotFitted.data[0].y = info['Y_adj'];
            //   this.plotFitted.data[0].text = info['obj_nam'];
            //   this.plotFitted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])]  ;
            //   this.plotFitted.data[1].y = [ Math.min.apply(Math, info['Y_adj']), Math.max.apply(Math, info['Y_adj'])]  ;
            // }

            if ('Y_pred' in info) {
              this.plotPredictedConf.data[0].x = info['ymatrix'] ;
              this.plotPredictedConf.data[0].y = info['Y_pred'];

              // for (const i in info['ymatrix']) {
              //   this.plotPredicted.data[0].error_y.array[i] = this.modelConformal['Conformal_prediction_ranges'][i][0];
              //   this.plotPredicted.data[0].error_y.arrayminus[i] = this.modelConformal['Conformal_prediction_ranges'][i][1];
              // }
              
              this.plotPredictedConf.data[0].text = info['obj_nam'];
              this.plotPredictedConf.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])]  ;
              this.plotPredictedConf.data[1].y = [ Math.min.apply(Math, info['Y_pred']), Math.max.apply(Math, info['Y_pred'])]  ;
            }

          }, 50);
          // setTimeout(() => {

          //   let max: number = null;
          //   let min: number = null;
          //   // tslint:disable-next-line:forin

          //   for (const i in info['ymatrix']) {
          //     // this.ChartDataPredicted[0].data[i] = { x: info['ymatrix'][i], y: info['Y_pred'][i]};
          //     // this.ChartDataPredicted[1].data[i] = { x: info['ymatrix'][i], y: info['ymatrix'][i]};
          //     this.ChartDataFitted[0].data[i] = { x: info['ymatrix'][i], y: this.modelConformal['Conformal_interval_medians'][i]};
          //     this.ChartDataFitted[0].errorBars[info['obj_nam'][i]] = {
          //       plus: this.modelConformal['Conformal_prediction_ranges'][i][0],
          //       minus: this.modelConformal['Conformal_prediction_ranges'][i][1]};
          //     this.ChartDataFitted[1].data[i] = { x: info['ymatrix'][i], y: info['ymatrix'][i]};
          //     if (max) {
          //       if (max < this.modelConformal['Conformal_prediction_ranges'][i][0]) {
          //           max = this.modelConformal['Conformal_prediction_ranges'][i][0];
          //       }
          //     } else {
          //       max = this.modelConformal['Conformal_prediction_ranges'][i][0];
          //     }
          //     if (min) {
          //       if (min > this.modelConformal['Conformal_prediction_ranges'][i][1]) {
          //           min = this.modelConformal['Conformal_prediction_ranges'][i][1];
          //       }
          //     } else {
          //       min = this.modelConformal['Conformal_prediction_ranges'][i][1];
          //     }
          //     this.ChartLabels[i] = info['obj_nam'][i];
          //   }
          //   // this.ChartOptionsFitted.scales.yAxes[0].ticks.min = min - 1 ;
          //   // this.ChartOptionsFitted.scales.yAxes[0].ticks.max = max + 1;
          //   // console.log(this.QuantitConformalChart.nativeElement);
          // }, 50);
        },
        error => {
          alert('Error getting model');
        }
      );
    }

    getDocumentation(): void {
      this.commonService.getDocumentation(this.modelName, this.modelVersion).subscribe(
        result => {
          this.modelDocumentation = result;
        },
        error => {
          this.modelDocumentation = undefined;
        }
      );
    }
}
