import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Model, Globals } from '../Globals';
import { Router } from '@angular/router';
import { fade, slideUp } from '../animations/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    fade,
    slideUp
  ]
})


export class SidebarComponent implements OnInit {
  
  tabselected = 'similar';

  constructor(public model: Model,
    public globals: Globals,
    private router: Router ) {}


  ngOnInit() {
  }

  isActive(url: string) {
     return this.router.url.includes(url);
  }

}
