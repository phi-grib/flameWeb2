import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EditCuratedListService {

  constructor(private http: HttpClient) { }

  // sendFileToBeRead(FormData: string, , modelFormat: string) {
  //   const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/oformat/' + modelFormat + '/documentation';
  //   return this.http.get(url)
  // }


}
