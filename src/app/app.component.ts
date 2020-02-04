import { Component } from '@angular/core';
import {PlatformLocation  } from '@angular/common';
import { Model, Prediction } from './Globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'flameweb';

  constructor(public prediction: Prediction,
    public model: Model) {}
}


