import { Component, OnInit } from '@angular/core';
import { Space } from '../Globals';

@Component({
  selector: 'app-config-straining',
  templateUrl: './config-straining.component.html',
  styleUrls: ['./config-straining.component.css']
})
export class ConfigStrainingComponent implements OnInit {

  constructor(
    public space: Space
  ) { }

  ngOnInit(): void {
  }

  infoSeries = ['SDFile_name', 'normalize_method', 'convert3D_method', 'ionize_method', 'modelAutoscaling', 'computeMD_method']

}
