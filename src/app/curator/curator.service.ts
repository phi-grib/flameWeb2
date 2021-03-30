import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuratorService {

  constructor(private http: HttpClient) { }

  createEndpoint(name: string, date: string){
    const url: string = environment.baseUrl_curate + 'curate/' + name;
    let formData = new FormData();
    formData.append('date', date);
    return this.http.post(url, name);
  }
}


