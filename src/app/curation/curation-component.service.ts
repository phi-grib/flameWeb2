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

  exportFile(endpoint, oformat): any {
    const url: string = environment.baseUrl_cmanage + "exportFile/" +endpoint + "/format/" +oformat;
    if (oformat == 'sdf' || oformat == "xlsx" || oformat== "csv" || oformat == "tsv" || oformat=='json') {
      var a = document.createElement("a");
      a.href = url;
      a.click();
    }
    else {
      return this.http.get(url);
    }
  }
}
