import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelDocumentationService {

  constructor(private http: HttpClient) { }

  updateDocumentation(model: string, version: number, doc: string) {
    const formData = new FormData();
    formData.append('documentation', doc);
    const url: string = environment.baseUrl_manage + 'model/' + model +'/version/' + version + '/documentation';
    return this.http.post(url, formData);
  }
}

