import { Component, Input, OnChanges } from '@angular/core';
import { QuantitNoConformalService } from './quantit-no-conformal.service';
import { Model } from '../Globals';
import { CommonService } from '../common.service';

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
  modelWarning = '';
  data: Array<any>;

  public plotFitted = {
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
  public plotPredicted = {
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

    this.modelWarning = '';
    this.plotFitted.data[0].x = [];
    this.plotFitted.data[0].y = [];
    this.plotFitted.data[0].text = [];

    this.plotPredicted.data[0].x = [];
    this.plotPredicted.data[0].y = [];
    this.plotPredicted.data[0].text = [];

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
          }
          setTimeout(() => {
            
            this.plotFitted.data[0].x = info['ymatrix'] ;
            this.plotFitted.data[0].y = info['Y_adj'];
            this.plotFitted.data[0].text = info['obj_nam'];
            this.plotFitted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])]  ;
            this.plotFitted.data[1].y = [ Math.min.apply(Math, info['Y_adj']), Math.max.apply(Math, info['Y_adj'])]  ;

            if ('Y_pred' in info) {
              this.plotPredicted.data[0].x = info['ymatrix'] ;
              this.plotPredicted.data[0].y = info['Y_pred'];
              this.plotPredicted.data[0].text = info['obj_nam'];
              this.plotPredicted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])]  ;
              this.plotPredicted.data[1].y = [ Math.min.apply(Math, info['Y_pred']), Math.max.apply(Math, info['Y_pred'])]  ;
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
