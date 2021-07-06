import { Component, OnInit } from "@angular/core";
import { Model } from "../Globals";
import { LabelerService } from "../labeler/labeler.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../common.service";
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

  verificationFromApi: any;
  verificatorname: string;

  ngOnInit(): void {
      this.getVerification();
  }

  getVerification(): void {
    this.commonService.getVerification(this.model.name).subscribe(
      (result) => {
        this.verificationFromApi = result;
      },
      (error) => {
        alert(error);
      }
    );
  }

  cancelInput(): void {
    this.activeModal.close("Close click");
  }

  Sign(): void {
    //TODOOO

  }

  // verificationname: string,verificatorname: string
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

  verifyModel(modelname : string): void {

  this.verificatorService.generateVerification(modelname).subscribe(
    result => {
      this.verificationFromApi = result;
    },
    error => {
      console.log(error)
    }

  )   
    this.toastr.success(
      "Model " + this.model.name,
      "VERIFICATED SUCCESSFULLY",
      {
        timeOut: 4000,
        positionClass: "toast-top-right",
        progressBar: true,
      }
    );
  }
}
