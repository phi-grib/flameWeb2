import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Model } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
declare var $: any;

@Component({
  selector: 'app-load-profile-button',
  templateUrl: './load-profile-button.component.html',
  styleUrls: ['./load-profile-button.component.css']
})
export class LoadProfileButtonComponent implements OnInit {
  collections = undefined;
  collectionSelected: Object = undefined;
  prevTR = undefined;
  objectKeys = Object.keys;
  opt = {
    autoWidth: true,
    destroy: true,
    paging: true,
    ordering: true,
    searching: true,
    info: true,
  }

  constructor(
    private service: PredictorService, private commonService : CommonService, public model: Model
  ) { }

  ngOnInit(): void {
  }

  openModal(){
    this.collectionSelected = undefined;
    $('#dataTableCollections').DataTable().destroy();
    // $('#dataTableCollections').DataTable().clear().draw();
    this.service.getCollections().subscribe(result => {
      console.log(result)
      this.collections = result
      setTimeout(() => {
        $('#dataTableCollections').DataTable(this.opt)
      },20)
    })
  }
  loadCollection(tr,collection){
    console.log(collection)
    if(this.prevTR){
      this.prevTR.classList.remove('selected')
      tr.classList.add('selected')
    }
    this.prevTR = tr;
    tr.classList.add('selected')
    this.collectionSelected = collection;

  }
  confirmLoad(){
    this.commonService.setCollection(this.collectionSelected)
    $('#loadModal').modal('hide')
  }

  deleteCollection(){
    this.service.deleteCollection(this.collectionSelected['name']).subscribe(result => {
      console.log(result)
      this.openModal();
    },error => {
      console.log(error)
    })
  }

}
