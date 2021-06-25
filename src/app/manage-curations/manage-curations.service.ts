//author: Rodrigo Lorenzo Lorenzo 12-03-2021
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageCurationsService {

  constructor(private http: HttpClient) { }

  //sends a http post request to create a new endpoint
  createEndpoint(name: string){
    const url: string = environment.baseUrl_curate + 'curate/' + name;
    return this.http.post(url, name);
  }
  //sends a http post request to delete an endpoint
  deleteEndpoint(name: string){
    const url: string = environment.baseUrl_curate + 'curate/' + name;
    return this.http.delete(url);  
  }
}


