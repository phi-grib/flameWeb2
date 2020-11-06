import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CuratorService {

  constructor(private http: HttpClient) { }

  SmilesCurator(formData: FormData){
    const url: string = 'https://github.com/phi-grib/SMILES_curation/blob/80231070d9b931a92a30e7ed0a67d5846dc8cccf/curate/curation.py#L295';
    return this.http.post(url, formData);
  }
}


