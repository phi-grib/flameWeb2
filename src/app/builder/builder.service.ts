import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Model } from '../Globals';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  constructor(private http: HttpClient, private model: Model) { }


  buildModel(): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', this.model.file);
    formData.append('parameters', JSON.stringify(this.model.delta));
    formData.append('incremental', JSON.stringify(this.model.incremental));
    const url: string = environment.baseUrl_build + 'model/' + this.model.name;
    return this.http.post(url, formData);

  }


  getParametersFromYAML(modelName: string, modelVersion: string){
    const formdata = new FormData();

    // delta is a YAML file, no need to encode
    formdata.append('parameters', this.model.delta)
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/yaml2parameters';
    return this.http.post(url, formdata);
  }

  getYAMLfromParameters(modelName: string, modelVersion: string){
    const formdata = new FormData();

    // delta is a TS object and must be passed as JSON, so it can be interpreted by the Python backend 
    formdata.append('parameters', JSON.stringify(this.model.delta))
    const url: string = environment.baseUrl_manage + 'model/' + modelName + '/version/' + modelVersion + '/parameters2yaml';
    return this.http.post(url, formdata);
  }

}