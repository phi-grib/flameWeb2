import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Model } from '../Globals';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  modeltab = false;

  constructor(private commonService: CommonService,
    public model : Model) { }

  ngOnInit(): void {
  }


  /**
   * Controls which card is deployed to deploy or close the splitter.
   * @param event 
   */
  modelTab(event){
    let value;
    value = event.getAttribute("aria-expanded")
    if(event.id == 'headingCompound'){
      if(value == 'false'){
        this.modeltab = false;
      }
    }
    if(event.id == 'headingModels'){
      if (value == 'false'){
        this.modeltab = true;
      }else{
        this.modeltab = false;
      }
    }
    this.commonService.setStatusModelTab(this.modeltab)
  }

}
