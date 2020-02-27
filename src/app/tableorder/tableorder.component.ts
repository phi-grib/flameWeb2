import { Component, OnInit } from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';


@Component({
  selector: 'app-tableorder',
  templateUrl: './tableorder.component.html',
  styleUrls: ['./tableorder.component.css']
})
export class TableorderComponent {


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    var settingsObj: any = {
      dom:'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf'
      ]
    }
    var table = $('#example').DataTable(settingsObj);
  
    
  }
}

