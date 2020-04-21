import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { QuantitConformalService } from './quantit-conformal.service';
import { Model } from '../Globals';
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
  
    ngOnChanges(): void {

      this.plotFittedConf.data[0].x = [];
      this.plotFittedConf.data[0].y = [];
      this.plotFittedConf.data[0].text = [];
  
      this.plotPredictedConf.data[0].x = [];
      this.plotPredictedConf.data[0].y = [];
      this.plotPredictedConf.data[0].text = [];

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

          setTimeout(() => {

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
