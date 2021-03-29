import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Similarity } from '../Globals';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimilarityService {

  constructor(private http: HttpClient,
    public similarity: Similarity) { }

  getSpaces(): Observable<any> {
    const url: string = environment.baseUrl_smanage + 'spaces';
    return this.http.get(url);
  }

  getSearch(label: string): Observable<any> {
    const url: string = environment.baseUrl_smanage + 'search/' + label;
    return this.http.get(url);
  }
  
  getInfo(label: string, version: number): Observable<any> {
    const url: string = environment.baseUrl_smanage + 'space/' + label + '/version/' + version;
    return this.http.get(url);
  }

  search(space_name: string, version: string, num_cutoff: string, dist_cutoff: string, smarts: string, input_type: string): Observable<any> {
    const formData = new FormData();
    const params = new HttpParams()
    .set('numsel', num_cutoff)
    .set('cutoff', dist_cutoff);
    
    if (input_type == 'file') {
      formData.append('SDF', this.similarity.file);
      const url: string = environment.baseUrl_search + 'space/' + space_name + '/version/' + version;
      // formData.append('SMILES', 'O=C(O)C[C@H](O)C[C@H](O)CCn2c(c(c(c2c1ccc(F)cc1)c3ccccc3)C(=O)Nc4ccccc4)C(C)C');  // check API
      // const url: string = environment.baseUrl_search + 'space/' + space_name + '/version/' + version+'/searchName/ASCCAa'+'/smiles';  // check API
      return this.http.put(url, formData, {params : params} );

    }
    if (input_type == 'smarts') {
      formData.append('SMARTS', smarts);
      const url: string = environment.baseUrl_search + 'space/' + space_name + '/version/' + version + '/smarts';
      return this.http.put(url, formData, {params : params} );
    }

  }

}
