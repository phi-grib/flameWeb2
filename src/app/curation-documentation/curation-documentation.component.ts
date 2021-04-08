import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Curation } from "../Globals";
import { CommonService } from "../common.service";
import { ToastrService } from "ngx-toastr";
import { CurationDocumentationService } from "./curation-documentation.service";

@Component({
  selector: "app-curation-documentation",
  templateUrl: "./curation-documentation.component.html",
  styleUrls: ["./curation-documentation.component.css"],
})
export class CurationDocumentationComponent implements OnChanges {
  constructor(public curationService: CurationDocumentationService) {}

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

  ngOnChanges(): void {
    //this.getDocumentation();
    this.fakeDataGenerator();
    this.curation.name;
  }

  getDocumentation() {
    this.documentationVisible = false;
    this.curationService.getDocumentation(this.curationName).subscribe(
        result=>{
            if(result[0]){
                this.curationDocumentation = result[1];
            }
        }
    )
  }

  fakeDataGenerator(){
      for(let i=0; i<3;i++){
          this.fakeStats[i].value = this.getRandomInt();
      }
      console.log(this.fakeStats);
      for(let k=0; k<3;k++){
          this.fakefoundSubstances[k].value = this.getRandomInt();
      }
      console.log(this.fakefoundSubstances);
  }

  getRandomInt() {
    return Math.floor(Math.random() * 100);
  }
}
