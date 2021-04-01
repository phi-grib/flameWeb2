import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Search, Globals } from '../Globals';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearcherService {

  constructor(
    private http: HttpClient,
    private search: Search) { }

  // search_file(spaceName: string, version: string, file: any, searchName: string): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('SDF', file);
  //   const url: string = environment.baseUrl_predict + 'space/' + spaceName + '/version/' + version + '/searchName/' + searchName;
  //   return this.http.put(url, formData);
  // }

  // search_smiles(spaceName: string, version: string, smiles: string, searchName: string, sketchName: string): Observable<any> {
    
  //   const formData = new FormData();
  //   formData.append('SMILES', smiles);
  //   formData.append('name', sketchName);
  //   const url: string = environment.baseUrl_predict + 'space/' + spaceName + '/version/' + version + '/searchName/' + searchName + '/smiles';
  //   return this.http.put(url, formData);
  // }

  getSearch(label: string): Observable<any> {
    const url: string = environment.baseUrl_smanage + 'search/' + label;
    return this.http.get(url);
  }

  runsearch(space_name: string, version: string, num_cutoff: string, dist_cutoff: string, smarts: string, input_type: string): Observable<any> {
    const formData = new FormData();
    const params = new HttpParams()
    .set('numsel', num_cutoff)
    .set('cutoff', dist_cutoff);
    
    if (input_type == 'file') {
      formData.append('SDF', this.search.file);
      const url: string = environment.baseUrl_search + 'space/' + space_name + '/version/' + version;
      return this.http.put(url, formData, {params : params} );

    }
    if (input_type == 'smarts') {
      formData.append('SMARTS', smarts);
      const url: string = environment.baseUrl_search + 'space/' + space_name + '/version/' + version + '/smarts';
      return this.http.put(url, formData, {params : params} );
    }
  }

}
