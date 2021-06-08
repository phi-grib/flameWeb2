import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Model, Curation } from "../Globals";
import { CuratorComponentService } from "./curator-component.service";
import { CommonService } from "../common.service";
import { ManageCurationsService } from "../manage-curations/manage-curations.service";
import { CommonFunctions } from "../common.functions";
import { ToastrService } from "ngx-toastr";
import { IDropdownSettings } from "ng-multiselect-dropdown";

declare var $: any;

@Component({
  selector: "app-curator-component",
  templateUrl: "./curator-component.html",
  styleUrls: ["./curator-component.css"],
})
export class CuratorComponent implements OnInit {
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
  file = undefined;
  finalDict: {};
  objectArray: [];
  style: string = "mat-column-col";
  cas: string;
  smiles: string;
  objectKeys = Object.keys;
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: "item_id",
    textField: "value",
    disabledField: "disabled",
    itemsShowLimit: 7,
    enableCheckAll: false,
    allowSearchFilter: false,
    closeDropDownOnSelection: true,
  };
  dropdownSettings2: IDropdownSettings = {
    singleSelection: false,
    idField: "item_id",
    textField: "value",
    disabledField: "disabled",
    itemsShowLimit: 7,
    enableCheckAll: false,
    allowSearchFilter: false,
    closeDropDownOnSelection: false,
  };
  molIndex = 0;

  constructor(
    public curService: CuratorComponentService,
    public activeModal: NgbActiveModal,
    public model: Model,
    private toastr: ToastrService,
    public commonService: CommonService,
    public curation: Curation,
    public curatorservice: ManageCurationsService,
    public func: CommonFunctions
  ) {}

  ngOnInit(): void {
    this.func.getCurationParams(this.curation.name);
  }

  onChangeSeparator(selectValue: any) {
    this.curation.separator = selectValue;
  }

  // onchangeSelected(selected) {
  //   this.curation.selectedColumns.push(selected);
  // }

  onchangeSelected(selected) {
      let value = selected.value
    this.curation.selectedColumns.push(value);
  }

  onchangeColumns(item) {
    this.curation.selectedColumns.push(item);
  }

  public csvJSON(fileList: FileList) {
    const file = fileList[0];
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
      ][0].split(self.curation.separator);

      var colNames = self.model.file_info["columns"].filter((item) => item);
      self.curation.columns = colNames;
      console.log(self.fileContent);
    };
    fileReader.readAsText(file);
  }
  //based on the selectedColumns, no matter the order of selection, returns
  createJSONstring(): any {
    var cleaning = this.fileContent.replace("\r", "");
    var lines = cleaning.split("\n").filter((item) => item);
    var headers = lines[0]
      .split(this.curation.separator)
      .filter((item) => item);
    let filtered = [];
    let temp = [];
    for (let k = 1; k < 5; k++) {
      temp = lines[k].split(this.curation.separator);
      filtered.push(temp.filter((item) => item));
    }
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

  curate(name: string) {
    let met = [];
    if (this.curation.metadata != undefined) {
      for (let item of this.curation.metadata) {
        met.push(item.value);
      }
    }
    let remove = "";
    if (this.curation.remove == true) {
      remove = "True";
    } else {
      remove = "False";
    }
    const inserted = this.toastr.info(
      "Running!",
      "Curation " + this.curation.name,
      {
        disableTimeOut: true,
        positionClass: "toast-top-right",
      }
    );
    console.log(
      name,
      this.file,
      this.curation.casCol[0].value,
      this.curation.smilesCol[0],
      this.curation.separator,
      remove,
      this.curation.output_format,
      this.curation.metadata
    );
    this.curService
      .curateList(
        name,
        this.file,
        this.curation.casCol[0].value,
        this.curation.smilesCol[0],
        this.curation.separator,
        remove,
        this.curation.output_format,
        met
      )
      .subscribe(
        (result) => {
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 100) {
              this.checkCuration(this.curation.name, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning(
                "Curation " + this.curation.name + " \n Time Out",
                "Warning",
                {
                  timeOut: 10000,
                  positionClass: "toast-top-right",
                }
              );
              $("#dataTableCurations").DataTable().destroy();
              this.func.getCurationsList();
            }
            iter += 1;
          }, 200);
        },
        (error) => {
          this.toastr.clear(inserted.toastId);
          $("#dataTableCurations").DataTable().destroy();
          this.func.getCurationsList();
          alert("Error processing input molecule: " + error.error.error);
        }
      );

    this.activeModal.close("Close click");
  }

  checkCuration(name, inserted, intervalId) {
    this.commonService.getCurationStatistics(this.curation.name).subscribe(
      (result) => {
        // console.log(result);
        this.toastr.clear(inserted.toastId);
        if (result["error"]) {
          this.toastr.warning(
            "Curation " +
              this.curation.name +
              " finished with error " +
              result["error"],
            "CURATION COMPLETED",
            {
              timeOut: 5000,
              positionClass: "toast-top-right",
            }
          );
        } else {
          this.toastr.success(
            "Curation " + this.curation.name + " created",
            "CURATION COMPLETED",
            {
              timeOut: 5000,
              positionClass: "toast-top-right",
            }
          );
        }
        clearInterval(intervalId);
        $("#dataTableCurations").DataTable().destroy();
        this.func.getCurationsList();
      },
      (error) => {
        // CHECK MAX iterations
        if (error.error.code !== 0) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error(
            "Curation " + this.curation.name + " \n " + error.error.message,
            "ERROR!",
            {
              timeOut: 10000,
              positionClass: "toast-top-right",
            }
          );
          clearInterval(intervalId);
          $("#dataTableCurations").DataTable().destroy();
          this.func.getCurationsList();
        }
      }
    );
  }

  getData() {
    this.curation.multicolumns = this.curation.columns.map(
      (str, index, boolean) => ({
        value: str,
        item_id: index + 1,
        disabled: false,
      })
    );
    for (let item of this.curation.multicolumns) {
      if (this.curation.smilesCol !== undefined) {
        if (item.value == this.curation.smilesCol) {
          item.disabled = true;
        }
      }
    }
    if (this.curation.casCol !== undefined) {
      for (let item of this.curation.multicolumns) {
        if (item.value == this.curation.casCol[0].value) {
          item.disabled = true;
        }
      }
    }
    return this.curation.multicolumns;
  }
}
