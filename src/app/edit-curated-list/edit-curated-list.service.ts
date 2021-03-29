import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CuratorComponent } from '../curator/curator.component';



@Injectable({
  providedIn: 'root'
})
export class EditCuratedListService {
    objCuration: CuratorComponent;

  constructor(private http: HttpClient,
    public curator: CuratorComponent) { }

  CurateList(listName: string, date: string, fileString: string){
    const url: string= environment.baseUrl_curate+'curate/'+ listName;
    let formData = new FormData();
    formData.append('date', date);
    formData.append('filename', this.curator.curation.fileName);
    formData.append('fileString', fileString)
    console.log(listName);
    return this.http.post(url, listName);
  }

}
