import { Component, OnInit } from '@angular/core';
import { Model, Prediction, Globals } from './Globals';
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
    public model: Model,
    public globals: Globals
    ) {}

    toxhub: any;
    
    ngOnInit() {
      const me = this;
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        me.globals.mainTabActive = target;
      });

      this.toxhub = 'https://google.com'; // replace with ''
      var http_page = location.href;
      const n = http_page.lastIndexOf("flame.kh.svc");

      // if the page contains "flame.kh.svc"
      if  (n != -1){
        this.toxhub = (http_page.slice(0,n));        
      }
      // console.log(this.toxhub);
    }

}
