import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictorService {

  constructor(private http: HttpClient) { }

  getPredictionList(): Observable<any> {
    const url: string = environment.baseUrl_manage + 'predictions';
    return this.http.get(url);
  }

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

  predict_smiles_list(modelName: string, version: string, smiles_list: any, predictionName: string, sketchName: string): Observable<any> {
    
    const formData = new FormData();
    formData.append('smiles_list', JSON.stringify(smiles_list));
    formData.append('name', sketchName);
    const url: string = environment.baseUrl_predict + 'model/' + modelName + '/version/' + version + '/predictionName/' + predictionName + '/smiles_list';
    return this.http.put(url, formData);

  }

  getBasketList(): Observable<any> {
    const url: string = environment.baseUrl_manage + 'baskets';
    return this.http.get(url);
  }

  getBasket(item: any): Observable<any> {
    const url: string = environment.baseUrl_manage + 'basket/' + item;
    return this.http.get(url);
  }
  deleteCollection(name: string){
    const url = environment.baseUrl_manage + "collection/"+name
    return this.http.delete(url); 

  }

  collection(name:string,endpoints,versions){
    const url = environment.baseUrl_manage + "collection/"+name
    const formData = new FormData();
    formData.append("endpoints",endpoints)
    formData.append("versions",versions)
    return this.http.put(url,formData)
  }
  getCollections(): Observable<any> {
    const url = environment.baseUrl_manage + "collections"
    return this.http.get(url);
  }
  

}
