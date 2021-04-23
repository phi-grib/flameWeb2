import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Model, Curation } from "../Globals";
import { EditCuratedListService } from "../edit-curated-list/edit-curated-list.service";
import { CommonService } from "../common.service";
import { CuratorService } from "../curator/curator.service";
import { CommonFunctions } from "../common.functions";
import { ToastrService } from "ngx-toastr";

declare var $: any;


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
  file= undefined;
  finalDict: {};
  objectArray: [];
  style: string = "mat-column-col";
  curation: Curation;
  cas: string;
  smiles:string;
  objectKeys = Object.keys;
  dropDownSettings: {
      openclass: "multiselect";
  }
  
  //attributes:
  public listName: string;
  public separator: string;
  public columns: [];
  public selectedColumns: string[] = [];
  public remove_problem: boolean= false;
  public output_format: string;


  constructor(
    public editService: EditCuratedListService,
    public activeModal: NgbActiveModal,
    public model: Model,
    private toastr: ToastrService,
    public commonService: CommonService,
    public curatorservice: CuratorService,
    public func: CommonFunctions,
  ) {}

  ngOnInit(): void {
    this.curation = new Curation();
    this.ObjCuratedList = new EditCuratedListComponent(
      this.editService,
      this.ObjActiveModal,
      this.model,
      this.toastr,
      this.commonService,
      this.curatorservice,
      this.func,
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

  curate(name: string){
      this.curation.name = this.func.curation.name;
      console.log(this.ObjCuratedList.selectedColumns);
      let regExp = new RegExp('cas', 'i');
      for(let i=0;i<this.ObjCuratedList.selectedColumns.length;i++){
          if(this.ObjCuratedList.selectedColumns[i].match(regExp) || 
          this.ObjCuratedList.selectedColumns[i].includes('molecule') || 
          this.ObjCuratedList.selectedColumns[i].includes('identifier')){
              this.cas = this.ObjCuratedList.selectedColumns[i];
          } 
      }

      for(let i=0;i<this.ObjCuratedList.selectedColumns.length;i++){
        if(this.ObjCuratedList.selectedColumns[i].includes('struct') || 
        this.ObjCuratedList.selectedColumns[i].includes('smile')){
            this.smiles = this.ObjCuratedList.selectedColumns[i];
        }  
    }
    let remove = '';
    if(this.ObjCuratedList.remove_problem==true){
        remove = 'True';
    }else{
        remove = 'False';
    }
    const inserted = this.toastr.info('Running!', 'Curation ' + this.curation.name , {
        disableTimeOut: true, positionClass: 'toast-top-right'});
    this.editService.curateList(name, this.file, 
    this.cas, this.smiles, this.ObjCuratedList.separator,remove,
    this.ObjCuratedList.output_format).subscribe(
        result=>{
            let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 100) {
              this.checkCuration(this.curation.name, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Curation ' + this.curation.name + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
              $('#dataTableCurations').DataTable().destroy();
              this.func.getCurationsList();
            }
            iter += 1;
          }, 100);
        },
        error => {
          this.toastr.clear(inserted.toastId);
          $('#dataTableCurations').DataTable().destroy();
          this.func.getCurationsList();
          alert('Error processing input molecule: '+error.error.error);
        }
      );
    

            
    this.activeModal.close('Close click');
    }

  checkCuration(name, inserted, intervalId){
    this.commonService.getCurationDocumentation(name).subscribe(
        result => {
          // console.log(result);
          this.toastr.clear(inserted.toastId);
          if (result['error']){
            this.toastr.warning('Curation ' + name + ' finished with error ' + result['error'] , 'CURATION COMPLETED', {
              timeOut: 5000, positionClass: 'toast-top-right'});
              
          }
          else {
             this.toastr.success('Curation ' + name + ' created' , 'CURATION COMPLETED', {
              timeOut: 5000, positionClass: 'toast-top-right'});
          }
          clearInterval(intervalId);
          $('#dataTableCurations').DataTable().destroy();
          this.func.getCurationsList();
        },
        error => { // CHECK MAX iterations
          if (error.error.code !== 0) {
            this.toastr.clear(inserted.toastId);
            this.toastr.error('Curation ' + name + ' \n '  + error.error.message , 'ERROR!', {
              timeOut: 10000, positionClass: 'toast-top-right'});
            clearInterval(intervalId);
            $('#dataTableCurations').DataTable().destroy();
            this.func.getCurationsList();
          }
        }
      );
    }
  }

