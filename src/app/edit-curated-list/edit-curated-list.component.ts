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
  spaceBar = "\t";
  tab = "\t";
  SeparatorChoices = { ",": ",", "Espace bar": this.spaceBar , "Tab": this.tab, "/": "/", ".": ".", ":": ":", ";": ";" };


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
           self.model.file_info['columns'] = self.model.file_info['rows'][0].split(self.ObjCuratedList.separator);
           console.log(self.model.file_info['columns']);

    };
           fileReader.readAsText(file);

    // var result = [];
   
    // for (var i = 1; i < this.model.file_info['num_mols'].length; i++) {

    //   var obj = {};
    //   var currentline = lines[i].split(this.ObjCuratedList.separator);

    //   for (var j = 0; j < this.ObjCuratedList.selectedColumns.length; j++) {
    //     obj[this.ObjCuratedList.selectedColumns[j]] = currentline[j];
    //   }

    //   result.push(obj);

    // }
    // console.log(this.ObjCuratedList.selectedColumns);
    // console.log(JSON.stringify(result));
    // return result;
  }


}



