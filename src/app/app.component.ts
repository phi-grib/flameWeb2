import { Component, OnInit } from '@angular/core';
import { Model, Prediction, Search, Space, Curation, Globals } from './Globals';
import { environment } from '../environments/environment';
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
    public curation: Curation,
    public globals: Globals
    ) {}

    toxhub: any;
    
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
    }

}
