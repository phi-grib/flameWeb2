import { Component, OnInit } from '@angular/core';
import { CuratorService } from './curator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCuratedListComponent } from '../edit-curated-list/edit-curated-list.component';


@Component({
  selector: 'app-curator',
  templateUrl: './curator.component.html',
  styleUrls: ['./curator.component.css']
})
export class CuratorComponent implements OnInit {

  //attributes: 

  constructor(private service: CuratorService,
              private modalCuratorService: NgbModal) { }

  formdata = new FormData();
  colName : string = '';
  
  ngOnInit(): void {
  }

  uploadSmiles(event){
    const reader = new FileReader;
    if(event.target.files.length !== 1){
      console.error('No file selected');
    }else{
    reader.onloadend = (e) =>{
      this.formdata.append = reader.result.toString;
      this.service.SmilesCurator(this.formdata).subscribe()
    }
    reader.readAsText(event.target.files[0]);  
  }
  }

  curationSettings() {
    const modalRef = this.modalCuratorService.open(EditCuratedListComponent, { windowClass : 'modalClass'});
  }

}
