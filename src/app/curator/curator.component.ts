import { Component, OnInit } from '@angular/core';
import { CuratorService } from './curator.service';

@Component({
  selector: 'app-curator',
  templateUrl: './curator.component.html',
  styleUrls: ['./curator.component.css']
})
export class CuratorComponent implements OnInit {

  constructor( service: CuratorService) { }

  ngOnInit(): void {
  }

  uploadSmiles(event){
    const reader = new FileReader;
    if(event.target.files.length !== 1){
      console.error('No file selected');
    }else{
    reader.onloadend = (e) =>{
      result = reader.result.toString;
    }
    reader.readAsText(event.target.files[0]);  
  }
  }

}
