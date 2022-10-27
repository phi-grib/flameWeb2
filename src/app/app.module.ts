import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// import { RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ModelListComponent } from './model-list/model-list.component';
import { TrainingSeriesComponent } from './training-series/training-series.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
import { ValidationsComponent } from './validations/validations.component';
import { ToastrModule } from 'ngx-toastr';
import { Model, Prediction, Globals, Manager, Similarity, Space, Search, Compound, Profile } from './Globals';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigTrainingComponent } from './config-training/config-training.component';
import { ConfigModelComponent } from './config-model/config-model.component';
import { ConfigPreferencesComponent } from './config-preferences/config-preferences.component';
import { ChecklistModule } from 'angular-checklist';
import { QualitConformalComponent } from './qualit-conformal/qualit-conformal.component';
import { QuantitConformalComponent } from './quantit-conformal/quantit-conformal.component';
import { BuilderComponent } from './builder/builder.component';
import { PredictorComponent } from './predictor/predictor.component';
import { PredictionComponent } from './prediction/prediction.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PredictionListComponent } from './prediction-list/prediction-list.component';
import { ManageModelsComponent } from './manage-models/manage-models.component';
import { ManagePredictionsComponent } from './manage-predictions/manage-predictions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfusionMatrixComponent } from './confusion-matrix/confusion-matrix.component';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './utils/app-init';
import { LabelerComponent } from './labeler/labeler.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SearcherComponent } from './searcher/searcher.component';
import { SpaceListComponent } from './space-list/space-list.component';
import { SearchComponent } from './search/search.component';
import { ManageSpacesComponent } from './manage-spaces/manage-spaces.component';
import { SbuilderComponent } from './sbuilder/sbuilder.component';
import { ConfigStrainingComponent } from './config-straining/config-straining.component';
import { TrainingSseriesComponent } from './training-sseries/training-sseries.component';
import { ConfigSpreferencesComponent } from './config-spreferences/config-spreferences.component';
import { VerificatorComponent } from './verificator/verificator.component';
import { AngularSplitModule } from 'angular-split';
import { PredictionListTabComponent } from './prediction-list-tab/prediction-list-tab.component';
import { SelectorComponent } from './selector/selector.component';
import { SelectCompoundComponent } from './select-compound/select-compound.component';
import { InputFileComponent } from './input-file/input-file.component';
import { SketchStructureComponent } from './sketch-structure/sketch-structure.component';
import { InputListComponent } from './input-list/input-list.component';
import { SaveProfileButtonComponent } from './save-profile-button/save-profile-button.component';
import { LoadProfileButtonComponent } from './load-profile-button/load-profile-button.component';
import { ManageActionsComponent } from './manage-actions/manage-actions.component';
import { PredictButtonComponent } from './predict-button/predict-button.component';
import { ProfilingButtonComponent } from './profiling-button/profiling-button.component';
import { CurrentSelectionComponent } from './current-selection/current-selection.component';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';
// import * as SmilesDrawer from 'smiles-drawer';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    TrainingSeriesComponent,
    // SidebarComponent,
    ValidationsComponent,
    ConfigTrainingComponent,
    ConfigModelComponent,
    ConfigPreferencesComponent,
    QualitConformalComponent,
    QuantitConformalComponent,
    BuilderComponent,
    PredictorComponent,
    PredictionComponent,
    // SimilarityComponent,
    PredictionListComponent,
    ManageModelsComponent,
    ManagePredictionsComponent,
    ConfusionMatrixComponent,
    ModelDocumentationComponent,
    LabelerComponent,
    ConfigurationComponent,
    SearcherComponent,
    SpaceListComponent,
    SearchComponent,
    ManageSpacesComponent,
    SbuilderComponent,
    ConfigStrainingComponent,
    TrainingSseriesComponent,
    ConfigSpreferencesComponent,
    VerificatorComponent,
    PredictionListTabComponent,
    SelectorComponent,
    SelectCompoundComponent,
    InputFileComponent,
    SketchStructureComponent,
    InputListComponent,
    SaveProfileButtonComponent,
    LoadProfileButtonComponent,
    ManageActionsComponent,
    PredictButtonComponent,
    ProfilingButtonComponent,
    CurrentSelectionComponent,
    ProfileListComponent,
    ProfileSummaryComponent,
    ProfileItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ChecklistModule,
    NgbModule,
    KeycloakAngularModule,
    PlotlyModule, 
    AngularSplitModule
  ],
  providers: [Model, Prediction, Globals, Manager, Similarity, Space, Search,Compound,Profile,
  {
    provide: APP_INITIALIZER,
    useFactory: initializer,
    multi: true,
    deps: [KeycloakService]
  }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
