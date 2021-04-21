import { Component} from '@angular/core';
import { Space } from '../Globals';

@Component({
  selector: 'app-config-spreferences',
  templateUrl: './config-spreferences.component.html',
  styleUrls: ['./config-spreferences.component.css']
})
export class ConfigSpreferencesComponent {

  constructor(
    public space: Space
  ) { }

  infoPreferences = ['mol_batch', 'numCPUs','output_format', 'output_md'];

}
