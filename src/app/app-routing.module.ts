import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelListComponent } from './model-list/model-list.component';
import { CommonModule } from '@angular/common';
import { ValidationsComponent } from './validations/validations.component';
import { PredictionComponent } from './prediction/prediction.component';
import { SimilarityComponent, } from './similarity/similarity.component';
import { BuilderComponent, } from './builder/builder.component';
import { PredictionListComponent } from './prediction-list/prediction-list.component';
import { PredictorComponent } from './predictor/predictor.component';

const routes: Routes = [

  { path: 'predictions', component: PredictionListComponent},
  { path: 'models', component: ModelListComponent},
  { path: 'similarity', component: SimilarityComponent },
  { path: 'predictor', component: PredictorComponent },
  { path: 'builder', component: BuilderComponent },
  { path: 'validation', component: ValidationsComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: '', redirectTo: '/models', pathMatch: 'full'},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
