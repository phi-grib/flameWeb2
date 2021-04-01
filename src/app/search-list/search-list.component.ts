import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { Space, Globals } from '../Globals';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})

export class SearchListComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(private func: CommonFunctions,
              public globals: Globals,
              public space: Space) {}

  ngOnInit() {
    this.space.spaceName = undefined;
    this.space.spaceVersion = undefined;
    this.func.getSpaceList();
  }

  selectSearch(spaceName: string, spaceVersion: string) {
    this.space.spaceName = spaceName;
    this.space.spaceVersion = spaceVersion;
  }

}
