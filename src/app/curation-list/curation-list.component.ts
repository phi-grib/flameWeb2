import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Curation, Globals }  from '../Globals';
import { ManageCurationsService } from '../manage-curations/manage-curations.service';


@Component({
  selector: 'app-curation-list',
  templateUrl: './curation-list.component.html',
  styleUrls: ['./curation-list.component.css']
})
export class CurationListComponent implements OnInit {

    objectKeys = Object.keys;
    curationName: string;

  constructor( private commonService: CommonService,
    public curatorService: ManageCurationsService,
    public globals: Globals,
    public curation: Curation,
    public func: CommonFunctions) { }

  selectCuration (item) {
    this.func.selectCuration(item['curation_endpoint'])
  }

  ngOnInit(): void {
    this.func.getCurationsList();
  }

}
