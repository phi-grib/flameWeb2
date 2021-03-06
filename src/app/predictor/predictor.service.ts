import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictorService {

  constructor(private http: HttpClient) { }

  predict(modelName: string, version: string, file: any, predictionName: string): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', file);
    const url: string = environment.baseUrl_predict + 'model/' + modelName + '/version/' + version + '/predictionName/' + predictionName;
    return this.http.put(url, formData);

  }

  predict_smiles(modelName: string, version: string, smiles: string, predictionName: string, sketchName: string): Observable<any> {
    
    const formData = new FormData();
    formData.append('SMILES', smiles);
    formData.append('name', sketchName);
    const url: string = environment.baseUrl_predict + 'model/' + modelName + '/version/' + version + '/predictionName/' + predictionName + '/smiles';
    return this.http.put(url, formData);

  }

}
