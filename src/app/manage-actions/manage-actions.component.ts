import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound, Model } from '../Globals';

@Component({
  selector: 'app-manage-actions',
  templateUrl: './manage-actions.component.html',
  styleUrls: ['./manage-actions.component.css']
})
export class ManageActionsComponent implements OnInit {

  constructor( public model: Model,
    public compound: Compound,
    public commonService: CommonService,) { }

  ngOnInit(): void {
  }

}
