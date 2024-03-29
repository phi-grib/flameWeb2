import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}

  //
  private activeDownload = new Subject<boolean>();
  activeDownload$ = this.activeDownload.asObservable();
  private defaultName = new Subject<any>();
  defaultName$ = this.defaultName.asObservable()
  //communicates to the component in charge of displaying the prediction, which molecule should present and which model 
  private idxmodelmol = new Subject<any>();
  idxmodelmol$ = this.idxmodelmol.asObservable();
  // communicate to distant component that makes a call to getPrediction
  private predictionActive = new Subject<string>();
  predictionActive$ = this.predictionActive.asObservable();
  //checks if the modal where the component list is displayed or hidden
  private statusModelTab = new BehaviorSubject<boolean>(false);
  statusModelTab$ = this.statusModelTab.asObservable();
  //observables to communicate to components without parent-child or sibling relationship, on current values
  private currentCompoundTab = new Subject<string>();
  currentCompoundTab$ = this.currentCompoundTab.asObservable();
  // check if the selected compound is valid
  private isValidCompound = new BehaviorSubject<boolean>(false);
  isValidCompound$ = this.isValidCompound.asObservable();
  // communicates to the component containing the list of models, which models should be selected
  private loadCollection = new Subject<{}>();
  loadCollection$ = this.loadCollection.asObservable();
  //control the pagination
  private controlPagination = new Subject<boolean[]>();
  controlPagination$ = this.controlPagination.asObservable();
  // search results completed
  private searchCompleted = new Subject<boolean>();
  searchCompleted$ = this.searchCompleted.asObservable();
  
  /**
   * Retrives the list of all models form the server
   */
  getModelList(): Observable<any> {
    const url: string = environment.baseUrl_manage + "models";
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
  setPredictName(predictName: any){
    this.predictionActive.next(predictName)
  }
  setStatusModelTab(status: boolean){
    this.statusModelTab.next(status)
  }
  setCurrentCompoundTab(compoundTab: string) {
    this.currentCompoundTab.next(compoundTab);
  }
  setIsvalidCompound(valid: boolean) {
    this.isValidCompound.next(valid);
  }
  setMolAndModelIndex(molidx:number,modelidx:number) {
    this.idxmodelmol.next([molidx,modelidx]);
  }
  setCollection(collection: object){
    this.loadCollection.next(collection);
  }
  setPagination(noPreviousMol:boolean,noNextMol:boolean){
    this.controlPagination.next([noPreviousMol,noNextMol])
  }
  checkDefaultName(){
    this.defaultName.next()
  }
  ActiveDownload(){
    this.activeDownload.next(true)
  }
  setSearchCompleted(){
    this.searchCompleted.next(true)
  }
}
