import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CurationDocumentationService {
  constructor(private http: HttpClient) {}

  //here is where the backend will be called after every selecttion on the datatable
  getDocumentation(name) {
    const url: string = environment.baseUrl_curate + "curate/" + name;
    return this.http.get(url, name);
  }
}
