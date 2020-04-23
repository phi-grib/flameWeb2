import { Component, Input, OnChanges } from '@angular/core';
import { QualitNoConformalService } from './qualit-no-conformal.service';
import { Model } from '../Globals';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-qualit-no-conformal',
  templateUrl: './qualit-no-conformal.component.html',
  styleUrls: ['./qualit-no-conformal.component.css']
})
export class QualitNoConformalComponent implements OnChanges {

  constructor(private service: QualitNoConformalService,
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
    modelWarning = '';
    
    public predictData = [{
      offset: 45, 
      r: [],
      theta: ["TP", "FN", "TN", "FP"],
      meta: ["TP", "FN", "TN", "FP"],
      marker: {
        opacity: 0.8,
        // color: ['green','red','green','orange'],
        color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],

      },
      type: "barpolar",
      hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  public fittingData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FP", "TN", "FN"],
    meta: ["TP", "FP", "TN", "FN"],
    marker: {
      opacity: 0.8,
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],
      // color: ['green','red','green','orange'],
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  public plotCommon = {
    layout :{
      width: 350,
      // height: 600,
      polar: {
        bargap: 0,
        gridcolor: "grey",
        gridwidth: 1,
        radialaxis: {
          angle: 90,
          ticks: '', 
          tickfont: {
            size: 12,
            fontStyle: 'Barlow Semi Condensed, sans-serif',
          },
          // dtick: 20,
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

  ngOnChanges(): void {
    this.modelWarning = '';
    this.predictData[0].r = [0, 0, 0, 0];
    this.fittingData[0].r = [0, 0, 0, 0];
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
            this.fittingData[0].r = [this.modelValidationInfo['TP'][1], 
                                    this.modelValidationInfo['FN'][1],
                                    this.modelValidationInfo['TN'][1], 
                                    this.modelValidationInfo['FP'][1]];
          }
          if (this.modelValidationInfo['TPpred']) {
            this.predictData[0].r = [this.modelValidationInfo['TPpred'][1], 
                                    this.modelValidationInfo['FNpred'][1],
                                    this.modelValidationInfo['TNpred'][1], 
                                    this.modelValidationInfo['FPpred'][1]];
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
