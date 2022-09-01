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
  predictInputFile(profileName: string, file: any, endpoints: any,versions: any ): Observable<any> {
    const formData = new FormData();
    formData.append('SDF', file);
    formData.append('endpoints', endpoints);
    formData.append('versions',versions);
    const url: string = environment.baseUrl_predict + 'profile/profileName/' +profileName;
    return this.http.put(url, formData);
  }
  predictSketchStructure(profileName: string,smiles: string,name:string, endpoints:any,versions:any){
    const formData = new FormData();
    formData.append('SMILES',smiles);
    formData.append('name',name);
    formData.append('endpoints',endpoints);
    formData.append('versions',versions);
    const url: string = environment.baseUrl_predict + 'profile/profileName/' + profileName + '/smiles';
    return this.http.put(url,formData);
    }


  predict_smiles(modelName: string, version: string, smiles: string, predictionName: string, sketchName: string): Observable<any> {
    
    const formData = new FormData();
    formData.append('SMILES', smiles);
    formData.append('name', sketchName);
    const url: string = environment.baseUrl_predict + 'model/' + modelName + '/version/' + version + '/predictionName/' + predictionName + '/smiles';
    return this.http.put(url, formData);

  }
  predictInputList(profileName:string,smiles:any,name:string,endpoints:any,versions:any){
    const formData = new FormData();
    formData.append("smiles_list",smiles)
    formData.append("name",name)
    formData.append("endpoints",endpoints)
    formData.append("versions",versions)
    const url: string = environment.baseUrl_predict + 'profile/profileName/' + profileName +'/smiles_list'
    return this.http.put(url,formData)
    
  }
  deleteProfile(profileName: string){
    const url: string = environment.baseUrl_manage + 'profile/' + profileName;
    return this.http.delete(url);

  }
  profileItem(profileName:string, indxModel: number){
    const url = environment.baseUrl_manage + 'profile/'+profileName+ '/' + indxModel
    return this.http.get(url)
    }
  
    profileSummary(profileName: string){
    const url = environment.baseUrl_manage + 'profile/'+profileName+'/summary';
    return this.http.get(url);
    }
  
    profileList(){
      const url = environment.baseUrl_manage + 'profiles'
      return this.http.get(url);
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

}
