import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Model, Curation } from "../Globals";
import { EditCuratedListService } from "../edit-curated-list/edit-curated-list.service";
import { CommonService } from "../common.service";
import { CuratorService } from "../curator/curator.service";
import { CommonFunctions } from "../common.functions";

@Component({
  selector: "app-edit-curated-list",
  templateUrl: "./edit-curated-list.component.html",
  styleUrls: ["./edit-curated-list.component.css"],
})
export class EditCuratedListComponent implements OnInit {
  ObjCuratedList: EditCuratedListComponent;
  ObjActiveModal: NgbActiveModal;
  fileContent: any;
  spaceBar = " ";
  tab = "\t";
  SeparatorChoices = {
    ",": ",",
    "Space bar": this.spaceBar,
    Tab: this.tab,
    "/": "/",
    ".": ".",
    ":": ":",
    ";": ";",
  };
  file: File;
  finalDict: {};
  objectArray: [];
  style: string = "mat-column-col";
  curation: Curation;
  objectKeys = Object.keys;

  //attributes:
  public listName: string;
  public separator: string;
  public columns: [];
  public selectedColumns: string[] = [];
  public eventFile: { target: { files: any[] } };

  constructor(
    public editService: EditCuratedListService,
    public activeModal: NgbActiveModal,
    public model: Model,
    public commonService: CommonService,
    public curatorservice: CuratorService,
    public func: CommonFunctions
  ) {}

  ngOnInit(): void {
    this.ObjCuratedList = new EditCuratedListComponent(
      this.editService,
      this.ObjActiveModal,
      this.model,
      this.commonService,
      this.curatorservice,
      this.func
    );
  }

  seeObj() {
    console.log(this.ObjCuratedList);
  }

  onChangeSeparator(selectValue: any) {
    this.ObjCuratedList.separator = selectValue;
  }

  onchangeSelected(selected) {
    this.ObjCuratedList.selectedColumns.push(selected);
  }

  onchangeSelectedAll(selected) {
    this.ObjCuratedList.selectedColumns = selected;
  }

  csvJSON(event) {
    const file = event.target.files[0];
    this.eventFile = file;
    this.file = file;
    this.model.file = file;
    this.model.file_info = {};
    this.model.file_info["name"] = file.name;
    this.model.file_info["size_M"] = (file.size / 1024 / 1024).toFixed(2);
    const extension = file.name.split(".");
    this.model.file_info["type_file"] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;
    fileReader.onloadend = function (x) {
      self.fileContent = fileReader.result;
      self.model.file_info["num_mols"] = self.fileContent.split("\n").length;
      self.model.file_info["rows"] = self.fileContent.split("\n");
      var reCol = new RegExp(".*$", "m");
      self.model.file_info["columns"] = self.fileContent.match(reCol);
      self.model.file_info["columns"] = self.model.file_info[
        "columns"
      ][0].split(self.ObjCuratedList.separator);
      var colNames = self.model.file_info["columns"].filter((item) => item);
      self.ObjCuratedList.columns = colNames;
    };
    fileReader.readAsText(file);
  }
  //based on the selectedColumns, no matter the order of selection, returns
  createJSONstring(): any {
    var cleaning = this.fileContent.replace("\r", "");
    var lines = cleaning.split("\n").filter((item) => item);
    var headers = lines[0]
      .split(this.ObjCuratedList.separator)
      .filter((item) => item);
    let filtered = [];
    let temp = [];
    for (let k = 1; k < lines.length - 1; k++) {
      temp = lines[k].split(this.ObjCuratedList.separator);
      filtered.push(temp.filter((item) => item));
    }
    let result = [];
    var objectArray = [];

    filtered.forEach((r) => {
      let obj = {};
      r.forEach((r, i) => {
        obj[headers[i]] = r;
      });
      objectArray.push(obj);
    });
    this.finalDict = objectArray;    
  }

  submitList(name: string){
    this.editService.curateList(name).subscribe(
        result=>{
            if(result[0]){
                this.func.getCurationsList();

            }
        }
    )  
  }
}
