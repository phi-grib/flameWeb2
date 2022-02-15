import { Component, OnInit } from "@angular/core";
import { Model } from "../Globals";
import { LabelerService } from "../labeler/labeler.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../common.service";
import * as SmilesDrawer from 'smiles-drawer';
import { VerificatorService } from "./verificator.service";
@Component({
  selector: "app-verificator",
  templateUrl: "./verificator.component.html",
  styleUrls: ["./verificator.component.css"],
})
export class VerificatorComponent implements OnInit {
  constructor(
    public model: Model,
    public service: LabelerService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private verificatorService: VerificatorService

  ) {}
  objectKeys = Object.keys;
  data: any = "";
  verificatorname: string;
  datachekinglevel = "";
  key = '';
  detailMessage = '';
  verificationVisible = true;

  detailsInfo = {'documentation':{'Passed':'TO DO','Failed':'The following fields must be filled in:'},'data':{'Passed':'','Failed':''},'prediction':{'Passed':'','Failed':''},'model':{'Passed':'','Failed':''}}

  getVerification(): void {
    this.commonService.getVerification(this.model.name,this.model.version).subscribe(
      (result) => {
        this.data = result;
      },
      (error) => {
        alert(error);
      }
    );
  }
  ngOnInit(): void {
      this.getVerification();
      
  }
  cancelInput(): void {
    this.activeModal.close("Close click");
  }

  //TO DO
  Sign(): void {
    
  }

  // verificationname: string,verificatorname: string
  // TO DO
  Report(verificationname: string): void{
    
    verificationname = verificationname+"_verification";//generate fake verification name.
    this.verificatorname = "Adrian_Cabrera";
    this.verificatorService.generateReport(verificationname,this.verificatorname).subscribe(
      result => {
        console.log(result)
      },
      error => {
        console.log(error);
      }
    )
    this.toastr.success(
      "Model " + this.model.name,
      "REPORTED SUCCESSFULLY",
      {
        timeOut: 4000,
        positionClass: "toast-top-right",
        progressBar: true,
      }
    );
    
  }

  verifyModel(modelname : string, version: number): void {
  this.verificationVisible = false;
  this.verificatorService.generateVerification(modelname,version).subscribe(
    result => {
      this.toastr.success(
        "Model " + this.model.name,
        "VERIFICATED SUCCESSFULLY",
        {
          timeOut: 4000,
          positionClass: "toast-top-right",
          progressBar: true,
    });
    this.data = result;
    this.verificationVisible = true;
  },
  error => {
    console.log(error);
  }); 
  }

  /**
   * provides extra information to the user if needed
   * @param key 
   */
  details(key: string): void {

    this.datachekinglevel = (key != 'model') ? this.data[1]['Data cheking'][key]: this.data[1]['Model testing'][key];
    this.key = key;
    // extra information to user in the GUI
    this.detailMessage = this.detailsInfo[key][this.datachekinglevel['status']]
  }

  /**
   * Receives the SMILES and converts it to 2d structure
   * @param smiles 
   * @param canvasID 
   */
  draw2dStructure(smiles,canvasID){
    
    const options = {'width': 340, 'height': 175};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(smiles, function(tree) {

      smilesDrawer.draw(tree,canvasID, 'light', false);
  });
  }
}
