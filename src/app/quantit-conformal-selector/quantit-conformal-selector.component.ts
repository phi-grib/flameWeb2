import { Component, Input, OnChanges } from '@angular/core';
import { CommonService } from '../common.service';
import { CustomHTMLElement, Model } from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js-dist-min';
declare var $:any;
@Component({
  selector: 'app-quantit-conformal-selector',
  templateUrl: './quantit-conformal-selector.component.html',
  styleUrls: ['./quantit-conformal-selector.component.css']
})
export class QuantitConformalSelectorComponent implements OnChanges {
  constructor(
    private commonService: CommonService,
    public model: Model) { }

    @Input() modelName;
    @Input() modelVersion;
    @Input() modelID;

    objectKeys = Object.keys;
    modelValidationInfo = {};
    modelTypeInfo = {};
    modelBuildInfo = {};
    modelWarning = '';
    modelVisible = false;
    features = false;
    optimization = false;
    features_method = '';
    featuresTSV = '';
    scores = '';

    plotFitted = {
      data: [{ x: [], 
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
                },

              },
              hovertemplate:'<b>%{text}</b><br>(%{x:.2f} %{y:.2f})<extra></extra>',
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
          ]
    };
    
    plotPredicted = {
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
          hovertemplate:'<b>%{text}</b><br>(%{x:.2f} %{y:.2f})<extra></extra>',
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

    plotScatter = {
      layout: { 
        width: 700,
        height: 500,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 10 },
        showlegend: false,
        showtitle: false,

        xaxis: {
          range: [],
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Experimental',
          titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          tickfont: { family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        },
        yaxis: {
          range: [],
          hoverformat: '.2f',
          zeroline: false,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'Model',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        },
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_scatter',
          width: 800,
          height: 550,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']    
      }
    };

    plotScores = {
      data: [
        { x: [], 
          y: [], 
          text: [],
          meta: [],
          type: 'scatter', 
          mode: 'markers', 
          marker: {
            color: [],
            opacity: 0.6,
            colorscale: 'RdBu', 
            showscale: true, 
            cauto: true,
            size: 10,
            colorbar: {
              titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
              title: 'Activity'
            }
          },
          hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
        },
        {
          x: [],
          y: [],
          colorscale: 'Greys',
          autocontour: true,
          reversescale: true,
          showscale: false,
          visible: false, 
          type: 'histogram2dcontour',
          hoverinfo: 'skip',
          // contours: { 
          //   // coloring: "none", 
          //   showlines: false,
          //   coloring: 'heatmap' 
          // }
        }
      ],
      layout: { 
        width: 700,
        height: 500,
        hovermode: 'closest',
        margin: { r: 10, t: 30, pad: 0  },
        showlegend: false,
        showtitle: true,
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        title: 'Training series (using model X matrix)', 
        xaxis: {
          zeroline: true,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'PCA PC1',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif',size: 16},
          tickfont: {family: 'Barlow Semi Condensed, sans-serif',size: 14},
        },
        yaxis: {
          zeroline: true,
          showgrid: true,
          showline: true,
          gridwidth: 1,
          linecolor: 'rgb(200,200,200)',
          linewidth: 2,
          title: 'PCA PC2',
          titlefont: {family: 'Barlow Semi Condensed, sans-serif',size: 16},
          tickfont: {family: 'Barlow Semi Condensed, sans-serif',size: 14},
        },
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_scores',
          width: 700,
          height: 500,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
        modeBarButtonsToRemove: ['autoScale2d','hoverCompareCartesian']    
      }
    }

    plotViolin= {
      data : [{
        type: 'violin',
        // orientation: 'h',
        y: [],
        text: [],
        points: 'all',
        pointpos: 2,
        hoveron: "violins+points",
        box: { visible: true },
        boxpoints: true,
        // hoverlabel: { bgcolor: "#22577"},
        line: {color: '#22577'},
        hovertemplate: '<b>%{text}</b><br>%{y:.2f}<extra></extra>',
        fillcolor: "#B8DCED",
        opacity: 0.8,
        meanline: {visible: true},
        name: 'Activity'
      }],
      layout : {
        width: 200,
        height: 200,
        hovermode: 'closest',
        margin: {r: 10, t: 50, b: 0, l:10, pad: 0},
        xaxis: {
          zeroline: false,
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size:14 },
        }
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_violin',
          width: 500,
          height: 400,
          scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
      
    }
    
    plotOptimization= {
      data : [{
        type: 'bar',
        x: [],
        y: [],
        // orientation: 'h', 
        error_y: {
          type: 'data',
          array: []
        },
        marker: {
          color: []
        },
        hovertemplate: '<b>%{x}</b><br>%{y:.3f}<extra></extra>'
      }],
      layout : {
        title: 'Optimization results (scorer mean +/- sd)',
        font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        width: 900,
        height: 600,
        hovermode: 'closest',
        margin: {b:10, t:50, pad: 10},
        xaxis: {
          showticklabels: false, 
          // ticklabeloverflow: 'allow',
          // tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 12 },
        },
        yaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        },
      },
      config: {
        displaylogo: false,
        showtitle: true, 
        showlegend: false, 
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'optimization_results',
          width: 900,
          height: 600,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
    }

    plotFeatures= {
      data : [{
        type: 'bar',
        y: [],
        x: [],
        hoverlabel: { bgcolor: "#0076a3"},
        hovertemplate: '<b>%{x}</b><br>%{y:.3f}<extra></extra>',
        marker: {
          color: "#0076a3"
        }
      }],
      layout : {
        title: 'Feature importances (top 50)',
        font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        width: 900,
        height: 600,
        barmode: 'overlay',
        hovermode: 'closest',
        margin: {b:200, t:50, pad: 10},
        xaxis: {
          tickangle: -45,
          dtick: 1, 
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 12 },
        },
        yaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
        },
      },
      config: {
        displaylogo: false,
        showtitle: true, 
        showlegend: false, 
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_features',
          width: 600,
          height: 500,
          scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
    }

    plotSummary = {
      data:  [{
            x: ['R2/Q2', 'Conformal accuracy'],
            y: [],
            name:'fitting',
            type: 'bar',
            texttemplate: "%{y:.2f}",
            textposition: 'auto',
            textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
            marker: {
              color: 'rgba(70,143,184,0.8)', 
            }
          },{
            x: ['R2/Q2', 'Conformal accuracy'],
            y: [],
            name:'prediction',
            type: 'bar',
            texttemplate: "%{y:.2f}",
            textposition: 'auto',
            textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
            marker: {
              color: 'rgba(156,198,221,0.8)',
            }
          }],
      layout: {
            yaxis: {
              range: [0.0,1.0],
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
            },
            xaxis: {
              tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
            },
            width: 400,
            height: 300,
            margin: {r: 5, t: 20, b: 20, l:30},
            showlegend: true,
            barmode: 'group'
      },
      config: {
        displayModeBar: false
        // displaylogo: false,
        // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
      }
    }

    public changeProjectStyleMark (value:string) {
      var update = {'visible':[true, false]}
      if (value == 'density') {
        update = {'visible':[false, true]}
      }
      if (value == 'both') {
        update = {'visible':[true, true]}
      }
      PlotlyJS.restyle('scoresDIV_sel', update);
    }

    ngOnChanges(): void {
      this.modelVisible = false;
      this.modelTypeInfo = {};
      this.modelValidationInfo = {};
      this.modelBuildInfo = {};
      this.features = false;
      this.optimization = false;
      this.features_method = '';
      this.modelWarning = '';
      this.scores = '';
      this.plotFitted.data[0].x = [];
      this.plotFitted.data[0].y = [];
      this.plotFitted.data[0].error_y.array = [];
      this.plotFitted.data[0].error_y.arrayminus = [];
      this.plotFitted.data[0].text = [];
      
      this.plotPredicted.data[0].x = [];
      this.plotPredicted.data[0].y = [];
      this.plotPredicted.data[0].error_y.array = [];
      this.plotPredicted.data[0].error_y.arrayminus = [];
      this.plotPredicted.data[0].text = [];

      this.plotScores.data[0].x =[];
      this.plotScores.data[0].y =[];
      this.plotScores.data[1].x =[];
      this.plotScores.data[1].y =[];
      this.plotScores.data[0].text =[];
      this.plotScores.data[0].meta = [];
      this.plotScores.data[0].marker.color = [];
      this.plotViolin.data[0].y =[];
      this.plotViolin.data[0].text =[];
      this.plotFeatures.data[0].y =[];
      this.plotFeatures.data[0].x =[];
      this.plotOptimization.data[0].y =[];
      this.plotOptimization.data[0].x =[];
      this.plotOptimization.data[0].error_y.array =[];
      this.plotOptimization.data[0].marker.color =[];
      this.plotSummary.data[0].y = [];
      this.plotSummary.data[1].y = [];
      this.featuresTSV = '';
      
      this.getValidation();
      this.getDocumentation();
    }

    isObject(val) {
      if (val === null) {
        return false;
      }
      return typeof val === 'object';
    }

    getDocumentation() {
      this.commonService.getDocumentation(this.modelName, this.modelVersion, 'JSON').subscribe(
        result => {
          let label_units = '';
          if (result['Endpoint_units'].value != undefined) {
            label_units = ': '+ result['Endpoint_units'].value;
          }
          this.plotScatter.layout.xaxis.title= 'Experimental'+label_units;
          this.plotScatter.layout.xaxis.titlefont = { family: 'Barlow Semi Condensed, sans-serif', size: 18 };
          this.plotScatter.layout.yaxis.title= 'Model'+label_units;
          this.plotScatter.layout.yaxis.titlefont = { family: 'Barlow Semi Condensed, sans-serif', size: 18 };
        }
      );
    }

    downloadFeatures () {
      var element = document.createElement("a");
      element.setAttribute('href', 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(this.featuresTSV));
      element.setAttribute('download', 'feature_importances'+this.modelName+'v'+this.modelVersion+'.tsv');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    getValidation() {
      this.commonService.getValidation(this.modelName, this.modelVersion).subscribe(
        result => {
          const info = result;
          
          this.model.input_type = info.meta.input_type;
          
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
            
            // translation for back_compatibility
            if (modelInfo[0]==='Conformal_accuracy_fitting') {
              this.modelValidationInfo ['Conformal_accuracy_f'] = [modelInfo[1], modelInfo[2]];
            }
            
            // translation for back_compatibility
            if (modelInfo[0]==='Conformal_mean_interval_fitting') {
              this.modelValidationInfo ['Conformal_mean_interval_f'] = [modelInfo[1], modelInfo[2]];
            }
            
          }

          for (let ielement of info['model_build_info']) {
            this.modelBuildInfo[ielement[0]]=[ielement[1], ielement[2]]
          }
          for (let ielement of info['model_type_info']) {
            this.modelTypeInfo[ielement[0]]=[ielement[1], ielement[2]]
          }

          // if (this.modelTypeInfo['secret'][1]) {
          if (this.model.secret) {

              this.model.secret = true;
              this.plotSummary.data[1].y = [
                this.modelValidationInfo['Q2'][1]];
              this.plotSummary.data[0].y = [
                this.modelValidationInfo['R2'][1]];
                
              this.modelVisible = true;
              return;
          }

          setTimeout(() => {

            // PCA scores plot
            if ('PC1' in info) {
              this.scores='training';

              // define appropriate labels extracting from manifest
              const manifest = info['manifest'];
              var labelX = 'PCA PC1';
              var labelY = 'PCA PC2';
              for (var iman in manifest) {
                if (manifest[iman]['key'] == 'PC1') {
                  labelX = manifest[iman]['label'];
                }
                if (manifest[iman]['key'] == 'PC2') {
                  labelY = manifest[iman]['label'];
                }
              }

              this.plotScores.data[0].x = info['PC1'];
              this.plotScores.data[0].y = info['PC2'];
              this.plotScores.data[1].x = info['PC1'];
              this.plotScores.data[1].y = info['PC2'];
              this.plotScores.data[0].text = info['obj_nam'];
              this.plotScores.data[0].meta = info['SMILES'];
              this.plotScores.data[0].marker.color = info['ymatrix'];

              if ('SSX' in info) {
                this.plotScores.layout.xaxis.title = labelX + ' ('+(100.0*(info['SSX'][0])).toFixed(1)+'% SSX)';
                this.plotScores.layout.yaxis.title = labelY + ' ('+(100.0*(info['SSX'][1])).toFixed(1)+'% SSX)';
                this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
                this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              } else {
                this.plotScores.layout.xaxis.title = labelX;
                this.plotScores.layout.yaxis.title = labelY;
                this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
                this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 18}
              }
            }

            // common to all plots in this component
            const options = {'width': 400, 'height': 250};
            const sd = new SmilesDrawer.SmiDrawer(options);

            // scores plot                 
            const img = <HTMLCanvasElement>document.getElementById('scores_canvas_sel');

            PlotlyJS.newPlot('scoresDIV_sel', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresDIV_sel');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              img.style.display = "block";
              var points = eventdata.points[0];
              sd.draw(info['SMILES'][points.pointNumber],"#scores_canvas_sel");
            });

            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(data){
              img.style.display = "none";
            });

            const sel_options = {'width': 200, 'height': 125};
            const smilesDrawerScoresSelected = new SmilesDrawer.SmiDrawer(sel_options);  

            myPlot.on('plotly_selected', function(eventdata){
              var tbl = <HTMLTableElement>document.getElementById('tableSelectionsSelector');
              if (eventdata != null && 'points' in eventdata) {
                $('#btnCompoundsSelectedSel').prop('disabled', false);
                var points = eventdata.points;
                // console.log(points);
                points.forEach(function(pt) {
                  const tr = tbl.insertRow();
        
                  var ismiles = info['SMILES'][pt.pointNumber];
                  var iactiv = pt["marker.color"];
                  var imgId = '#qtseries'+pt.pointNumber;

                  // iactiv = pt.meta.toFixed(2);

                  const tdname = tr.insertCell();
                  tdname.appendChild(document.createTextNode(pt.text));
                  tdname.setAttribute('style', 'max-width:100px')
        
                  const tdsmiles = tr.insertCell();
                  tdsmiles.setAttribute('class', 'align-middle text-center' )
                  const img = document.createElement('img')
                  img.setAttribute('id', imgId);
                  tdsmiles.appendChild(img);
                  smilesDrawerScoresSelected.draw(ismiles,imgId)
                  const tdactiv = tr.insertCell();
                  tdactiv.setAttribute('class', 'align-right' )
                  tdactiv.appendChild(document.createTextNode(iactiv));
                });
              }
              else {
                $('#btnCompoundsSelectedSel').prop('disabled', true);
                for(var i = 1;i<tbl.rows.length;){
                  tbl.deleteRow(i);
                }
              }  
            });

            // violin plot with activity values
            this.plotViolin.data[0].y = info['ymatrix'];
            this.plotViolin.data[0].text = info['obj_nam'];
            
            // bar plot with feature importances 
            if ('feature_importances' in info && info['feature_importances']!= null) {
              const fval = info['feature_importances'];
              const fnam = info['var_nam'];

              for (let i = 0; i<fval.length; i++){
                this.featuresTSV+= fnam[i] + '\t' + fval[i].toFixed(4) + '\n';
              }
              
              // sort the values and select the 50 top 
              const indices = Array.from(fval.keys());
              indices.sort((a:number, b:number) => fval[b] - fval[a]);

              const sortedFval = indices.map(function(num:number) {return fval[num]});
              const sortedFnam = indices.map(function(num:number) {return fnam[num]});
  
              const nfeatures = Math.min(fval.length, 50);
  
              this.plotFeatures.data[0].y = sortedFval.slice(0,nfeatures);
              this.plotFeatures.data[0].x = sortedFnam.slice(0,nfeatures);
              this.features = true;
            }
            this.features_method = info['feature_importances_method'];

            if ('optimization_results' in info && 
              info['optimization_results']['means']!= null &&
              info['optimization_results']['labels']!= null) {
              this.plotOptimization.data[0].y = info['optimization_results']['means'];
              this.plotOptimization.data[0].x = info['optimization_results']['labels'];
              this.plotOptimization.data[0].error_y.array = info['optimization_results']['stds'];
              for (let i = 0; i<info['optimization_results']['labels'].length; i++){
                if (info['optimization_results']['labels'][i]!= info['optimization_results']['best']) {
                  this.plotOptimization.data[0].marker.color[i] = "#0076a3";
                }
                else {
                  this.plotOptimization.data[0].marker.color[i] = "#e59300";
                }
              }
              this.plotOptimization.layout.title= info['optimization_results']['scorer'];

              this.optimization = true;
            }
            
            if (this.modelValidationInfo['Conformal_accuracy'] && this.modelValidationInfo['Conformal_accuracy_f']) {
              this.plotSummary.data[1].y = [
                this.modelValidationInfo['Q2'][1],
                this.modelValidationInfo['Conformal_accuracy'][1]];
              
              this.plotSummary.data[0].y = [
                this.modelValidationInfo['R2'][1],
                this.modelValidationInfo['Conformal_accuracy_f'][1]];
            }
            else {
              this.plotSummary.data[1].y = [
                this.modelValidationInfo['Q2'][1]];
              this.plotSummary.data[0].y = [
                this.modelValidationInfo['R2'][1]];
            }

            // predicted data
            if ('Y_pred' in info) {
              this.plotPredicted.data[0].x = info['ymatrix'] ;
              this.plotPredicted.data[0].y = info['Y_pred'];
              
              if (('upper_limit' in info) && ('lower_limit' in info)) {
                for (const i in info['ymatrix']) {
                  this.plotPredicted.data[0].error_y.array[i] = info['upper_limit'][i]- info['Y_pred'][i];
                  this.plotPredicted.data[0].error_y.arrayminus[i] = info['Y_pred'][i] - info['lower_limit'][i];
                }
              }
              else {
                if (this.model.conformal) {
  
                  // const yintpred  = this.modelConformal['Conformal_prediction_ranges']; // (min, max)
                  if ('Conformal_prediction_ranges' in info){
                    const yintpred  = info['Conformal_prediction_ranges']; // (min, max)
                    for (const i in info['ymatrix']) {
                      this.plotPredicted.data[0].error_y.array[i] = yintpred[i][1] - info['Y_pred'][i];
                      this.plotPredicted.data[0].error_y.arrayminus[i] = info['Y_pred'][i] - yintpred[i][0];
                    }
                  }
                  else {
                    console.log('CI prediction info not found, please update your model');
                  }
                }
              }
              
              this.plotPredicted.data[0].text = info['obj_nam'];
              const plot_min = Math.min ( Math.min.apply(Math, info['ymatrix']), Math.min.apply(Math, info['Y_pred'])); 
              const plot_max = Math.max ( Math.max.apply(Math, info['ymatrix']), Math.max.apply(Math, info['Y_pred'])); 
              this.plotPredicted.data[1].x = [ plot_min, plot_max];
              this.plotPredicted.data[1].y = [ plot_min, plot_max];

              let low_range;
              let high_range;
              if (plot_min>0) {
                low_range = plot_min - (plot_min/10.0);
                high_range = plot_max + (plot_max/10.0)
              } else {
                low_range = plot_min + (plot_min/10.0);
                high_range = plot_max - (plot_max/10.0);
              }

              this.plotScatter.layout.yaxis.range = [low_range, high_range];

              // this.plotPredicted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              // this.plotPredicted.data[1].y = [ Math.min.apply(Math, info['Y_pred']), Math.max.apply(Math, info['Y_pred'])];
            }

            // ajusted data
            if ('Y_adj' in info) {
              this.plotFitted.data[0].x = info['ymatrix'] ;
              this.plotFitted.data[0].y = info['Y_adj'];
              
              if (('upper_limit' in info) && ('lower_limit' in info)) {
                for (const i in info['ymatrix']) {
                  this.plotFitted.data[0].error_y.array[i] = info['upper_limit'][i]- info['Y_adj'][i];
                  this.plotFitted.data[0].error_y.arrayminus[i] = info['Y_adj'][i] - info['lower_limit'][i];
                }
              }
              else {
                if (this.model.conformal) {
                  if ('Conformal_prediction_ranges_fitting' in info){
                    // const yintfit  = this.modelConformal['Conformal_prediction_ranges_fitting']; // (min, max)
                    const yintfit  = info['Conformal_prediction_ranges_fitting']; // (min, max)
                    for (const i in info['ymatrix']) {
                      this.plotFitted.data[0].error_y.array[i] = yintfit[i][1] - info['Y_adj'][i];
                      this.plotFitted.data[0].error_y.arrayminus[i] = info['Y_adj'][i] - yintfit[i][0];
                    }
                  }
                  else {
                    console.log('CI fitting info not found, please update your model');
                  }
                }
              }
              
              this.plotFitted.data[0].text = info['obj_nam'];
              const plot_min = Math.min ( Math.min.apply(Math, info['ymatrix']), Math.min.apply(Math, info['Y_adj'])); 
              const plot_max = Math.max ( Math.max.apply(Math, info['ymatrix']), Math.max.apply(Math, info['Y_adj'])); 
              this.plotFitted.data[1].x = [ plot_min, plot_max];
              this.plotFitted.data[1].y = [ plot_min, plot_max];

              // this.plotFitted.data[1].x = [ Math.min.apply(Math, info['ymatrix']), Math.max.apply(Math, info['ymatrix'])];
              // this.plotFitted.data[1].y = [ Math.min.apply(Math, info['Y_adj']),Math.max.apply(Math, info['Y_adj'])];
            }

            const me = this;
            // predicted plot                 
            const img_pred = <HTMLCanvasElement>document.getElementById('scatter_pred_canvas_sel');

            PlotlyJS.newPlot('scatterPredDIV_sel', this.plotPredicted.data, this.plotScatter.layout, this.plotScatter.config);
            
            let myPlotPred = <CustomHTMLElement>document.getElementById('scatterPredDIV_sel');

            // on hover, draw the molecule
            myPlotPred.on('plotly_hover', function(eventdata){ 
              img_pred.style.display = "block"; 
              var points = eventdata.points[0];
              sd.draw(info['SMILES'][points.pointNumber],"#scatter_pred_canvas_sel");
            });

            // on onhover, clear the canvas
            myPlotPred.on('plotly_unhover', function(data){
              img_pred.style.display = "none";
            });

            // fitted plott
            const img_fit = <HTMLCanvasElement>document.getElementById('scatter_fit_canvas_sel');

            PlotlyJS.newPlot('scatterFitDIV_sel', this.plotFitted.data, this.plotScatter.layout, this.plotScatter.config);
            
            let myPlotFit = <CustomHTMLElement>document.getElementById('scatterFitDIV_sel');
            
            // on hover, draw the molecule
            myPlotFit.on('plotly_hover', function(eventdata){
              img_fit.style.display = "block"; 
              var points = eventdata.points[0];
              sd.draw(info['SMILES'][points.pointNumber],"#scatter_fit_canvas_sel")
            });
            // on onhover, clear the canvas
            myPlotFit.on('plotly_unhover', function(data){
              img_fit.style.display = "none";
            });

            myPlotFit.on ('plotly_afterplot', function(data){
              me.modelVisible = true;
            });
          }, 100);
        },
        error => {
          this.model.trained = false;
          this.model.listModels[this.modelName+ '-' + this.modelVersion].trained = false;
          // alert('Error getting model information');
        }
        );
        };
        downloadCompoundsSelected(){
          var listCompounds = 'Name' + '\t' + 'SMILES' + '\t' + 'Activity' + '\t' + "x" + "\t" + "y" + "\n";
          let rows = document.getElementById("tableSelectionsSelector").getElementsByTagName('tr');
          for (let i = 1; i < rows.length; i++) {
            const el = rows[i].getElementsByTagName('td')[0].textContent;
            for (let y = 0; y < this.plotScores.data[0].text.length; y++) {
              const element = this.plotScores.data[0].text[y];
              if(el === element){
               let smile = this.plotScores.data[0].meta[y]
               let activity = this.plotScores.data[0].marker.color[y]
               let x = this.plotScores.data[0].x[y]
               let Y = this.plotScores.data[0].y[y]
               listCompounds += el + '\t' + smile + '\t' + activity + '\t' + x + '\t' + Y + '\n';
              }
            } 
          }
          if(rows.length > 1){
          var element = document.createElement("a");
           element.setAttribute('href', 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(listCompounds));
           element.setAttribute('download', 'series'+this.modelName+'v'+this.modelVersion+'.tsv');
           element.style.display = 'none';
           document.body.appendChild(element);
           element.click();
           document.body.removeChild(element);
          }
        }
    }


