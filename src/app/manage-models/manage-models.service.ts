import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manager} from '../Globals';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageModelService {

  constructor(private http: HttpClient, private manager: Manager) { }

  /**
   * Call to the server to create a new model with the given name
   * @param model Name of the model to add
   */
  createModel(model: string): Observable<any> {
    const url: string = environment.baseUrl_manage + 'model/' + model;
    return this.http.post(url, null);
  }

  deleteModel(model: string): Observable<any>  {
    const url: string = environment.baseUrl_manage + 'model/' + model;
    return this.http.delete(url);
  }

  deleteVersion(model: string, version: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version;
    return this.http.delete(url);
  }

  cloneModel(model: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model;
    return this.http.put(url,null);
  }

  importModel(): Observable<any> {
    const formData = new FormData();
    formData.append('model', this.manager.file);
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl_manage + 'model/import';
    return this.http.post(url, formData);
  }
  
  exportModel(model: string, version: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version + '/export';
    return this.http.get(url);
  }
  
  exportTestModel(model: string, version: string, temp_dir: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version + '/temp_dir/' + temp_dir +'/export_test';
    return this.http.get(url);
  }

  exportTestDownload(model: string, version: string, temp_dir: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model + '/version/' + version + '/temp_dir/' + temp_dir + '/export_download';
    return this.http.get(url, {responseType: 'arraybuffer'});

    // const a = document.createElement("a");
    // a.style.display = 'none';
    // document.body.appendChild(a);
    // a.href = url;
    // a.click();
    // document.body.removeChild(a);
  }

  refreshModel(model: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model +'/refresh';
    return this.http.get(url);
  }

  testRefresh(model: string) {
    const url: string = environment.baseUrl_manage + 'model/' + model +'/refresh_test';
    return this.http.get(url);
  }

}
