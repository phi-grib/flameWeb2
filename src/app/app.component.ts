import { Component, OnInit, ViewChild } from '@angular/core';
import { Model, Prediction, Search, Space, Globals } from './Globals';
import { environment } from '../environments/environment';
import { CommonService } from './common.service';
import { SplitComponent } from 'angular-split';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'flameweb';
  
  constructor(
    public prediction: Prediction,
    public search: Search,
    public space: Space,
    public model: Model,
    public globals: Globals,
    private commonService: CommonService
    ) {}

    toxhub: any;
    
    modelleft = 40;
    modelright = 60;

    predictleft = 40;
    predictright = 60;

    spaceleft = 40;
    spaceright = 60;

    profileLeft = 40;
    profileRight=60;

    selectorLeft = 40;
    selectorRight=60;
    
    ngOnInit() {
      const me = this;
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        me.globals.mainTabActive = target;
      });

      this.toxhub = ''; // replace with ''
      if (environment.baseUrl.includes('flame.kh.svc')) {
        this.toxhub = '/';
      }
      // var http_page = location.href;
      // console.log (http_page)
      // const n = http_page.lastIndexOf("flame.kh.svc");

      // // if the page contains "flame.kh.svc"
      // if  (n != -1){
      //   this.toxhub = (http_page.slice(0,n));        
      // }
      // console.log(this.toxhub);
      this.commonService.statusModelTab$.subscribe(status => {
        if(status){
          this.size1 = 30;
          this.size2 = 70;
        }else{
          this.size1 = 100;
          this.size2 = 0;
        }
      })
    }
    @ViewChild('mySplit') mySplitEl: SplitComponent
    // area size
    _size1=100;
    _size2=0;
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



    gutterClickModels() {
      if (this.modelleft > 0) {
        this.modelleft = 0;
        this.modelright = 100;
      } else {
        this.modelleft = 40
        this.modelright = 60
      }
    }
    gutterClickPredictions() {
      if (this.predictleft > 0) {
        this.predictleft = 0;
        this.predictright = 100;
      } else {
        this.predictleft = 40
        this.predictright = 60
      }
    }
    gutterClickSpaces() {
      if (this.spaceleft > 0) {
        this.spaceleft = 0;
        this.spaceright = 100;
      } else {
        this.spaceleft = 40
        this.spaceright = 60
      }
    }
    gutterClickProfile() {
      if (this.profileLeft > 0) {
        this.profileLeft = 0;
        this.profileRight = 100;
      } else {
        this.profileLeft = 40
        this.profileRight = 60
      }
    }
    gutterClickSelector() {
      if (this.selectorLeft > 0) {
        this.selectorLeft = 0;
        this.selectorRight = 100;
      } else {
        this.selectorLeft = 40
        this.selectorRight = 60
      }
    }


}
