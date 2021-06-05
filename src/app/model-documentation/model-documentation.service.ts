import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelDocumentationService {

  // private fileList: string[] = new Array<string>();
  // private fileList$: Subject<string[]> = new Subject<string[]>();

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
    if (modelFormat == 'WORD') {
      var a = document.createElement("a");
      a.href = url;
      a.click();
    }
    else {
      return this.http.get(url)
    }
  }


}