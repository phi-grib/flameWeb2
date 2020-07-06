import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor() { }

  modelRoot: String;

  ngOnInit(): void {
    this.modelRoot = 'XXXX';
  }

  change(fileList: FileList): void {
    const file = fileList[0];
    // this.file = file;
  }

  applyChanges(){
    console.log(this.modelRoot);
  }

}
