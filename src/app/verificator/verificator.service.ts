import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: "root",
})
export class VerificatorService {
  constructor(private http: HttpClient) {}
  //MANAGE VERIFICATIONS
  generateVerification(modelName : string, version: number): Observable<any> {
    const url: string  = environment.baseUrl_verification + 'verification/'+modelName +'/'+version;
    return this.http.post(url,null);
  }

  deleteVerification(modelName : string): Observable<any> {
    const url: string  = environment.baseUrl_verification + 'verification/'+modelName;
    return this.http.delete(url,null)
  }

  // REPORT SERVICE 
  generateReport(verificationname: string,verificatorname: string):  Observable<any> {
    const url: string  = environment.baseUrl_verification + 'report/'+verificationname+'/'+verificatorname;
    return this.http.post(url,null)

  }

}
