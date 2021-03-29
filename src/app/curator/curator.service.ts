import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuratorService {

  constructor(private http: HttpClient) { }

  UpdateCuration(name: string, date: string, finalDict: string){
    const url: string = environment.baseUrl_curate + 'curate/' + name;
    let formData = new FormData();
    formData.append('date', date);
    formData.append('formdata', finalDict);
    return this.http.put(url, name);
  }
}


