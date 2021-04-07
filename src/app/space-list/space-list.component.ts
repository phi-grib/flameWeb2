import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { Space, Globals } from '../Globals';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-space-list',
  templateUrl: './space-list.component.html',
  styleUrls: ['./space-list.component.css']
})

export class SpaceListComponent implements OnInit {

  // objectKeys = Object.keys;

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
