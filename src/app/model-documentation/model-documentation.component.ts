import { Component, Input, OnChanges } from '@angular/core';
import { Model, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { ModelDocumentationService } from './model-documentation.service';
// import { environment } from '../../environments/environment';

// import { MatIconModule } from '@angular/material/icon';
// import * as FileSaver from 'file-saver';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.css']
})

export class ModelDocumentationComponent implements OnChanges {

  // @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];

  constructor(public model: Model,
    public service: ModelDocumentationService,
    private toastr: ToastrService,
    private globals: Globals,
    private commonService: CommonService) { }

  @Input() modelName;
  @Input() modelVersion;
  @Input() modelID;


  // materialModules = [MatIconModule];
  modelDocumentation = undefined;
  downloadLink = undefined;
  fileToUpload: File = null;
  public documentationVisible = false;

  levelLabels = ['General model information', 'Algorithms and software', 'Other information'];
  docLevel  = [[],[],[]];
  editLevel = [[],[],[]];

  sectionActive: number;
  modelDocumentationBackup: any;

  objectKeys = Object.keys;

  ngOnChanges(): void {
    this.getDocumentation();
  }

  isObject(val: any) {
    if (val === null) {
      return false;
    }
    return typeof val === 'object';
  }

  cleanStr(str: string) {
    return str.replace(/_/g, ' ');
  }

  cleanFit(str: string) {
    return str.replace(/_f/g, '');
  }

  private isDict(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
  }

  editSection(val: number) {
    this.sectionActive = val;
    // deep copy modelDocumentation. In case of cancel we will restore it
    this.modelDocumentationBackup = JSON.parse(JSON.stringify(this.modelDocumentation));

  }

  cancelInput() {
    this.modelDocumentation = JSON.parse(JSON.stringify(this.modelDocumentationBackup));
  }

  //requests documentation from the API through ManageDocumentation get method params(modelName, modelVersion, 'JSON')
  getDocumentation(): void {
    this.documentationVisible = false;
    this.commonService.getDocumentation(this.modelName, this.modelVersion, 'JSON').subscribe(
      result => {
        this.modelDocumentation = result;

        // once Documentation fields are loaded, update the template to load ONLY these fields present in the loaded
        // documentation. 
        // this is very important to guarantee back-compatibility (models with less fields in the documentation)
        const dBlocks = [
          ['ID', 'Version', 'Model_title', 'Model_description', 'Keywords', 'Contact', 'Institution', 'Date', 'Endpoint',
            'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
            'Limits_applicability', 'Experimental_protocol', 'Model_availability',
            'Data_info'],
          ['Algorithm', 'Software', 'Descriptors', 'Algorithm_settings',
            'AD_method', 'AD_parameters', 'Goodness_of_fit_statistics',
            'Internal_validation_1', 'Internal_validation_2', 'External_validation',
            'Comments'],
          ['Other_related_models', 'Date_of_QMRF', 'Date_of_QMRF_updates',
            'QMRF_updates', 'References', 'QMRF_same_models', 'Mechanistic_basis', 
            'Mechanistic_references', 'Supporting_information', 'Comment_on_the_endpoint',
            'Endpoint_data_quality_and_variability', 'Descriptor_selection']
          ];

        const eBlocks = [
          ['ID', 'Version', 'Model_title', 'Model_description', 'Keywords', 'Contact', 'Institution', 'Date', 'Endpoint',
            'Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species',
            'Limits_applicability', 'Experimental_protocol', 'Model_availability',
            'Data_info'],
          ['Algorithm', 'Software', 'Descriptors', 'AD_method', 'AD_parameters',
            'Internal_validation_2', 'External_validation',
            'Comments'],
          ['Other_related_models', 'Date_of_QMRF', 'Date_of_QMRF_updates',
            'QMRF_updates', 'References', 'QMRF_same_models', 'Mechanistic_basis', 
            'Mechanistic_references', 'Supporting_information', 'Comment_on_the_endpoint',
            'Endpoint_data_quality_and_variability', 'Descriptor_selection']
          ];

        for (let i = 0; i < 3; i++) { 
          this.docLevel[i]  = []; // clean previous versions of docLevel
          this.editLevel[i] = []; // clean previous versions of editLevel
          for (let label in dBlocks[i]) {
            // push only field existing in modelDocumentation
            if (dBlocks[i][label] in this.modelDocumentation) {
              this.docLevel[i].push(dBlocks[i][label]);
            }
          }
          for (let label in eBlocks[i]) {
            // push only field existing in modelDocumentation
            if (eBlocks[i][label] in this.modelDocumentation) {
              this.editLevel[i].push(eBlocks[i][label]);
            }
          }
        }

      },
      error => {
        this.modelDocumentation = undefined;
      }
    );
    this.documentationVisible = true;
  }

  // YAML files cannot be downloaded directly, because DJANGO shows them in their internal framework
  downloadFile() {
    this.service.exportToFile(this.modelName, this.modelVersion, 'YAML').subscribe (
        result => {
          let text : string = '';
          for (const x in result){
            text += result[x] + '\n';
          }
          let blob = new Blob ([text],  {type: "text/plain;charset=utf-8"})
          saveAs(blob, this.modelName + '.yaml');
        },
        error => {
          alert('Error updating documentation');
        }
    );
  }

  // calls exportToFile 
  downloadWord() {
    this.service.exportToFile(this.modelName, this.modelVersion, 'WORD')
  }

  // calls exportToFile
  downloadExcel(){
    this.service.exportToFile(this.modelName,this.modelVersion, 'EXCEL')
  }
  
  // compresses the changes in the GUI into a JSON delta file
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
          if (!this.isDict(val[key2])) {
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

  // download the training series of the currently selected model/version
  downloadSeries () {
    this.service.downloadSeries(this.model.name, this.model.version)
  }

  // updates the documentation in the backend using the changes introduced in the GUI
  applyInput() {
    let delta = JSON.stringify(this.genDelta(this.modelDocumentation));

    this.service.updateDocumentation(this.model.name, this.model.version, delta, 'JSON').subscribe(
      result => {
        this.toastr.success('Model ' + this.model.name + '.v' + this.model.version, 'DOCUMENTATION UPDATED', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
      },
      error => {
        alert('Error updating documentation:' + error.error.error);
      }
    );
  }

  // updates the documentation in the backend from a yaml file 
  uploadFile(event) {
    if (event.target.files.length !== 1) {
      console.error('No file selected');
    } else {
      const reader = new FileReader();
      reader.onloadend = (e) => {

        this.service.updateDocumentation(this.model.name, this.model.version, reader.result.toString(), 'YAML').subscribe(
          result => {
            this.getDocumentation();
            this.toastr.success('Model ' + this.model.name + '.v' + this.model.version, 'DOCUMENTATION UPDATED', {
              timeOut: 5000, positionClass: 'toast-top-right'
            });
          },
          error => {
            alert('Unable to parse documentation file:' + error.error.error);
          }
        );
      };
      reader.readAsText(event.target.files[0]);        
      }
    
  }

}