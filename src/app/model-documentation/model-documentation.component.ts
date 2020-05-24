import { Component, Input, OnChanges } from '@angular/core';
import { Model } from '../Globals';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { ModelDocumentationService } from './model-documentation.service';

@Component({
  selector: 'app-model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.css']
})

export class ModelDocumentationComponent implements OnChanges {

  constructor( public model: Model,
               public service: ModelDocumentationService,
               private toastr: ToastrService,
               private commonService: CommonService) { }
  
  @Input() modelName;
  @Input() modelVersion;
  @Input() modelID;

  modelDocumentation = undefined;
  public documentationVisible = false;

  levelLabels = ['General model information', 'Algorithms and software', 'Other information'];

  docLevel = [  ['ID', 'Version', 'Contact', 'Institution', 'Date', 'Endpoint',
                  'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
                  'Limits_applicability', 'Experimental_protocol', 'Model_availability',
                  'Data_info'],
                 ['Algorithm', 'Software', 'Descriptors', 'Algorithm_settings',
                  'AD_method', 'AD_parameters', 'Goodness_of_fit_statistics', 
                  'Internal_validation_1', 'Internal_validation_2', 'External_validation',
                  'Comments'],
                 ['Other_related_models', 'Date_of_QMRF', 'Date_of_QMRF_updates',
                  'QMRF_updates', 'References', 'QMRF_same_models', 'Comment_on_the_endpoint',
                  'Endpoint_data_quality_and_variability', 'Descriptor_selection']
                 ];
  
  editLevel = [  ['ID', 'Version', 'Contact', 'Institution', 'Date', 'Endpoint',
                 'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
                 'Limits_applicability', 'Experimental_protocol', 'Model_availability',
                 'Data_info'],
                ['Algorithm', 'Software', 'Descriptors', 'AD_method', 'AD_parameters',
                 'Internal_validation_2', 'External_validation',
                 'Comments'],
                ['Other_related_models', 'Date_of_QMRF', 'Date_of_QMRF_updates',
                 'QMRF_updates', 'References', 'QMRF_same_models', 'Comment_on_the_endpoint',
                 'Endpoint_data_quality_and_variability', 'Descriptor_selection']
                ];

  sectionActive: number;
  modelDocumentationBackup: any;

  objectKeys = Object.keys;

  ngOnChanges(): void {
    // console.log('documentation', this.modelID)
    this.getDocumentation();
  }

  isObject(val:any) {
    if (val === null) {
      return false;
    }
    return typeof val === 'object';
  }

  cleanStr (str:string) {
    return str.replace(/_/g, ' ');
  }

  private isDict(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
  }

  editSection(val:number){
    this.sectionActive = val;
    // deep copy modelDocumentation. In case of cancel we will restore it
    this.modelDocumentationBackup = JSON.parse(JSON.stringify(this.modelDocumentation));

  }

  cancelInput(){
    this.modelDocumentation = JSON.parse(JSON.stringify(this.modelDocumentationBackup));
  }

  applyInput(){
    let delta = JSON.stringify(this.genDelta(this.modelDocumentation));
    // console.log (delta)

    this.service.updateDocumentation(this.model.name, this.model.version, delta).subscribe(
      result => {
        this.toastr.success('Model ' + this.model.name + '.v' + this.model.version , 'DOCUMENTATION UPDATED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      },
      error => {
        alert('Error updating documentation');
      }
    );
  }

  private genDelta(dict_in: {}) {
    let dict_aux = {};
    const dict_out = {};

    for (const key of Object.keys(dict_in)) {
      let val = dict_in[key]['value'];
      if (!this.isDict(val)) {
        dict_out[key] = val;
      }
      else {
        dict_aux = {};
        for (const key2 of Object.keys(val)) {
            if (!this.isDict(val[key2])){
              dict_aux[key2] = val[key2];
            }
            else {
              dict_aux[key2] = val[key2]['value'];
            }
        }
        dict_out[key] = dict_aux;
      }
    }
    return dict_out;
  }

  getDocumentation(): void {
    this.documentationVisible = false;
    this.commonService.getDocumentation(this.modelName, this.modelVersion).subscribe(
      result => {
        this.modelDocumentation = result;

        // for (var key in this.modelDocumentation) {
        //       console.log(key, this.modelDocumentation[key]);
        //   }

      },
      error => {
        this.modelDocumentation = undefined;
      }
    );
    this.documentationVisible = true;
  }

}
