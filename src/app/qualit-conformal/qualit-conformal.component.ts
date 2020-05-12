import { Component, Input, OnChanges} from '@angular/core';
import { QualitConformalService } from './qualit-conformal.service';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { Model, CustomHTMLElement } from '../Globals';

@Component({
  selector: 'app-qualit-conformal',
  templateUrl: './qualit-conformal.component.html',
  styleUrls: ['./qualit-conformal.component.css']
})
export class QualitConformalComponent implements OnChanges {
  
  constructor(
    private service: QualitConformalService,
    public model: Model) { }
    
    @Input() modelName;
    @Input() modelVersion;
    
    objectKeys = Object.keys;
    modelValidationInfo = {};
    modelWarning = '';
    
    predictData = [{
        offset: 45, 
        r: [],
        theta: ["TP", "FN", "TN", "FP"],
        meta: ["TP", "FN", "TN", "FP"],
        marker: {
          opacity: 0.8,
          color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],
        },
        type: "barpolar",
        hovertemplate: "%{meta}: %{r}<extra></extra>"
    }]

    fittingData = [{
      offset: 45, 
      r: [],
      theta: ["TP", "FP", "TN", "FN"],
      meta: ["TP", "FP", "TN", "FN"],
      marker: {
        opacity: 0.8,
        color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"],
      },
      type: "barpolar",
      hovertemplate: "%{meta}: %{r}<extra></extra>"
    }]

    plotCommon = {
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
            tickfont: { size: 12, fontStyle: 'Barlow Semi Condensed, sans-serif'},
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
            colorscale: 'Bluered', 
            showscale: false,
            cmax: 1.0,
            cmin: 0.0,
            size: 14,
            // line: {
            //   width: 2
            // },
            colorbar: {
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 }
            }
          },
          hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        }
      ],
      layout: { 
        width: 800,
        height: 550,
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
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
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
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
            },
      },
      config: {
            displaylogo: false,
            toImageButtonOptions: {
              format: 'svg', // one of png, svg, jpeg, webp
              filename: 'flame_scores',
              width: 800,
              height: 550,
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
      }
    };

    plotPie = {
      data:  [{
            values: [],
            labels: ['positive', 'negative'],
            textinfo: "label+percent",
            marker: { colors: ["red", "blue"] },
            type: 'pie'
      }],
      layout: {
            width: 300,
            height: 200,
            showlegend: false,
            margin: { r: 30, t: 30, b: 10, l: 30, pad: 0 },
      },
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
      }
    }
          
    ngOnChanges(): void {
      this.modelWarning = '';
      this.plotScores.data[0].x =[];
      this.plotScores.data[0].y =[];
      this.plotScores.data[0].text =[];
      this.plotScores.data[0].marker.color = [];
      this.predictData[0].r = [0, 0, 0, 0];
      this.fittingData[0].r = [0, 0, 0, 0];
      this.plotPie.data[0].values = []
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

          // PCA scores plot
          if ('PC1' in info) {
            this.plotScores.data[0].x = info['PC1'];
            this.plotScores.data[0].y = info['PC2'];
            this.plotScores.data[0].text = info['obj_nam'];
            this.plotScores.data[0].marker.color = info['ymatrix'];
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
              this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
                                        this.modelValidationInfo['FN'][1],
                                        this.modelValidationInfo['TN'][1], 
                                        this.modelValidationInfo['FP'][1]];

              this.plotPie.data[0].values = [ this.modelValidationInfo['TP'][1]+
                                        this.modelValidationInfo['FN'][1],
                                        this.modelValidationInfo['TN'][1]+
                                        this.modelValidationInfo['FP'][1],
                                      ]
            }
            if (this.modelValidationInfo['TP_f']) {
              this.fittingData[0].r = [this.modelValidationInfo['TP_f'][1], 
                                        this.modelValidationInfo['FN_f'][1],
                                        this.modelValidationInfo['TN_f'][1], 
                                        this.modelValidationInfo['FP_f'][1]];
              
              this.plotPie.data[0].values = [ this.modelValidationInfo['TP_f'][1]+
                                        this.modelValidationInfo['FN_f'][1],
                                        this.modelValidationInfo['TN_f'][1]+
                                        this.modelValidationInfo['FP_f'][1],
                                      ]
            }

            // common to all plots in this component
            const options = {'width': 300, 'height': 300};
            const smilesDrawer = new SmilesDrawer.Drawer(options);

            // scores plot                 
            const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas');
            const context = canvas.getContext('2d');

            PlotlyJS.newPlot('scoresDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresDIV');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              SmilesDrawer.parse(info['SMILES'][points.pointNumber], function(tree) {
                smilesDrawer.draw(tree, 'scores_canvas', 'light', false);
              });
            });
            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(data){
              context.clearRect(0, 0, canvas.width, canvas.height);
            });


          }, 50);
        },
        error => {
          alert('Error getting model');
        }
      );
    } 

}
