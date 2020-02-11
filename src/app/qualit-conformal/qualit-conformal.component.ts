import { Component, Input, OnChanges} from '@angular/core';
import { QualitConformalService } from './qualit-conformal.service';
import {Model} from '../Globals';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartColor} from 'chart.js';

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
    this.getValidation();
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
}
