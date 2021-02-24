import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from '../Globals';



@Component({
  selector: 'app-edit-curated-list',
  templateUrl: './edit-curated-list.component.html',
  styleUrls: ['./edit-curated-list.component.css']
})
export class EditCuratedListComponent implements OnInit {

  ObjCuratedList: EditCuratedListComponent;
  ObjActiveModal: NgbActiveModal;
  fileContent: any;
  spaceBar = " ";
  tab = "\t";
  SeparatorChoices = { ",": ",", "Espace bar": this.spaceBar , "Tab": this.tab, "/": "/", ".": ".", ":": ":", ";": ";" };
  file: File;

  //attributes: 
  public listName: string;
  public separator: string;
  public columns: [];
  public selectedColumns: string[]=[];
  public eventFile:  { target: { files: any[]; }; };

  constructor(public activeModal: NgbActiveModal, public model: Model) { }

  ngOnInit(): void {
    this.ObjCuratedList = new EditCuratedListComponent(this.ObjActiveModal, this.model);
    console.log(this.spaceBar);
    console.log(this.tab);
  }

  seeObj() {
    console.log(this.ObjCuratedList);
  }

  onChangeSeparator(selectValue: any) {

    this.ObjCuratedList.separator = selectValue;
  }

  // preloadFileFunction(event: { target: { files: any[]; }; }): void {

  //   this.eventFile= event;
  //   const file = event.target.files[0];
  //   this.model.file = file;
  //   this.model.file_info = {};
  //   this.model.file_info['name'] = file.name;
  //   this.model.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
  //   const extension = file.name.split('.');
  //   this.model.file_info['type_file'] = extension[1];
  //   const fileReader: FileReader = new FileReader();
  //   const self = this;
  //   fileReader.onloadend = function (x) {
  //     self.fileContent = fileReader.result;
  //     self.fileContent.replace("\t", ",");
  //     var reRow = new RegExp("((.*)" + self.ObjCuratedList.separator + "(.*)*$)", "mg");
  //     self.model.file_info['num_mols'] = (self.fileContent.match(reRow) || []).length - 1;
  //     const res_array = self.fileContent.match(/>( )*<(.*)>/g);
  //     var reCol = new RegExp('((.*)' + self.ObjCuratedList.separator + '|(.*)$)')

  //     var colNamesSearch = self.fileContent.match(reCol);
  //     var colNames = colNamesSearch[0].split(',');
  //     colNames = colNames.filter(item => item);
  //     self.ObjCuratedList.columns = colNames;
  //   };
  //   fileReader.readAsText(file);
  // }

  onchangeSelected(selected) {
    console.log(selected);
    this.ObjCuratedList.selectedColumns.push(selected);
  }

  onchangeSelectedAll(selected) {
    console.log(selected);
    this.ObjCuratedList.selectedColumns = selected;
  }

  csvJSON(event) {
    const file = event.target.files[0];
    this.eventFile = file;
    this.file = file;
    this.model.file = file;
    this.model.file_info = {};
    this.model.file_info['name'] = file.name;
    this.model.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
    const extension = file.name.split('.');
    this.model.file_info['type_file'] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;
    fileReader.onloadend = function (x) {
           self.fileContent = fileReader.result;
           self.model.file_info['num_mols'] =self.fileContent.split('\n').length;
           self.model.file_info['rows'] = self.fileContent.split('\n');
           var reCol = new RegExp('.*$', 'm');
           self.model.file_info['columns'] = self.fileContent.match(reCol);
           self.model.file_info['columns'] = self.model.file_info['columns'][0].split(self.ObjCuratedList.separator);
           var colNames = self.model.file_info['columns'].filter(item => item);
           self.ObjCuratedList.columns = colNames;
    };
           fileReader.readAsText(file);
  }

  createJSONstring(){
    var lines = this.fileContent.split('\n');

    var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step 
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        console.log(obj);
        result.push(obj);

  }
  console.log(JSON.stringify(result));
  return JSON.stringify(result); //JSON
}


}



