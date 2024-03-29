import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Model {
  name: string = undefined;   // Name of the model selected in the first step
  version: any = undefined; // Version of the model selected in the first step
  modelID: string = undefined;
  file: any = undefined;  // Name of file uploaded in the second step
  type: string;
  input_type: string = undefined;
  trained = false; // Model is already trained
  file_info = undefined; // Info file ej. num mols, variables
  file_fields = undefined;
  quantitative: boolean = undefined;
  conformal: boolean = undefined;
  confidential: boolean = undefined;
  secret: boolean = undefined;
  ensemble: boolean = undefined;
  incremental = false;
  error: string = undefined;
  listModelsSelected = [];
  documentation: any = undefined;
  /*
  Delta parameters, empty by default, fills on clicking the parameters tab.
  When you change anything on the formulary, automatically changes the value for that key
  */
  parameters: any = undefined;
  delta: any = {};
  trainig_models = [];
  listModels = {};
  listLabels = {};
  trained_models = [];
  selectedItems = [];
  page = 0;
  pagelen = 10;
}

@Injectable()
export class Compound {
    file_info = undefined; // Info file ej. num mols, variables
    file_fields = undefined;
    sketchstructure: {} = undefined;
    input_list: {} = undefined;
    input_file = undefined;
    listCompoundsSelected = [];
    molidx:number = 0;
}

@Injectable()
export class Profile {
      name: string = undefined;
      summary: any = undefined;
      item = undefined;
      profileList: any  = []; 
      prevModelIndex = undefined;
  }
@Injectable()
export class Space {
    file: any = undefined;  // Name of file uploaded in the second step
    spaceName: string = undefined;
    spaceVersion: any = undefined;
    spaceType: string = undefined;
    building_spaces = [];
    file_info = undefined; // Info file ej. num mols, variables
    file_fields = undefined;
    incremental = false;
    parameters: any;
    delta: any = {};
    // spaceDocumentation: any = undefined;
    // spaceID: string = undefined;
    spaces = [];
}

@Injectable()
export class Prediction {
    name: string = undefined;   // Name of the model selected in the first step
    modelName: string = undefined;
    modelVersion: string = undefined;
    modelParameters: any;
    modelDocumentation: any = undefined;
    modelMatch: boolean = true;
    modelPresent: boolean = true;
    predictions = [];
    predicting = {};
    conformal = false;
    file: any = undefined;  // Name of file uploaded in the second step
    result = undefined;
    date = undefined;
    modelID = undefined;
    modelBuildInfo = {};
    molSelected = undefined;
}

@Injectable()
export class Search {
    searchName: string = undefined;
    spaceName: string = undefined;
    spaceVersion: string = undefined;
    file: any = undefined;  // Name of file uploaded in the second step
    result = undefined;
    nameSrc = undefined;
    smileSrc = undefined;
    metric = undefined;
}

@Injectable()
export class Manager {
    name: string = undefined;   // Name of the model selected in the first step
    version: string = undefined; // Version of the model selected in the first step
    file: any = undefined;  // Name of file uploaded in the second step
}

@Injectable()
export class Globals {
    tableModelVisible = false;
    tablePredictionVisible = false;
    tableSpaceVisible = false;
    mainTabActive: string = undefined;
    read_only = environment.read_only;
     
}

@Injectable()
export class Similarity {

    model_name: string = undefined;
    model_version: string = undefined;
    file: any = undefined;  // Name of file uploaded in the second step
    file_info = undefined; // Info file ej. num mols, variables
    file_fields = undefined;
    result = undefined;
    predicting = false;
    nameSrc = undefined;
    smileSrc = undefined;
}

@Injectable()
export class CustomHTMLElement extends HTMLElement {
    constructor() {
      super();
    }
    on(event_type, cb) {
    }
}