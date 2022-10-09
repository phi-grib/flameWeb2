import { Component, OnInit } from '@angular/core';
import { Prediction } from '../Globals';

@Component({
  selector: 'app-manage-pred-prof',
  templateUrl: './manage-pred-prof.component.html',
  styleUrls: ['./manage-pred-prof.component.css']
})
export class ManagePredProfComponent implements OnInit {

  constructor(public prediction: Prediction) { }

  ngOnInit(): void {
  }

}
