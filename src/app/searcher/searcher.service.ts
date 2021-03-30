import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearcherService {

  constructor(private http: HttpClient) { }

  search_file(spaceName: string, version: string, file: any, searchName: string): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', file);
    const url: string = environment.baseUrl_predict + 'space/' + spaceName + '/version/' + version + '/searchName/' + searchName;
    return this.http.put(url, formData);
  }

  search_smiles(spaceName: string, version: string, smiles: string, searchName: string, sketchName: string): Observable<any> {
    
    const formData = new FormData();
    formData.append('SMILES', smiles);
    formData.append('name', sketchName);
    const url: string = environment.baseUrl_predict + 'space/' + spaceName + '/version/' + version + '/searchName/' + searchName + '/smiles';
    return this.http.put(url, formData);
  }

}
