//author: Rodrigo Lorenzo Lorenzo 12-03-2021
import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CuratorComponent } from "../curator-component/curator-component";
import { ManageCurationsService } from "./manage-curations.service";
import { Curation, Globals } from "../Globals";
import { CommonFunctions } from "../common.functions";
import { ToastrService } from "ngx-toastr";

// import { timeStamp } from "console";
declare var $: any;

@Component({
  selector: "app-manage-curations",
  templateUrl: "./manage-curations.html",
  styleUrls: ["./manage-curations.css"],
})
export class ManageCurationsComponent {

  objectKeys = Object.keys;
  curationName: string;

  constructor(
    private modalService: NgbModal,
    public curatorService: ManageCurationsService,
    private toastr: ToastrService,
    public globals: Globals,
    public curation: Curation,
    public func: CommonFunctions
  ) {}


  //opens curator-component window
  curationSettings() {
    const modalRef = this.modalService.open( CuratorComponent,  { size: 'lg'});
  }

  //creates a new endpoint through this component's service
  createCuration() {
    this.curatorService.createEndpoint(this.curationName).subscribe((result) => {
        if (result[0]) {      
          
          this.toastr.success("Curation " + this.curationName, "CURATION CREATED", {
            timeOut: 4000, positionClass: "toast-top-right",progressBar: true
          });
          
          $("#dataTableCurations").DataTable().destroy();
          this.curation.name = this.curationName;
          this.func.getCurationsList();

        } else {
          this.toastr.error("Curation " + this.curationName, "ALREADY EXISTS",{
            timeOut: 4000, positionClass: "toast-top-right",progressBar: true
          });
        }
      });
  }

  //deletes a new endpoint through this component's service
  deleteEndpoint() {
    this.curationName = this.curation.name;
    this.curatorService.deleteEndpoint(this.curationName).subscribe( 
        (result) => {

          this.toastr.success("Curation " + this.curationName,"CURATION DELETED", {
            timeOut: 4000, positionClass: "toast-top-right", progressBar: true
          });

          $("#dataTableCurations").DataTable().destroy();
          this.func.getCurationsList();
          
        });
  }
}
