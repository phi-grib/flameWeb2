import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfilingService {

  //The component containing the list of profiles. 
//Activates the component containing the profile overview.
private summaryActive = new Subject<string>();
summaryActive$ = this.summaryActive.asObservable();

constructor(private http:HttpClient) { }


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

profileList(){
  const url = environment.baseUrl_manage + 'profiles'
  return this.http.get(url);
}


profileItem(profileName:string, indxModel: number){
const url = environment.baseUrl_manage + 'profile/'+profileName+ '/' + indxModel
return this.http.get(url)
}

profileSummary(profileName: string){
const url = environment.baseUrl_manage + 'profile/'+profileName+'/summary';
return this.http.get(url);
}

setProfileSummary(profileName: string){
  this.summaryActive.next(profileName);
}
}
