import { Component, Input, OnChanges } from '@angular/core';
import { QuantitNoConformalService } from './quantit-no-conformal.service';
import {Model} from '../Globals';
import { ChartDataSets, ChartType, ChartOptions} from 'chart.js';
import { Label} from 'ng2-charts';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-quantit-no-conformal',
  templateUrl: './quantit-no-conformal.component.html',
  styleUrls: ['./quantit-no-conformal.component.css']
})
export class QuantitNoConformalComponent implements OnChanges {


  constructor(private service: QuantitNoConformalService,
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
  data: Array<any>;

  // Options
  public ChartOptionsPredicted: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0
    }, 
    tooltips: {
      callbacks: {
         label: function(tooltipItem, data) {
            return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
         },
         title: function(tooltipItem, data) {
          const label = data.labels[tooltipItem[0].index];
          return label;
         }
      }
    },
   scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'experimental',
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Predicted'
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
  public ChartOptionsFitted: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0
    }, 
    tooltips: {
      callbacks: {
         label: function(tooltipItem, data) {
            return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
         },
         title: function(tooltipItem, data) {
          const label = data.labels[tooltipItem[0].index];
          return label;
         }
      }
    },
   scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'experimental'
        }
      }],
      yAxes: [{
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'Fitted'
        }
      }]
    },
    legend: {
      display: false
    }
  };

  public ChartLabels: Label[] = [];

  public ChartDataPredicted: ChartDataSets[] = [
    {
      data: [],
      pointRadius: 3,
      backgroundColor: 'rgba(255,0,0,0.3)',
      type: 'scatter',
      showLine: false,
      fill: false,
    },
    {
      data: [],
      type: 'line',
      fill: false,
      pointRadius: 1
    },
  ];

  public ChartDataFitted: ChartDataSets[] = [
    {
      data: [],
      pointRadius: 3,
      backgroundColor: 'rgba(255,0,0,0.3)',
      type: '',
      showLine: false,
      fill: false
    },
    {
      data: [],
      type: 'line',
      fill: false,
      pointRadius: 1
    },
  ];

  public ChartType: ChartType = 'line';

  ngOnChanges(): void {
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
