import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manager} from '../Globals';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSpacesService {

  constructor(private http: HttpClient, private manager: Manager) { }

  /**
   * Call to the server to create a new model with the given name
   * @param model Name of the model to add
   */
  // createModel(model: string): Observable<any> {
  //   const url: string = environment.baseUrl_manage + 'model/' + model;
  //   return this.http.post(url, null);
  // }

  deleteSpace(space: string): Observable<any>  {
    const url: string = environment.baseUrl_smanage + 'space/' + space;
    return this.http.delete(url);
  }

  deleteVersion(space: string, version: string) {
    const url: string = environment.baseUrl_smanage + 'space/' + space + '/version/' + version;
    return this.http.delete(url);
  }

}
