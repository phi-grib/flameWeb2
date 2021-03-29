import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditCuratedListComponent } from "../edit-curated-list/edit-curated-list.component";
import { CuratorService } from './curator.service';
import { Curation, Globals } from "../Globals";
import { CommonFunctions } from '../common.functions';
// import { timeStamp } from "console";

@Component({
  selector: "app-curator",
  templateUrl: "./curator.component.html",
  styleUrls: ["./curator.component.css"],
})
export class CuratorComponent implements OnInit {

    objectKeys = Object.keys;

  constructor(
    private commonService: CommonService,
    private modalCuratorService: NgbModal,
    private curatorservice: CuratorService,
    public globals: Globals,
    public curation: Curation,
    public commonFunctions:CommonFunctions
  ) {}

  ngOnInit(): void {
    this.commonFunctions.getCurationsList();
  }

  curationSettings() {
    const modalRef = this.modalCuratorService.open(EditCuratedListComponent, {
      windowClass: "modalClass",
    });
  }

  selectCuration(name: string, date: string): Curation{
      this.curation.name = name;
      this.curation.date = date;
      console.log(this.curation);

      return this.curation;
  }
}
