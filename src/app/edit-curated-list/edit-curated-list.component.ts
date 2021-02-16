import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel }  from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-edit-curated-list',
  templateUrl: './edit-curated-list.component.html',
  styleUrls: ['./edit-curated-list.component.css']
})
export class EditCuratedListComponent implements OnInit {

  //attributes: 
  private listName: string;
  private smilesCol: string;
  private separator: string;
  private casCol: string;
  private substanceName: string;
  private fileList: File;

  constructor(public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
  }

}
