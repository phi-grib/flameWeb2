import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelDocumentationService {

  constructor(private http: HttpClient) { }

  //updates documentation from YAML or JSON file (throught ManageDocumentation post method)
  updateDocumentation(model: string, version: number, doc: string, modelFormat: string ): Observable<any> {
    const formData = new FormData();
    formData.append('documentation', doc);
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version + '/oformat/' + modelFormat + '/documentation';
    return this.http.post(url, formData);
  }

  //obtains a copy of the model documentation formated to export (usualy YAML)
  exportToFile(modelName: string, modelVersion: string, modelFormat: string): Observable<any> {
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/oformat/' + modelFormat + '/documentation';
    // if (modelFormat == 'WORD' || modelFormat == "EXCEL") {
    // if (modelFormat == "EXCEL") {
    //   var a = document.createElement("a");
    //   a.style.display = 'none';
    //   document.body.appendChild(a);
    //   a.href = url;
    //   a.click();
    //   document.body.removeChild(a);
    // }
    if (modelFormat == "WORD" || modelFormat == "EXCEL") {
      return this.http.get(url, {responseType: 'arraybuffer'});
    }
    else {
      return this.http.get(url);
    }
  }

  downloadSeries(modelName: string, modelVersion: string): Observable<any> {
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/series';
    return this.http.get(url);
  }

  getYAMLfromParameters(modelName: string, modelVersion: string){
    // delta is a TS object and must be passed as JSON, so it can be interpreted by the Python backend 
    const formdata = new FormData();
    formdata.append('parameters', '*')
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/parameters2yaml';
    return this.http.post(url, formdata);
  }


}