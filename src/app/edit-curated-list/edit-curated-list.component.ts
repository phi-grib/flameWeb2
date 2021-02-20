import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel }  from '@angular/forms';
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
  SeparatorChoices={",":",", "Espace bar": " ", "Tab":"  ", "/": "/", ".": ".", ":": ":", ";": ";"};
  fileContent: any;

  //attributes: 
  public listName: string;
  public smilesCol: string;
  public separator: string;
  public casCol: string;
  public substanceName: string;
  public fileList: File;

  constructor(public activeModal: NgbActiveModal, public model: Model) { }

  ngOnInit(): void {
    this.ObjCuratedList = new EditCuratedListComponent(this.ObjActiveModal, this.model)
  }

  createObjCuratedList(){
    console.log(this.ObjCuratedList);
  }

  onChangeSeparator(selectValue: any){

    this.ObjCuratedList.separator = selectValue;
  }

  preloadFileFunction(event): void {
    const file = event.target.files[0];
    this.model.file = file;
    this.model.file_info = {};
    this.model.file_info['name'] = file.name;
    this.model.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
    const extension = file.name.split('.');
    this.model.file_info['type_file'] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;
    fileReader.onloadend = function(x) {
      self.fileContent = fileReader.result;
      var re = new RegExp("((.*)"+self.ObjCuratedList.separator+"(.*)*$)","mg"); 
      self.model.file_info['num_mols'] = (self.fileContent.match(re) || []).length -1;
      const res_array = self.fileContent.match(/>( )*<(.*)>/g);
      const res_dict = {};
      for (const variable of res_array) {
        const value = variable.replace(/[<> ]*/g, '');
        if (value in res_dict) {
          res_dict[value] = res_dict[value] + 1;
        }
        else {
          res_dict[value] = 1;
        }
      }
      self.model.file_fields = res_dict;
    };
    fileReader.readAsText(file);
  }
}


