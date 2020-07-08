import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Model } from '../Globals';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from '../common.functions';
declare var $: any;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor (
    private confservice: ConfigurationService,
    private func: CommonFunctions,
    private model: Model,
    private toaster: ToastrService  ) {
  }

  modelRoot: string;
  flameConf: any;

  ngOnInit(): void {
    
    this.modelRoot = 'enter a path';
    this.getConfiguration();
    
  }

  getConfiguration (){
    this.confservice.getConfiguration().subscribe(
      result => {
          this.modelRoot = result[0];
          this.flameConf = result[1];
          console.log(result);
      },
      error => {
          alert('Error obtaining Flame configuration');
      }
    );
  }

  applyChanges(){
    console.log(this.modelRoot);
    this.confservice.setConfiguration(this.modelRoot).subscribe(
      result => {
        window.location.reload();
        // this.model.listModels = {};
        // $('#dataTableModels').DataTable().destroy();
        // this.func.getModelList();
        this.toaster.success('Configuration','UPDATED', {
              timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
      },
      error => {
          alert('Error setting Flame configuration');
          this.getConfiguration();
      }
    );
  }

}
