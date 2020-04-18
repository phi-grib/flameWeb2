import { Component, Input, OnChanges } from '@angular/core';
import { QuantitNoConformalService } from './quantit-no-conformal.service';
import {Model} from '../Globals';
import { ChartDataSets, ChartType, ChartOptions} from 'chart.js';
import { Label} from 'ng2-charts';
import { CommonService } from '../common.service';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

@Component({
  selector: 'app-quantit-no-conformal',
  templateUrl: './quantit-no-conformal.component.html',
  styleUrls: ['./quantit-no-conformal.component.css']
})
export class QuantitNoConformalComponent implements OnChanges {

  constructor(private service: QuantitNoConformalService,
    public model: Model,
    private commonService: CommonService) {}

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
  data: Array<any>;

  // Options
  public ChartOptionsFitted : ChartOptions = {}
  public ChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0
    }, 
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
            // var label = data.datasets[tooltipItem.datasetIndex].label || '';

            // if (label) {
            //     label += ': ';
            // }
            // var labelx = Math.round(tooltipItem.xLabel * 100) / 100;
            // var labely = Math.round(tooltipItem.yLabel * 100) / 100;
            // return '(' + labelx + ', ' + labely + ')';
            return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';

         },
         title: function(tooltipItem, data) {
          const label = data.labels[tooltipItem[0].index];
          return label;
         }
      },
      titleFontSize: 16,
      bodyFontSize: 14
    },
   scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          fontSize: 20,
          labelString: 'Experimental',
        },
        ticks: {
          fontSize: 15
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontSize: 20,
          labelString: 'Model',
        },
        ticks: {
          fontSize: 15
        }
      }],

      ticks: {
        min: -8,
        max: -3,
      }
    },
    legend: {
      display: false
    }
  };

  public plotFitted = {
    data: [
        { x: [], 
          y: [], 
          text: [],
          type: 'scatter', 
          mode: 'markers', 
          marker: {
            color: 'red',
            opacity: 0.2,
            size: 12,
            line: {
              color: 'red',
              opacity: 1,
              width: 4
            }
          }
        }
    ],
    layout: {width: 900, height: 600}
  };

  public ChartLabels: Label[] = [];

  public ChartDataPredicted: ChartDataSets[] = [
    {
      data: [],
      pointRadius: 5,
      pointBorderWidth: 2,
      pointBorderColor: 'rgba(255,0,0,1)',
      pointBackgroundColor: 'rgba(255,0,0,0.2)',
      type: 'scatter',
      showLine: false,
      fill: true
    },
    {
      data: [],
      borderColor: 'rgba(0,0,0,0.8)',
      type: 'line',
      showLine: true,
      fill: false,
      pointRadius: 0,
      borderWidth: 3
    },
  ];

  public ChartDataFitted: ChartDataSets[] = [
    {
      data: [],
      pointRadius: 5,
      pointBorderWidth: 2,
      pointBorderColor: 'rgba(255,0,0,1)',
      pointBackgroundColor: 'rgba(255,0,0,0.2)',
      type: 'scatter',
      showLine: false,
      fill: false
    },
    {
      data: [],
      borderColor: 'rgba(0,0,0,0.8)',
      type: 'line',
      showLine: true,
      fill: false,
      pointRadius: 0,
      borderWidth: 3
    },
  ];

  public ChartType: ChartType = 'line';


  ngOnChanges(): void {

    this.plotFitted.data[0].x = [];
    this.plotFitted.data[0].y = [];
    this.plotFitted.data[0].text = [];

    this.ChartDataFitted[0].data = [];
    this.ChartDataFitted[1].data = [];
    this.ChartDataPredicted[0].data = [];
    this.ChartDataPredicted[1].data = [];
    this.ChartLabels = [];
    this.getDocumentation();
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
          for (const modelInfo of info['model_valid_info']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            }
          }
          setTimeout(() => {
            // tslint:disable-next-line:forin
            for (const i in info['ymatrix']) {
              this.plotFitted.data[0].x[i] = info['ymatrix'][i] ;
              this.plotFitted.data[0].y[i] = info['Y_adj'][i];
              this.plotFitted.data[0].text[i] = info['obj_nam'][i];

              if ('Y_pred' in info) {
               this.ChartDataPredicted[0].data[i] = { x: info['ymatrix'][i], y: info['Y_pred'][i]};
               this.ChartDataPredicted[1].data[i] = { x: info['ymatrix'][i], y: info['ymatrix'][i]};
              }
              this.ChartDataFitted[0].data[i] = { x: info['ymatrix'][i], y: info['Y_adj'][i]};
              this.ChartDataFitted[1].data[i] = { x: info['ymatrix'][i], y: info['ymatrix'][i]};
              this.ChartLabels[i] = info['obj_nam'][i];

            }
          }, 50);
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
