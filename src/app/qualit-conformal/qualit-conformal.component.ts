import { Component, Input, OnChanges} from '@angular/core';
import { QualitConformalService } from './qualit-conformal.service';
import { Model } from '../Globals';

@Component({
  selector: 'app-qualit-conformal',
  templateUrl: './qualit-conformal.component.html',
  styleUrls: ['./qualit-conformal.component.css']
})
export class QualitConformalComponent implements OnChanges {
  
  constructor(private service: QualitConformalService,
    public model: Model) { }
    
    @Input() modelName;
    @Input() modelVersion;
    
    // objectKeys = Object.keys;
    // modelBuildInfo = {};
    modelValidationInfo = {};
    modelWarning = '';
    objectKeys = Object.keys;
    
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
        // height: 300,
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
          // // INFO ABOUT MODEL
          // for (const modelInfo of info['model_build_info']) {
          //   if (typeof modelInfo[2] === 'number') {
          //     modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
          //   }
          //   this.modelBuildInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
          // }

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
              this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
                                        this.modelValidationInfo['FN'][1],
                                        this.modelValidationInfo['TN'][1], 
                                        this.modelValidationInfo['FP'][1]];
            }
            if (this.modelValidationInfo['TP_f']) {
              this.fittingData[0].r = [this.modelValidationInfo['TP_f'][1], 
                                        this.modelValidationInfo['FN_f'][1],
                                        this.modelValidationInfo['TN_f'][1], 
                                        this.modelValidationInfo['FP_f'][1]];
            }
          }, 50);
        },
        error => {
          alert('Error getting model');
        }
      );
    } 

}
