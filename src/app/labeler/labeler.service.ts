import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LabelerService {

  constructor(private http: HttpClient) { }

  updateLabels(model: string, version: number, labels: string) {
    const formData = new FormData();
    formData.append('labels', labels);
    const url: string = environment.baseUrl_manage + 'model/' + model +'/version/' + version + '/labels';
    return this.http.post(url, formData);
  }

}
