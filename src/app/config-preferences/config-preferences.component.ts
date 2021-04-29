import { Component } from '@angular/core';
import { Model} from '../Globals';

@Component({
  selector: 'app-config-preferences',
  templateUrl: './config-preferences.component.html',
  styleUrls: ['./config-preferences.component.css']
})
export class ConfigPreferencesComponent {
  constructor(private model: Model) { }
  objectKeys = Object.keys;
  infoPreferences = ['mol_batch', 'numCPUs', 'dimensionality_reduction','output_similar','output_format', 'output_md' ];
}
