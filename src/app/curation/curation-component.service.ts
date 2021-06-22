//author: Rodrigo Lorenzo Lorenzo 12-03-2021
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CurationComponentService {
  constructor(private http: HttpClient) {}

  downloadSDFFile(url): any {
    return this.http.get(url, {responseType: 'blob'});
}
}
