import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelDocumentationService {

  private fileList: string[] = new Array<string>();
  private fileList$: Subject<string[]> = new Subject<string[]>();

  constructor(private http: HttpClient) { }

  updateDocumentation(model: string, version: number, doc: string, format: string) {
    const formData = new FormData();
    formData.append('documentation', doc);
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version + '/format/' + format + '/documentation';
    return this.http.post(url, formData);
  }

  async exportToFile(modelName: string, modelVersion: string, modelFormat: string) {
    modelFormat = 'YAML';
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/oformat/' + modelFormat + '/documentation';
    let blob = new Blob()
    blob = await fetch(url).then(r => r.blob());
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let text = reader.result.toString();
      console.log(text);
      text = text.split("[").join("");
      text = text.split("]").join("");
      text = text.split('","').join("\n");
      text = text.split('"').join("");
      console.log(text);
      let parsedBlob = new Blob([text]);
      window.saveAs(parsedBlob, modelName + '.yaml');
    }
    reader.readAsText(blob);
  }

  



}

