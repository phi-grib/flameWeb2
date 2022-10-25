import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-select-compound',
  templateUrl: './select-compound.component.html',
  styleUrls: ['./select-compound.component.css']
})
export class SelectCompoundComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }
  currentTab(event){
    this.commonService.setCurrentCompoundTab(event.target.id)
   }

}
