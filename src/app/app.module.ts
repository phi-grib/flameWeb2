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
import { Model, Prediction, Globals, Manager, Similarity } from './Globals';
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
import { SimilarityComponent } from './similarity/similarity.component';
import { PredictionListComponent } from './prediction-list/prediction-list.component';
import { ManageModelsComponent } from './manage-models/manage-models.component';
import { ManagePredictionsComponent } from './manage-predictions/manage-predictions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfusionMatrixComponent } from './confusion-matrix/confusion-matrix.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './utils/app-init';
import { LabelerComponent } from './labeler/labeler.component';
import { ConfigurationComponent } from './configuration/configuration.component';
// import * as SmilesDrawer from 'smiles-drawer';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// import { PlotlyViaCDNModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;
// PlotlyViaCDNModule.plotlyVersion = '1.49.4';


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
    SimilarityComponent,
    PredictionListComponent,
    ManageModelsComponent,
    ManagePredictionsComponent,
    ConfusionMatrixComponent,
    ModelDocumentationComponent,
    LabelerComponent,
    ConfigurationComponent
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
    // PlotlyViaCDNModule,
    PlotlyModule
  ],
  providers: [Model, Prediction, Globals, Manager, Similarity, 
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
