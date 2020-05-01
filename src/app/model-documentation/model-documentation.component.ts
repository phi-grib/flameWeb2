import { Component, Input, OnChanges } from '@angular/core';
import { Model } from '../Globals';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.css']
})

export class ModelDocumentationComponent implements OnChanges {

  constructor( public model: Model,
               private commonService: CommonService) { }
  
  @Input() modelName;
  @Input() modelVersion;

  modelDocumentation = undefined;
  public documentationVisible = false;

  orderDocumentation = ['ID', 'Version', 'Contact', 'Institution', 'Date', 'Endpoint',
  'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
  'Limits_applicability', 'Experimental_protocol', 'Model_availability',
  'Data_info', 'Algorithm', 'Software', 'Descriptors', 'Algorithm_settings',
  'AD_method', 'AD_parameters', 'Goodness_of_fit_statistics', 
  'Internal_validation_1', 'Internal_validation_2', 'External_validation',
  'Comments', 'Other_related_models', 'Date_of_QMRF', 'Data_of_QMRF_updates',
  'QMRF_updates', 'References', 'QMRF_same_models', 'Comment_on_the_endpoint',
  'Endpoint_data_quality_and_variability', 'Descriptor_selection'];
  
  objectKeys = Object.keys;

  ngOnChanges(): void {
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
