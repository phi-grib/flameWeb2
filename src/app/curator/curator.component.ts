import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditCuratedListComponent } from "../edit-curated-list/edit-curated-list.component";
import { CuratorService } from "./curator.service";
import { Curation, Globals } from "../Globals";
import { CommonFunctions } from "../common.functions";
import { ToastrService } from "ngx-toastr";

// import { timeStamp } from "console";
declare var $: any;

@Component({
  selector: "app-curator",
  templateUrl: "./curator.component.html",
  styleUrls: ["./curator.component.css"],
})
export class CuratorComponent implements OnInit {
  objectKeys = Object.keys;
  curationName: string;
  fileRegex = new RegExp('.*\..*');



  constructor(
    private commonService: CommonService,
    private modalCuratorService: NgbModal,
    public curatorService: CuratorService,
    private toastr: ToastrService,
    public globals: Globals,
    public curation: Curation,
    public func: CommonFunctions
  ) {}

  ngOnInit(): void {
    this.func.getCurationsList();
  }

  curationSettings() {
    const modalRef = this.modalCuratorService.open(EditCuratedListComponent, {
      windowClass: "modalClass",
    });
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
          this.func.getCurationsList();
          this.toastr.success(
            "Curation " + this.curation.name,
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
      });
  }

  deleteEndpoint(name: string) {
    this.curatorService.deleteEndpoint(name).subscribe((result) => {
      if (result[0]) {
        $("#dataTableCurations").DataTable().destroy();
        this.func.getCurationsList();
        this.toastr.success(
          "Curation " + this.curation.name,
          "CURATION DELETED",
          {
            timeOut: 5000,
            positionClass: "toast-top-right",
          }
        );
      } else {
        this.toastr.error(
          "Curation " + this.curation.name,
          "ERROR: COULD'T DELETE",
          {
            timeOut: 5000,
            positionClass: "toast-top-right",
          }
        );
      }
    });
  }
}
