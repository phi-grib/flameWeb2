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
    
    ngOnInit() {
      const me = this;
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        me.globals.mainTabActive = target;
      });
    }

}
