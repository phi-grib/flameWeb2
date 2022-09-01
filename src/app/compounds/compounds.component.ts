import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-compounds',
  templateUrl: './compounds.component.html',
  styleUrls: ['./compounds.component.css']
})
export class CompoundsComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }
  currentTab(event){
    this.commonService.setCurrentCompoundTab(event.target.id)
   }

}
