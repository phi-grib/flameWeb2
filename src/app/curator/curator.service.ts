import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuratorService {

  constructor(private http: HttpClient) { }

  createEndpoint(name: string){
    const url: string = environment.baseUrl_curate + 'curate/' + name;
    return this.http.post(url, name);
  }

  deleteEndpoint(name: string){
    const url: string = environment.baseUrl_cmanage + 'delete/' + name;
    return this.http.delete(url);  
  }
}


