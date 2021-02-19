import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel }  from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-edit-curated-list',
  templateUrl: './edit-curated-list.component.html',
  styleUrls: ['./edit-curated-list.component.css']
})
export class EditCuratedListComponent implements OnInit {

  ObjCuratedList: EditCuratedListComponent;
  ObjActiveModal: NgbActiveModal;
  SeparatorChoices=[",", " ", ";", "  ", "/", "."];

  //attributes: 
  public listName: string;
  public smilesCol: string;
  public separator: string;
  public casCol: string;
  public substanceName: string;
  public fileList: File;

  constructor(public activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.ObjCuratedList = new EditCuratedListComponent(this.ObjActiveModal)
  }

  createObjCuratedList(){
    console.log(this.ObjCuratedList);
  }

  onChangeSeparator(selectValue: any){
    let separatorValue = "";
    for(let item in this.SeparatorChoices){
      if(item = selectValue){
        separatorValue = item;
      }
    }
    this.ObjCuratedList.separator = separatorValue;
  }

}
