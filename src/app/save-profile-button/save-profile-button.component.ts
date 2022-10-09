import { Component, OnInit } from '@angular/core';
import { Model } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
declare var $: any;
@Component({
  selector: 'app-save-profile-button',
  templateUrl: './save-profile-button.component.html',
  styleUrls: ['./save-profile-button.component.css']
})
export class SaveProfileButtonComponent implements OnInit {

  constructor(public model: Model,private service: PredictorService) { }
  endpoints = [];
  versions = [];
  name: string = 'collection';
  isvalidName: boolean = true;

  ngOnInit(): void {
  }
  saveCollection(){
    this.filterModels();
      this.service.collection(this.name,JSON.stringify(this.endpoints),JSON.stringify(this.versions)).subscribe(result =>{
        console.log(result)
      } )
      $('#saveModal').modal('hide')
    }
    collectionNameChange(){
      const letters = /^[A-Za-z0-9_]+$/;
      if (!this.name.match(letters) || this.name == '') {
        this.isvalidName = false;
      }else{
        this.isvalidName  = true;
      }
    }
    filterModels() {
      this.endpoints = [];
      this.versions = [];
      this.model.listModelsSelected.filter((model) =>
        this.endpoints.push(model.name)
      );
      this.model.listModelsSelected.filter((model) =>
        this.versions.push(model.version)
      );
    }

}
