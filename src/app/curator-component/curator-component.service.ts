import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CuratorComponentService {
  constructor(private http: HttpClient) {}

  //updates an endpoint based on its name and sends the file to be curated in a string json formated
  curateList(
    name: string,
    file: any,
    cas: string,
    smiles: string,
    separator: string,
    remove_problem: string,
    output_format: string,
    metadata:any
  ) {
    const url: string = environment.baseUrl_curate + "curate/" + name;
    const formData = new FormData();
    console.log(name, file, cas, smiles, remove_problem, output_format);
    formData.append("endpoint", name);
    formData.append("data_input", file);
    formData.append("molecule_identifier", cas);
    formData.append("structure_column", smiles);
    formData.append("separator", separator);
    formData.append("remove_problematic", remove_problem);
    formData.append("outfile_type", output_format);
    formData.append("metadata", metadata.toString())
    return this.http.put(url, formData);
  }

  
}
