import { Component, OnInit, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { CommonService } from '../common.service';
import { Globals, Prediction, Profile } from '../Globals';
import { ProfilingService } from '../profiling.service';
declare var $: any;
@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  prevTR = undefined;
  prevTH = undefined;
  opt2 = {
    autoWidth: true,
    destroy: true,
    paging: true,
    ordering: true,
    searching: true,
    order: [[1,'desc']],
    info: true,
  }
  constructor(public profile: Profile,
    private prediction: Prediction,
    private global: Globals,
    private profiling: ProfilingService,
    private commonService:CommonService) { }

  ngOnInit() {
    this.getProfileList();
    /**
     * when create a new profile refresh list.
     */
    this.commonService.predictionExec$.subscribe(() => {
      setTimeout(() => {
        this.getProfileList();
      }, 500)
    })
  }
  @ViewChild('mySplit') mySplitEl: SplitComponent
  // area size
  _size1 = 100;
  _size2 = 0;
  get size1() {
    return this._size1;
  }

  set size1(value) {
    this._size1 = value;
  }
  get size2() {
    return this._size2;
  }

  set size2(value) {
    this._size2 = value;
  }
  gutterClick(e) {
    if (e.gutterNum === 1) {
      if (e.sizes[1] == 100) {
        this.size1 = 100;
        this.size2 = 0;
      }
    }
  }
  getProfileList() {
    this.profile.profileList = []
    this.profile.summary = undefined
    $('#dataTableProfiles').DataTable().destroy();
    $('#dataTableProfiles').DataTable().clear().draw();
    this.profiling.profileList().subscribe(res => {
      this.profile.profileList = res;
      setTimeout(() => {
        $('#dataTableProfiles').DataTable(this.opt2)
      }, 20);
    },
      error => {
        console.log(error)
      })
  }

  selectProfile(profile,tr){
    this.prediction.name = undefined;
    this.prediction.result = undefined;
    // this.profile.name = 
    this.prediction.date = profile[3];
    if (this.prevTR) {
      this.prevTR.classList.remove('selected')
      tr.classList.add('selected')
    }
    this.prevTR = tr;
    tr.classList.add('selected')
    if(this.size1 == 100) {
      this.size1 = 0;
      this.size2 = 100;
    } else {
      this.size1 = 100;
      this.size2 = 0
    }
    let profilebtn = document.getElementById('headingProfiles')
    profilebtn.click();
    $('#container-pred').hide();
    this.global.tablePredictionVisible = false;

    //send profile name to te other component.
    this.profiling.setProfileSummary(profile[0])
  }

}
