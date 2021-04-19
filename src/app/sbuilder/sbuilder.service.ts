import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Space } from '../Globals';

@Injectable({
  providedIn: 'root'
})
export class SbuilderService {

  constructor(
    private http: HttpClient, 
    private space: Space) { }


  buildSpace(): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', this.space.file);
    formData.append('parameters', JSON.stringify(this.space.delta));
    formData.append('incremental', JSON.stringify(this.space.incremental));
    const url: string = environment.baseUrl_sbuild + 'space/' + this.space.spaceName;

    return this.http.post(url, formData);

  }

}