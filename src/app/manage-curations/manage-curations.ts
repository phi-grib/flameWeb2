import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
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
export class ManageCurationsComponent implements OnInit {
  objectKeys = Object.keys;
  curationName: string;
  fileRegex = new RegExp('.*\..*');



  constructor(
    private commonService: CommonService,
    private modalService: NgbModal,
    public curatorService: ManageCurationsService,
    private toastr: ToastrService,
    public globals: Globals,
    public curation: Curation,
    public func: CommonFunctions
  ) {}

  ngOnInit(): void {
    this.func.getCurationsList();
  }

  curationSettings() {
    const modalRef = this.modalService.open( CuratorComponent, {windowClass: 'customWindow'});
  }

  createCuration() {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth();
    let yyyy = date.getFullYear();
    this.curation.date = dd + "-" + mm + "-" + yyyy;
    this.curatorService
      .createEndpoint(this.curation.name)
      .subscribe((result) => {
        if (result[0]) {
          $("#dataTableCurations").DataTable().destroy();
          
          this.toastr.success(
            "Curation " + this.curationName,
            "CURATION CREATED",
            {
              timeOut: 5000,
              positionClass: "toast-top-right",
            }
          );
        } else {
          this.toastr.error(
            "Curation " + this.curation.name,
            "ALREADY EXISTS",
            {
              timeOut: 5000,
              positionClass: "toast-top-right",
            }
          );
        }
        this.func.getCurationsList();
      });
  }

  deleteEndpoint(name) {
    this.curatorService.deleteEndpoint(name).subscribe( (
        result) => {
        this.toastr.success(
          "Curation " + this.curation.name,
          "CURATION DELETED",
          {
            timeOut: 5000,
            positionClass: "toast-top-right",
          }
        );
        $("#dataTableCurations").DataTable().destroy();
        this.func.getCurationsList();
      });
  }
}
