import { Component } from '@angular/core';
import { Model, Prediction } from './Globals';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'flameweb';
  
  constructor(
    public prediction: Prediction,
    public model: Model,
    private router: Router) {}
    
    isActive(url: string) {
      return this.router.url.includes(url);
    }
}