import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigurationService {

  constructor(private http: HttpClient) { }

  getConfiguration() {
    const url: string = environment.baseUrl_manage + 'configuration';
    return this.http.get(url);
  }

  setConfiguration(newpath: string) {
    const formData = new FormData();
    formData.append('newpath', newpath);
    const url: string = environment.baseUrl_manage + 'configuration';
    return this.http.post(url, formData);
  }

}
