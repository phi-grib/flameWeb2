import { Component } from '@angular/core';
import { Space } from '../Globals';

@Component({
  selector: 'app-config-straining',
  templateUrl: './config-straining.component.html',
  styleUrls: ['./config-straining.component.css']
})
export class ConfigStrainingComponent {

  constructor(
    public space: Space
  ) { }

  infoSeries = ['SDFile_name', 'normalize_method', 'convert3D_method', 'ionize_method', 'modelAutoscaling', 'computeMD_method']
  
}
