import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Globals, Model, Prediction } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
import chroma from "chroma-js";
import * as SmilesDrawer from 'smiles-drawer';
declare var $: any;

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.css']
})
export class ProfileSummaryComponent implements OnInit {
  result: any;
  prevSelection: any = undefined;
  Smodel: number = undefined;
  Smol:number = undefined;
  gamaColor = undefined;
  profileSelected = undefined;
  prevTR = undefined;

  opt2 = {
    columnDefs: [
      { "width": "20%", "targets": 0 }
    ],
    autoWidth: true,
    destroy: true,
    paging: true,
    ordering: true,
    searching: true,
    info: true,
  }
  opt = {
    columnDefs: [
      { "width": "20%", "targets": 0 }
    ],
    autoWidth: false,
    destroy: true,
    paging: false,
    ordering: true,
    searching: false,
    info: false,
  }

  constructor(  private service: PredictorService,
    public prediction: Prediction,
    public commonService: CommonService,
    public commonFunctions: CommonFunctions,
    public globals: Globals,
    private model: Model,
    private renderer2: Renderer2,) { }

  ngOnInit(): void {
    this.getProfileList();
        /**
     * when create a new profile.
     */
         this.commonService.predictionExec$.subscribe(() => {
          setTimeout(() => {
            this.getProfileList(); 
          },500)  
        })
  }
  generateTooltip(event, compound, value) {
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
     const column = event.target._DT_CellIndex.column-2;
     const val = this.castValue(value,column);
     const text = compound + "<br>" + this.prediction.profileSummary['endpoint'][column] + "<br>" + val;
     event.target.setAttribute('data-content', text);  
     
  }
  showPrediction(event, molIndex,td) {
    const column = event.target._DT_CellIndex.column - 2;
    const modelName = this.prediction.profileSummary['endpoint'][column] + '-' + this.prediction.profileSummary['version'][column];
    const modelObj = this.model.listModels[modelName];
    this.prediction.modelName = this.prediction.profileSummary['endpoint'][column];
    this.prediction.modelVersion = this.prediction.profileSummary['version'][column];
    this.prediction.modelID = modelObj['modelID'];    
    this.commonService.setMolAndModelIndex(molIndex,column);
    this.selectedClass(event,td);
    $('#container-pred').show()      
      }
      /**
 * Function to add specific styles to the selected prediction.
 * @param event 
 * @param td 
 */
  selectedClass(event,td) {
    if((this.Smol,this.Smodel)!=undefined){
      this.renderer2.setStyle(this.Smol,'background','white')
      $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'white');
    }
      this.Smodel = event.target._DT_CellIndex.column;
      this.Smol = td;
      this.renderer2.setStyle(td,'background','#f7f9ea')
      $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'#f7f9ea');
      
      if (this.prevSelection) this.prevSelection.classList.remove('pselected');
      this.prevSelection = event.target;
      event.target.classList.add('pselected');
      
    }
    getProfileList(){
      this.prediction.profileList = []
      $('#dataTableProfiles').DataTable().destroy();
      $('#dataTableProfiles').DataTable().clear().draw();
      this.service.profileList().subscribe(res => {
        this.prediction.profileList = res;
        setTimeout(() => {
          $('#dataTableProfiles').DataTable(this.opt2)
        }, 20);
      },
      error => {
        console.log(error)
      })
    }
@ViewChild('mySplit') mySplitEl: SplitComponent
  // area size
  _size1=100;
  _size2=0;
get size1() {
  return this._size1;
}

set size1(value) {
    this._size1 = value;
}
get size2() {
  return this._size2;
}

set size2(value) {
    this._size2 = value;
}
gutterClick(e) {
  if(e.gutterNum === 1) {
      if(e.sizes[1] == 100 ) {
        this.size1 = 100;
        this.size2 = 0;
      }
  }
}
getProfileSummary(profile,tr) {
  if(this.prevTR){
    this.prevTR.classList.remove('selected')
    tr.classList.add('selected')
  }
  this.prevTR = tr;
  tr.classList.add('selected')
  this.prediction.profileName = profile[0]

  if(this.size1 == 100){
    this.size1 = 0;
    this.size2 = 100;
  }else{
    this.size1 = 100;
    this.size2 = 0
  }
  this.prediction.date = profile[3];
  $('#container-pred').hide()
  this.prediction.profileSummary = undefined;
  setTimeout(() => {
    this.service.profileSummary(this.prediction.profileName).subscribe(
      (res) => {
        if (res) {
          this.prediction.profileSummary = res;
          this.escaleColor();
          $('#dataTablePrediction').DataTable().destroy();
          $('#dataTablePrediction').DataTable().clear().draw();
          setTimeout(() => {
          $('#dataTablePrediction').DataTable(this.opt)
          this.addStructure();
          }, 20);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  },500)
}
deleteProfile() {
  this.service.deleteProfile(this.prediction.profileName).subscribe(
    result => {
      this.prediction.profileName = undefined ;
      this.prediction.profileSummary = undefined;
      this.prediction.profileItem = undefined;
      this.getProfileList();
    },
    error => {
      alert('Delete ERROR');
    }
  );
}
addStructure(){
  var options = { width: 100, height: 75 }
  const smilesDrawer = new SmilesDrawer.Drawer(options);
  for (let i = 0; i < this.prediction.profileSummary["obj_num"]; i++) {
  let td = document.getElementById("canvas"+i)
  const icanvas = document.createElement('canvas');
  td.appendChild(icanvas)
    SmilesDrawer.parse(
     this.prediction.profileSummary['SMILES'][i],
     function (tree) {
       smilesDrawer.draw(tree, icanvas, 'light', false);
     },
     function (err) {
       console.log(err);
     }
   );
  }
}
  /**
   * modifies the "profileSummary" array to add a new field 
   * where you set the color that belongs to the field
   */
   escaleColor(){
    var chr = chroma.scale('RdBu').domain([3,9]);
    var globalArr = []
    for (let i = 0; i < this.prediction.profileSummary.values.length; i++) {
      var arrValues = []
      for (let y = 0; y < this.prediction.profileSummary.endpoint.length; y++) {
        if(this.prediction.profileSummary.quantitative[y]){
          arrValues[y] = chr(this.prediction.profileSummary.values[i][y])._rgb
        }else {
          arrValues[y] = -1
        }
      }
      globalArr[i] = arrValues
    }
    this.prediction.profileSummary['escaleColor'] = globalArr
  }

  castValue(value:number,column?:number) {
    if(this.prediction.profileSummary['quantitative'][column]) return value.toFixed(1);
    return value == 1 ? 'Positive' : value == 0 ? 'Negative' : 'Uncertain';
  }

}
