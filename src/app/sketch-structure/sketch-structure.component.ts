import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound, Globals } from '../Globals';

@Component({
  selector: 'app-sketch-structure',
  templateUrl: './sketch-structure.component.html',
  styleUrls: ['./sketch-structure.component.css']
})
export class SketchStructureComponent implements OnInit {

  modelName = '';
  isvalid: boolean = false;
  isvalidSketch: boolean = true;
  sketchName = 'sketched_mol';
  sketchSmiles: string = '';

  constructor(
    public globals: Globals,
    private renderer2: Renderer2,
    public compound: Compound,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
     // inject into the HTML code these two scripts required by JSME
     const jsme_script = this.renderer2.createElement('script');
     jsme_script.type = 'text/javascript';
     jsme_script.src = 'assets/jsme/jsme.nocache.js';
     jsme_script.text = ``;
     this.renderer2.appendChild(document.body, jsme_script);
 
     const jsme_init = this.renderer2.createElement('script');
     jsme_init.type = 'text/javascript';
     // jsme_init.src = 'assets/jsme/init.js';
    //  jsme_init.src = 'assets/jsme/initQuery.js';
     jsme_init.src = 'assets/jsme/initSelector.js';
     jsme_init.text = ``;
     this.renderer2.appendChild(document.body, jsme_init);
  }

  saveStructure() {
    this.compound.listCompoundsSelected = [];
    var span = document.getElementById('molclipboard_selector');
    this.sketchSmiles = span.innerText;
    //check name
    if (this.isvalidSketch && this.sketchSmiles) {
      this.commonService.setIsvalidCompound(true);
      this.commonService.setCurrentSelection({
        option: 'Sketch structure',
        name: this.sketchName,
      });
      this.compound.sketchstructure = {
        name: this.sketchName,
        result: this.sketchSmiles,
      };
      this.compound.listCompoundsSelected.push(
        this.compound.sketchstructure['name']
      );
      this.cleanOtherOptions();
    } else {
      alert('no molecule entered!');
      return;
    }
  }
  cleanOtherOptions() {
    this.compound.input_list = undefined;
    this.compound.input_file = undefined;
  }
  sketchNameChange() {
    this.isvalidSketch = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!this.sketchName.match(letters)) this.isvalidSketch = false;
  }
}
