import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EditCuratedListService {

  constructor(private http: HttpClient
) { }

    //updates an endpoint based on its name and sends the file to be curated in a string json formated
    curateList(name: string){
    const url: string= environment.baseUrl_curate+'curate/'+ name;
    let formData = new FormData();
    formData.append('name', name)
    console.log(name);
    return this.http.put(url, name);
  }

  
  
}
