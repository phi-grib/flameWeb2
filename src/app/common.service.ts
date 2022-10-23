import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}

  /**
   * Retrives the list of all models form the server
   */
  getModelList(): Observable<any> {
    const url: string = environment.baseUrl_manage + "models";
    return this.http.get(url);
  }

  getPredictionList(): Observable<any> {
    const url: string = environment.baseUrl_manage + "predictions";
    return this.http.get(url);
  }
  getVerification(model: string, version: number): Observable<any> {
    const url: string = environment.baseUrl_verification + "verification" + "/" + model+'/'+version;
    return this.http.get(url);
  }

  getSpaceList(): Observable<any> {
    const url: string = environment.baseUrl_smanage + "spaces";
    return this.http.get(url);
  }

  getModel(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage + "model/" + model + "/version/" + version;
    return this.http.get(url);
  }

  getModelToken(model: string, token: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage + "model/" + model + "/token/" + token;
    return this.http.get(url);
  }

  getPrediction(predictionName: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage + "prediction/" + predictionName;
    return this.http.get(url);
  }

  getSearch(searchName: string): Observable<any> {
    const url: string = environment.baseUrl_smanage + "search/" + searchName;
    return this.http.get(url);
  }

  getSpace(space: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_smanage + "space/" + space + "/version/" + version;
    return this.http.get(url);
  }

  /**
   * @param modelname The model name to receive parameters
   * Version will be automatically set to 'dev'
   */

  getParameters(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      "model/" +
      model +
      "/version/" +
      version +
      "/parameters";
    return this.http.get(url);
  }

  getDocumentation(
    modelName: string,
    modelVersion: string,
    oformat: string
  ): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      "model/" +
      modelName +
      "/version/" +
      modelVersion +
      "/oformat/" +
      oformat +
      "/documentation";
    return this.http.get(url);
  }

  getValidation(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      "model/" +
      model +
      "/version/" +
      version +
      "/validation";
    return this.http.get(url);
  }

  getProperty(obj, prop) {
    if (obj[prop] !== undefined) return obj[prop];
    else return;
  }

  getSpaceParameters(space: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_smanage +
      "space/" +
      space +
      "/version/" +
      version +
      "/parameters";
    return this.http.get(url);
  }
}
