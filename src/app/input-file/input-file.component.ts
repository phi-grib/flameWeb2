import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound, Model } from '../Globals';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements OnInit {

  isValidSDFile: boolean = false;
  fileContent: any;
  file = undefined;
  listmols = []

  constructor(public model: Model,public compound: Compound,private commonService: CommonService) { }

  ngOnInit(): void {
  }

  Save(){
    this.commonService.setIsvalidCompound(true);
    this.compound.input_file = {'name': this.compound.file_info['name'] ,'result':this.file}
    this.cleanOtherOptions();
   }
   public change(event): void {
    this.compound.listCompoundsSelected = [];
   const file:File = event.target.files[0];
   if(file) this.file = file;
   this.compound.file_info = {};
   this.compound.file_info['name'] = file.name;
   this.compound.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
   const extension = file.name.split('.');
   this.compound.file_info['type_file'] = extension[1];
   const fileReader: FileReader = new FileReader();
   const self = this;
   // for SDFiles only.
   if (this.compound.file_info['type_file'] == 'sdf') {
     this.isValidSDFile = true;
     fileReader.onloadend = function(x) {
       self.fileContent = fileReader.result;
       // self.compound.listCompoundsSelected = self.fileContent.match(/\$\$\$\$\s+(.+)\s*/ig);
       self.listmols = self.fileContent.match(/\$\$\$\$\s+(.+)\s*/ig);
       var firstMol = self.fileContent.match(/.+/g)[0]
       self.compound.listCompoundsSelected.push(firstMol)
       if(self.listmols){
       self.listmols.forEach((item) => {
         self.compound.listCompoundsSelected.push(item.substring(4))
       })
      } 
       self.compound.file_info['num_mols'] = (self.fileContent.match(/(\$\$\$\$)/g) || []).length;
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
       self.compound.file_fields = res_dict; 
     }
     fileReader.readAsText(file);
   }
   this.Save()
 }
   /**
   * Clean up the other options available for prediction
   */
    cleanOtherOptions(){
      this.compound.input_list = undefined;
      this.compound.sketchstructure = undefined
    }
}
