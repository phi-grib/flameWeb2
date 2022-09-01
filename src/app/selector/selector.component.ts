import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  modeltab = false;
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }
  modelTab(event){
    let value;
    value = event.getAttribute("aria-expanded")
    if(event.id == 'headingCompound'){
      if(value == 'false'){
        this.modeltab = false;
      }
    }
    if(event.id == 'headingModels'){
      console.log(value)
      if (value == 'false'){
        this.modeltab = true;
      }else{
        this.modeltab = false;
      }
    }
    this.commonService.setStatusModelTab(this.modeltab)
  }

}
