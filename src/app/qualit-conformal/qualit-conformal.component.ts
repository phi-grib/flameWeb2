import { Component, Input, OnChanges} from '@angular/core';
import { QualitConformalService } from './qualit-conformal.service';
import {Model} from '../Globals';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartColor} from 'chart.js';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-qualit-conformal',
  templateUrl: './qualit-conformal.component.html',
  styleUrls: ['./qualit-conformal.component.css']
})
export class QualitConformalComponent implements OnChanges {

  constructor(private service: QualitConformalService,
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
    // PolarArea
    public polarChartOptions: any = {
      responsive: true,
      startAngle : 1 * Math.PI,
      scale: {
        gridLines: {
          color: 'rgba(0, 0, 0, 0.5)'
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.5)',
          fontStyle : 'bold'
        }
      }
    };
    public polarAreaChartLabels: Label[] = ['TP', 'FP', 'TN', 'FN'];
    public polarAreaChartData: SingleDataSet = [0, 0, 0, 0];
    public polarAreaChartData2: SingleDataSet = [0, 0, 0, 0];
    public polarAreaLegend = true;
    public polarAreaChartType: ChartType = 'polarArea';
    public polarAreaChartColors = [
      {
        backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(235,143,3,0.3)', 'rgba(3,49,155,0.3)', 'rgba(255,0,0,0.3)'],
      },
    ];

  ngOnChanges(): void {
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
          // INFO ABOUT MODEL
          for (const modelInfo of info['model_build_info']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            this.modelBuildInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
          }
          // INFO ABOUT VALIDATION
          for (const modelInfo of info['model_valid_info']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            }
          }
          setTimeout(() => {
            if (this.modelValidationInfo['TP']) {
              this.polarAreaChartData = [this.modelValidationInfo['TP'][1], this.modelValidationInfo['FP'][1],
              this.modelValidationInfo['TN'][1], this.modelValidationInfo['FN'][1]];
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
        console.log(this.modelDocumentation);
      },
      error => {
        this.modelDocumentation = undefined;
      }
    );
  }
}
