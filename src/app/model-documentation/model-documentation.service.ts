import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
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
    const url: string = environment.baseUrl_manage + 'model/' + model +'/version/' + version + '/format/' + format + '/documentation';
    return this.http.post(url, formData);
  }

}

