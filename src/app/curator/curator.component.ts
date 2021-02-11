import { Component, OnInit } from '@angular/core';
import { CuratorService } from './curator.service';

@Component({
  selector: 'app-curator',
  templateUrl: './curator.component.html',
  styleUrls: ['./curator.component.css']
})
export class CuratorComponent implements OnInit {

  constructor(private service: CuratorService) { }

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

}
