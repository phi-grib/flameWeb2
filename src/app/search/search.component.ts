import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import { Search, Globals, Space } from '../Globals';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {

  @Input() spaceName;
  @Input() spaceVersion;

  constructor(
    public search: Search,
    public space: Space,
    public globals: Globals
  ) { }

  @ViewChildren('cmp') components: QueryList<ElementRef>;

  objID (i, j) {
    const iresult = this.search.result[i];
    if ('obj_id' in iresult) {
      return (iresult.obj_id[j]);
    }
    else {
      return ('-');
    }
  }

  ngAfterViewInit() {

    this.components.changes.subscribe(
      () => {
        $('#similarityTable').DataTable().destroy();

        if (this.components !== undefined) {
          this.components.forEach((child) => {
            const options = {'width': 300, 'height': 150};
            const smilesDrawer = new SmilesDrawer.Drawer(options);
            SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
              smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
              }, function (err) {
                console.log(err);
              });
          });
        }

        const settingsObj: any = {
          dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
          '<"row"<"col-sm-12"tr>>' +
          '<"row"<"col-sm-5"i><"col-sm-7"p>>',
          buttons: [
            { 'extend': 'copy', 'text': 'Copy', 'className': 'btn-primary' , title: ''},
            { 'extend': 'excel', 'text': 'Excel', 'className': 'btn-primary' , title: ''},
            { 'extend': 'pdf', 'text': 'Pdf', 'className': 'btn-primary' , title: ''},
            { 'extend': 'print', 'text': 'Print', 'className': 'btn-primary' , title: ''}
          ]
        };
        
        $('#similarityTable').DataTable(settingsObj);

    });

  }

}
