import { Component, OnInit  } from '@angular/core';
import { Space } from '../Globals';

@Component({
  selector: 'app-training-sseries',
  templateUrl: './training-sseries.component.html',
  styleUrls: ['./training-sseries.component.css']
})
export class TrainingSseriesComponent implements OnInit {

  constructor(
    public space: Space
  ) { }

  objectKeys = Object.keys;
  fileContent: any;
  num_of_mols = 0;
  type_file: string;

  ngOnInit () {
    this.space.file = undefined;
    this.space.incremental = false;
    this.space.file_info = undefined;
    this.space.file_fields = undefined;
  }

  public onChange(fileList: FileList): void {
    // clean previous settings
    this.space.file_info = undefined;
    this.space.file_fields = undefined;

    const file = fileList[0];
    this.space.file = file;
    this.space.file_info = {};
    this.space.file_info['name'] = file.name;
    this.space.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
    const extension = file.name.split('.');
    this.space.file_info['type_file'] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;

    // for SDFiles only, read the fields
    if (this.space.file_info['type_file'] == 'sdf') {
      fileReader.onloadend = function(x) {
        self.fileContent = fileReader.result;
        self.space.file_info['num_mols'] = (self.fileContent.match(/(\$\$\$\$)/g) || []).length;
        const res_array = self.fileContent.match(/>( )*<(.*)>/g);
        const res_dict = {};
        for (const variable of res_array) {
          const value = variable.replace(/[<> ]*/g, '');
          if (value in res_dict) {
            res_dict[value] = res_dict[value] + 1;
          }
          else {
            res_dict[value] = 1;
          }
        }
        self.space.file_fields = res_dict;
      };
      fileReader.readAsText(file);
    }
    // TODO: present # lines
  }

}
