import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Curation } from "../Globals";
import { CommonService } from "../common.service";
import { ToastrService } from "ngx-toastr";
import { CurationDocumentationService } from "./curation-documentation.service";
import { CommonFunctions } from '../common.functions';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';


@Component({
  selector: "app-curation-documentation",
  templateUrl: "./curation-documentation.component.html",
  styleUrls: ["./curation-documentation.component.css"],
})
export class CurationDocumentationComponent implements OnChanges {
  constructor(public curationService: CurationDocumentationService, 
    public func: CommonFunctions) {}

    @Input() curationName;


  // materialModules = [MatIconModule];
  curationDocumentation = undefined;
  downloadLink = undefined;
  fileToUpload: File = null;
  public documentationVisible = false;
  objectKeys = Object.keys;

  //fake data for testing purposes
  curation: Curation;
  fakesubsArray = ['organic', 'organic_salt','organometallic',
'peptide','inorganic', 'inorganic_metal','inorganic_salt','no_sanitizable',
'no_sanitizable_organic','no_sanitizable_inorganic','no_sanitizable_organometallic'];
  fakeStats = {total_curated: "", total_input: "", non_curated: ""};
  fakefoundSubstances = {organic: "", organometallic:"", no_sanitizable: ""};

  plotPie = {
    data:  [{
          values: [],
          labels: ['organic', 'organometallic', 'no_sanitizable'],
          textinfo: "label",
          marker: { colors: ["lightblue", "blue"] },
          type: 'pie'
    }],
    layout: {
          width: 300,
          height: 200,
          showlegend: true,
          margin: { r: 30, t: 30, b: 10, l: 30, pad: 0 },
    },
    config: {
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
    }
  }


  plotSummary = {
    data:  [{
          x: ['Curated', 'Not curated'],
          y: [],
          name:'Curation results',
          type: 'bar',
          texttemplate: "%{y:.2f}",
          textposition: 'auto',
          textfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
          marker: {
            color: 'rgba(70,143,184,0.8)',
          }
        }],
    layout: {
          yaxis: {
            range: [0,100],
            // titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
          },
          xaxis: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 },
          },
          width: 400,
          height: 300,
          showlegend: true,
          barmode: 'group'
    },
    config: {
      // displaylogo: false,
      displayModeBar: false
      // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']    
    }
  }




  ngOnChanges(): void {
    
    this.fakeDataGenerator();
    console.log(this.curationName);
    console.log(this.fakeStats);
    console.log(this.fakefoundSubstances);
    console.log(this.fakefoundSubstances['organic']);
    this.plotPie.data[0].values = [this.fakefoundSubstances['organic'], this.fakefoundSubstances['organometallic'], this.fakefoundSubstances['no_sanitizable']];
    this.plotSummary.data[0].y = [this.fakeStats['total_curated'], this.fakeStats['non_curated']];
  }

  getDocumentation() {
    // this.documentationVisible = false;
    // this.curationService.getDocumentation(this.curationName).subscribe(
    //     result=>{
    //         if(result[0]){
    //             this.curationDocumentation = result[1];
    //         }
    //     }
    // )
    this.fakeDataGenerator();
  }
  //fake data with testing purposes
  fakeDataGenerator(){
    console.log('callback');

     this.fakeStats['total_curated'] = this.getRandomInt().toString();
     this.fakeStats['total_input'] = this.getRandomInt().toString();
     this.fakeStats['non_curated'] = this.getRandomInt().toString();
     this.fakefoundSubstances['organic'] = this.getRandomInt().toString();
     this.fakefoundSubstances['organometallic'] = this.getRandomInt().toString();
     this.fakefoundSubstances['no_sanitizable'] = this.getRandomInt().toString();
  }

  getRandomInt() {
      let num : number;
      num = Math.floor(Math.random() * 100);
      console.log(num);
    return num;
  }
}
