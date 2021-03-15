import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EditCuratedListService {


  constructor(private http: HttpClient) { }

  postCurateList(listName: string){
    const url: string= environment.baseUrl_curate+'curate/'+ listName;

    console.log(listName);
    return this.http.post(url, listName);
  }

}
