import { Component, AfterContentChecked } from '@angular/core';
import { Model} from '../Globals';

@Component({
  selector: 'app-config-model',
  templateUrl: './config-model.component.html',
  styleUrls: ['./config-model.component.css']
})
export class ConfigModelComponent implements AfterContentChecked {

  constructor(public model: Model) { }

  objectKeys = Object.keys;

  infoModel = ['imbalance'];

  parametersModel = {
    RF: 'RF_parameters',
    XGBOOST: 'XGBOOST_parameters',
    PLSDA: 'PLSDA_parameters',
    PLSR: 'PLSR_parameters',
    GNB: 'GNB_parameters',
    SVM: 'SVM_parameters'
  };

  optimizeModel = {
    RF: 'RF_optimize',
    XGBOOST: 'XGBOOST_optimize',
    PLSDA: 'PLSDA_optimize',
    PLSR: 'PLSR_optimize',
    GNB: 'GNB_optimize',
    SVM: 'SVM_optimize'
  };

  type_models = {
    data: ['RF',  'XGBOOST', 'PLSDA', 'PLSR', 'GNB', 'SVM'],
    molecule: ['RF',  'XGBOOST', 'PLSDA', 'PLSR', 'GNB', 'SVM'],
    model_ensemble: ['RF', 'XGBOOST', 'PLSDA', 'PLSR', 'GNB', 'SVM', 'mean', 'median', 'majority', 'logicalOR', 'logicalAND', 'logicalTWO','matrix'],
    combo_models: ['mean', 'median', 'majority', 'logicalOR', 'logicalAND', 'logicalTWO', 'matrix'],
    no_conformal: ['majority', 'logicalOR', 'logicalAND', 'logicalTWO', 'mean', 'median']
  };

  conformal_settings = ['aggregated', 'normalizing_model', 'KNN_NN', 'conformal_predictors', 'ACP_sampler', 'aggregation_function'];

  model_settings = {
    RF: ['class_weight', 'max_depth', 'n_estimators', 'max_features', 'min_samples_split', 'oob_score', 'random_state'], 
    XGBOOST: ['max_depth', 'n_estimators', 'booster', 'learning_rate'],
    PLSDA: ['n_components', 'threshold'],
    PLSR: ['n_components'],
    SVM: ['class_weight', 'kernel', 'C', 'coef0', 'degree', 'gamma', 'probability', 'shrinking', 'random_state'],
    GNB: ['prior_negative', 'prior_positive', 'var_smoothing']
  }


  isComboModel () {
    if (this.type_models.combo_models.includes(this.model.parameters['model'].value)){
      return true;
    } 
    return false;
  }
  
  isConformalPossible() {
    if (this.type_models.no_conformal.includes(this.model.parameters['model'].value)){
      return false;
    } 
    return true;
  }
  
  check_key(parameterslist, key) {
    if (key in parameterslist) {
      return true;
    }
    return false;
  }

  validConformalKey (key) {
    // if (key=='aggregated') {
    //   return true;
    // }
    if (!this.model.parameters['conformal_settings'].value['aggregated'].value && 
         (key == 'conformal_predictors' || key == 'ACP_sampler' || key == 'aggregation_function')){
      return false;
    }
    if (!this.model.parameters['quantitative'].value && (key=='normalizing_model' || key =='KNN_NN')){
      return false
    }
    if (!Object.keys(this.model.parameters['conformal_settings'].value).includes(key)){
      return false;
    }
    return true;
  }

  ngAfterContentChecked() {
    // CHECK DELTA DEPENDENCIES
    // NOW IS HARDCODED, BUT IT WILL BE AUTOMATED
    // if (this.model.parameters['model'].value === 'PLSDA') {
    //   this.model.parameters['conformal'].value = false;
    // }
    if (this.model.parameters['model'].value === 'mean' || this.model.parameters['model'].value === 'median') {
      this.model.parameters['quantitative'].value = true;
      this.model.parameters['conformal'].value = false;
    }
    if (this.model.parameters['model'].value === 'majority') {
      this.model.parameters['quantitative'].value = false;
      this.model.parameters['conformal'].value = false;
    }
    if (this.model.parameters['model'].value === 'logicalOR') {
      this.model.parameters['quantitative'].value = false;
      this.model.parameters['conformal'].value = false;
    }
    if (this.model.parameters['model'].value === 'logicalAND') {
      this.model.parameters['quantitative'].value = false;
      this.model.parameters['conformal'].value = false;
    }
    if (this.model.parameters['model'].value === 'logicalTWO') {
      this.model.parameters['quantitative'].value = false;
      this.model.parameters['conformal'].value = false;
    }
    // console.log(this.model.parameters['conformal_settings'].value)
  }

}
