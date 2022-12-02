import { Component, ElementRef, Input, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, CustomHTMLElement, Globals, Model, Prediction, Profile } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
import * as PlotlyJS from 'plotly.js-dist-min';
import * as SmilesDrawer from 'smiles-drawer';
declare var $:any;
@Component({
  selector: 'app-prediction-list-tab',
  templateUrl: './prediction-list-tab.component.html',
  styleUrls: ['./prediction-list-tab.component.css']
})
export class PredictionListTabComponent implements OnChanges {

  constructor(
    private service: PredictorService,
    public prediction: Prediction,
    private commonService: CommonService,
    private compound: Compound,
    private toastr: ToastrService,
    public globals: Globals,
    public model: Model
  ) { }

  @Input() predictionName;
  @ViewChildren('cmp') components: QueryList<ElementRef>;

  ngOnChanges(): void {

    this.noNextMol = false;
    this.noPreviousMol = true;
    this.noNextModel = false;
    this.noPreviousModel = true;
    this.compound.molidx = 0;
    this.submodelsIndex = 0;
    this.prediction.modelBuildInfo = {};
    this.predictData[0].r = [0, 0, 0, 0];
    this.predictionError = '';
    
    this.activity_val = [];
    this.dmodx_val = [];
    this.plotScores.data = [
      JSON.parse(JSON.stringify(this.scores0defaults)),
      JSON.parse(JSON.stringify(this.scores1defaults)),
      JSON.parse(JSON.stringify(this.scores2defaults))
    ];
    this.getPrediction();
    this.getInfo();
    this.getDocumentation();  
    this.getValidation();
    this.globals.tablePredictionVisible = true;
    
}

  objectKeys = Object.keys;
  predictionVisible = false;
  dmodx = false;
  q_measures = ['TP', 'FP', 'TN', 'FN'];
  table: any = undefined;
  info = [];
  head = [];
  noNextMol = false;
  noPreviousMol = true;
  noNextModel = false;
  noPreviousModel = true;
  modelValidationInfo = {};
  submodels = [];
  submodelsIndex = 0;
  predictionError = '';
  isQuantitative = false;
  isMajority = false;
  showConcentration = false;
  activity_val = [];
  dmodx_val = [];

  predictData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FN", "TN", "FP"],
    meta: ["TP", "FN", "TN", "FP"],
    marker: {
      opacity: 0.8,
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"]
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

    bwcolorscale = [
      [0.0, 'rgb(160, 160, 160)'],
      [0.5, 'rgb(160, 160, 160)'],
      [1.0, 'rgb(160, 160, 160)'],
    ];
  
    greencolorscale = [
      [0.0, 'rgb(0, 107, 107)'],
      [0.5, 'rgb(0, 107, 107)'],
      [1.0, 'rgb(0, 107, 107)'],
    ];

    redcolorscale = [
      [0.0, 'rgb(255, 0, 0)'],
      [0.5, 'rgb(255, 0, 0)'],
      [1.0, 'rgb(255, 0, 0)'],
    ];


  scores0defaults = {
    x: [], 
    y: [], 
    text: [],
    meta: [],
    type: 'scatter', 
    mode: 'markers', 
    visible: true, 
    marker: {
      color: [],
      opacity: 0.6,
      size: 10,
      colorscale: this.bwcolorscale,
      showscale: false, 
      cauto: true,
      colorbar: {
        x: -0.25,
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 }
      }
    },
    hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
  };

  scores1defaults = { x: [], 
    y: [], 
    text: [],
    meta: [],
    type: 'scatter', 
    mode: 'markers', 
    textfont : {
      color : 'red',
      size: 16
    },
    textposition: 'top right',
    marker: {
      color: [],
      symbol: 'circle',
      colorscale: this.redcolorscale, 
      showscale: false, 
      opacity: 1,
      size: 14,
      line: {},
      colorbar: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 }
      }
    },
    hovertemplate:'<b>%{text}</b><br>%{meta:.2f}<extra></extra>',
  };

  scores2defaults = {
    x: [],
    y: [],
    autocontour: 20,
    showscale: false,
    visible: false, 
    colorscale: 'Greys',
    reversescale: true,
    type: 'histogram2dcontour',
    hoverinfo: 'skip',
  };

  plotScores = {
    data: [
      JSON.parse(JSON.stringify(this.scores0defaults)),
      JSON.parse(JSON.stringify(this.scores1defaults)),
      JSON.parse(JSON.stringify(this.scores2defaults))
    ],
    layout: { 
      width: 700,
      height: 500,
      hovermode: 'closest',
      margin: {r: 10, t: 30, pad: 0 },
      showlegend: false,
      showtitle: true,
      titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
      title: 'Prediction projected on training series',
      xaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC1',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14},
      },
      yaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC2',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 16 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14},
      },
    },
    config: {
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_prediction',
        width: 600,
        height: 400,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['autoScale2d','hoverCompareCartesian']
    }
  };

  getDocumentation() {
    this.showConcentration = false;
    this.commonService.getDocumentation(this.prediction.modelName, this.prediction.modelVersion, 'JSON').subscribe(
      result => {
        this.model.documentation = result;

        let unit = this.model.documentation['Endpoint_units'].value;
        if (unit != null) {
          if (unit.slice(-3)=='(M)') {
            if (unit.slice(0,1)=='p') {
              this.showConcentration = true;
            }
            if (unit.slice(0,4)=='-log') {
              this.showConcentration = true;
            }
          }
        }
      },
      error => {
        this.model.documentation = undefined;
      }
    );
  }
  getValidation() {
    this.commonService.getValidation(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        const info = result;
        if ('PC1' in info) {

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

          setTimeout(() => {
            this.plotScores.data[0].x = info['PC1'];
            this.plotScores.data[0].y = info['PC2'];
            this.plotScores.data[2].x = info['PC1'];
            this.plotScores.data[2].y = info['PC2'];
            this.plotScores.data[0].text = info['obj_nam'];
            this.plotScores.data[0].meta = info['SMILES'];
            this.plotScores.data[0].marker.color = info['ymatrix'];

            if ('SSX' in info) {
              this.plotScores.layout.xaxis.title = labelX + ' ('+(100.0*(info['SSX'][0])).toFixed(1)+'% SSX)';
              this.plotScores.layout.yaxis.title = labelY + ' ('+(100.0*(info['SSX'][1])).toFixed(1)+'% SSX)';
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
            } else {
              this.plotScores.layout.xaxis.title = labelX
              this.plotScores.layout.yaxis.title = labelY
              this.plotScores.layout.xaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
              this.plotScores.layout.yaxis.titlefont = {family: 'Barlow Semi Condensed, sans-serif',size: 16}
            }
            
          }, 100);
        }
      },
      error => {
        this.prediction.modelPresent = false;
        this.prediction.modelMatch = true; // prevent showing also this error!
      }
    )
  }
  
  getPrediction() {
    this.predictionVisible = false;
    this.prediction.result = undefined;
    $('#prediction').DataTable().destroy();

    this.modelValidationInfo = {};

    this.service.getPrediction(this.predictionName).subscribe(
      result => {
        if (result['error']) {
          this.predictionError = result['error']; 
        }
        
        // setTimeout(() => {
          if ('PC1proj' in result) {
            this.plotScores.data[1].x = result['PC1proj'];
            this.plotScores.data[1].y = result['PC2proj'];
            this.plotScores.data[1].text = result['obj_nam'];
            this.activity_val = result['values']

            if (!this.isQuantitative){
              for (var i=0; i<this.activity_val.length; i++){
                if (this.activity_val[i]<0.0) {
                  this.activity_val[i]=0.5;
                }
              }
            }
            // this.plotScores.data[1].meta = result['values'];
            this.plotScores.data[1].meta = this.activity_val;
            if ('PCDMODX' in result) {
              this.dmodx = true;
              this.plotScores.data[1].marker.color = result['PCDMODX'];
              this.dmodx_val = result['PCDMODX'];
            }
            else {
              this.dmodx = false;
              for (var i=0; i<result['obj_nam'].length; i++) {
                this.plotScores.data[1].marker.color[i] = 0.0;
                this.dmodx_val[i] = 0.0;
              }
            }

          };
          
        // }, 100);

        this.prediction.result = result;

        if ('external-validation' in this.prediction.result) {
          for (const modelInfo of this.prediction.result['external-validation']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            }
          }
        }
        if ('TP' in this.modelValidationInfo) {
          this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
          this.modelValidationInfo['FN'][1],
          this.modelValidationInfo['TN'][1], 
          this.modelValidationInfo['FP'][1]];
        }
        
        const options_list = {'width': 200, 'height': 125};
        const smilesDrawer = new SmilesDrawer.Drawer(options_list);
        
        // use a long timeout because this can take a lot of time
        setTimeout(() => {

          // List Tab
          let istructure = 0;
          let alerted = false;

          this.components.forEach((child) => {
            if (istructure < 200) {
              SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
                smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
              }, function (err) {
                console.log(err);
              });
              istructure++;
            } else {
              if (!alerted) {
                this.toastr.info( 'Too many structures, only the first 200 were rendered' , 'Information', {
                  timeOut: 3000, positionClass: 'toast-top-right'});
                alerted = true;
              }
            }
          });

          // add buttons to table
          const settingsObj: any = {
            deferRender: true,
            autoWidth: false, 
            destroy: true,
            dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
            '<"row"<"col-sm-12"tr>>' +
            '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            buttons: [
              { 'extend': 'copy', 'text': 'Copy', 'className': 'btn-primary' , title: ''},
              { 'extend': 'excel', 'text': 'Excel', 'className': 'btn-primary' , title: ''},
              { 'extend': 'pdf', 'text': 'Pdf', 'className': 'btn-primary' , title: ''},
              { 'extend': 'print', 'text': 'Print', 'className': 'btn-primary' , title: ''}
            ],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
              // const self = this;
              $('td', row).unbind('click');
              $('td', row).bind('click', () => {
                this.tabClickHandler(row,data);
              });
              return row;
            },
          };

          $('#prediction').DataTable(settingsObj);
          
          // Report tab
          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              me.drawReportHeader();
              me.drawSimilars();
            }
          });

          this.predictionVisible = true;
          var report = document.getElementById("pills-one-tab")
          report.click();
          // Series tab
          // scores plot requires to define interactive behaviour
          if (this.prediction.modelMatch){
             this.setScoresPlot(result)
          }
          }, 1000); // timeout
      }
    );
  }
  setScoresPlot (result) {
    const options = {'width': 400, 'height': 250};
    const smilesDrawerScores = new SmilesDrawer.Drawer(options);    

    // const canvas_ref = <HTMLCanvasElement>document.getElementById('scores_canvas_ref');
    // const context_ref = canvas_ref.getContext('2d');
    const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas_pre');
    const context = canvas.getContext('2d');

    
    PlotlyJS.newPlot('scoresPreDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
    
    let myPlot = <CustomHTMLElement>document.getElementById('scoresPreDIV');
    
    // on hover, draw the molecule
    myPlot.on('plotly_hover', function(eventdata){ 
      var points = eventdata.points[0];
      if (points.curveNumber === 1) {
        SmilesDrawer.parse(result['SMILES'][points.pointNumber], function(tree) {
          smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
        });   
        // context_ref.font = "30px Barlow Semi Condensed";
        // context_ref.fillText(result['obj_nam'][points.pointNumber], 20, 50); 
      }
      else {
        SmilesDrawer.parse(points.meta, function(tree) {
          smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
        });
      }
    });

    // on onhover, clear the canvas
    myPlot.on('plotly_unhover', function(eventdata){
      var points = eventdata.points[0];
      if (points.curveNumber === 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
        
    const sel_options = {'width': 200, 'height': 125};
    const smilesDrawerScoresSelected = new SmilesDrawer.Drawer(sel_options);   

    myPlot.on('plotly_selected', function(eventdata){
      var tbl = <HTMLTableElement>document.getElementById('tablePredictionSelections');
      if (eventdata != null && 'points' in eventdata) {
        var points = eventdata.points;
        // console.log(points);
        points.forEach(function(pt) {
          const tr = tbl.insertRow();

          var ismiles = '';
          var iactiv = ''; 
          var canvasid = '';
          if (pt.curveNumber === 0) {
            ismiles = pt.meta;
            iactiv = pt["marker.color"];
            canvasid = 'reference'+pt.pointNumber;
          }
          else {
            tr.setAttribute('style', 'background: #f7f9ea');
            ismiles = result['SMILES'][pt.pointNumber];
            iactiv = pt.meta.toFixed(2);
            canvasid = 'prediction'+pt.pointNumber;
          }
          const tdname = tr.insertCell();
          tdname.appendChild(document.createTextNode(pt.text));
          tdname.setAttribute('style', 'max-width:100px');

          const tdsmiles = tr.insertCell();
          tdsmiles.setAttribute('class', 'align-middle text-center' )
          const icanvas = document.createElement('canvas')
          icanvas.setAttribute('id', canvasid);
          tdsmiles.appendChild(icanvas);
          SmilesDrawer.parse(ismiles, function(tree) {
            smilesDrawerScoresSelected.draw(tree, canvasid, 'light', false);
          });

          const tdactiv = tr.insertCell();
          tdactiv.setAttribute('class', 'align-right' );
          tdactiv.appendChild(document.createTextNode(iactiv));

        });
      }
      else {
        for(var i = 1;i<tbl.rows.length;){
          tbl.deleteRow(i);
        }
      }  
    });
  }

  isInteger(value) {
    return value % 1 == 0;
  }
  
  tabClickHandler(row,info: any): void {
    // prevents the selection of a molecule when you are on projection tab.
    var projectTab = $('#pills-two-tab').attr("aria-selected")
    
    
    if(projectTab == "false" || projectTab == undefined){

      $('#prediction tr.selected').removeClass('selected');
      $(row).addClass("selected");

      this.compound.molidx=parseInt(info[0])-1;
      this.noPreviousMol = false;
      this.noNextMol = false;
      if (this.compound.molidx == 0) {
        this.noPreviousMol = true;
      }
      if (this.compound.molidx == (this.prediction.result.SMILES.length - 1)) {
        this.noNextMol = true;
      }
      this.commonService.setPagination(this.noPreviousMol,this.noNextMol);
  
      this.drawReportHeader();
      this.drawSimilars();
    }
    // this.updatePlotCombo();
  }

  drawReportHeader () {
    const options = {'width': 400, 'height': 200};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.prediction.result.SMILES[this.compound.molidx], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }
  
  drawSimilars () {
    setTimeout(() => {
      // draw similar compounds (if applicable)
      if (this.prediction.result.hasOwnProperty('search_results')) {
        const optionsA = {'width': 300, 'height': 200};
        const smiles = this.prediction.result.search_results[this.compound.molidx].SMILES;
        let iteratorCount = 0;
        for (var value of smiles) {
          const smilesDrawer = new SmilesDrawer.Drawer(optionsA);
          SmilesDrawer.parse(value, function(tree) {
            let canvasName = 'one_canvas';
            smilesDrawer.draw(tree,  canvasName.concat(iteratorCount.toString()), 'light', false);
          }, function (err) {
            console.log(err);
          });
          iteratorCount++;
        };  
      };
    },0);
  }

  getInfo(): void {
    this.commonService.getModel(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        for (const info of result) {
          this.prediction.modelBuildInfo[info[0]] = info[2];
        }

        //support for legacy models using significance instead of confidence
        if (this.prediction.modelBuildInfo['conformal_significance']!=undefined){
          this.prediction.modelBuildInfo['conformal_confidence'] = 1.0 - this.prediction.modelBuildInfo["conformal_significance"];
        }

        this.prediction.modelPresent = true;

        this.prediction.modelMatch = (this.prediction.modelBuildInfo['modelID'] == this.prediction.modelID);

        this.isQuantitative = this.prediction.modelBuildInfo['quantitative'];
        this.isMajority = this.prediction.modelBuildInfo['model'] == 'combination:majority voting' || 
                          this.prediction.modelBuildInfo['model'] == 'combination:logical OR' ;

        if (this.prediction.modelBuildInfo['ensemble']) {

          let version = '0';
          this.submodels = [];
          this.prediction.modelBuildInfo['ensemble_names'].forEach((submodel, index) => {

            if (this.prediction.modelBuildInfo['ensemble_names']) {
              version = this.prediction.modelBuildInfo['ensemble_versions'][index];
            } else {
              version = '0';
            }
            this.submodels[index] = {};
            this.submodels[index]['name'] = submodel;
            this.submodels[index]['version'] = version;
            this.commonService.getModel(submodel, version).subscribe(
              result3 => {
                for (const info of result3) {
                  this.submodels[index][info[0]] = info[2];
                }
              },
              error => {
              }
            );
          });
        }
      },
      error => {
        this.prediction.modelPresent = false;
        this.prediction.modelMatch = true; // prevent showing also this error!
      }
    );   
  }

  backConc(value: any) {
    return (Math.pow(10,6-value).toFixed(4))
  }

  castValue(value: any) {
    if (this.prediction.modelBuildInfo['quantitative']) {
      return value.toFixed(3);
    } else {
      if (value === 0) {
        return 'Negative';
      } else if (value === 1) {
        return 'Positive';
      } else {
        return 'Uncertain';
      }
    }
  }

}
