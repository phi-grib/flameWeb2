import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit} from '@angular/core';
import { Similarity } from '../Globals';
import { SimilarityService} from './similarity.service';
import * as SmilesDrawer from 'smiles-drawer';
import { Model, Prediction } from '../Globals';
// import 'jquery';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-similarity',
  templateUrl: './similarity.component.html',
  styleUrls: ['./similarity.component.css']
})
export class SimilarityComponent implements OnInit, AfterViewInit {

  num_cutoff = '10';
  dist_cutoff = '0.7';

  constructor(public similarity: Similarity,
    private service: SimilarityService,
    public prediction: Prediction,
    private model: Model) { }

  @ViewChildren('cmp') components: QueryList<ElementRef>;
  objectKeys = Object.keys;
  fileContent: any;
  spaces: {};
  space: string = undefined;
  molsXspace = {};
  version: string = undefined;
  predicting = false;
  result = [];
  smileSrc = [];
  nameSrc = [];
  error = false;
  error_message = '';

  ngOnInit() {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.model.trained = false;

    this.spaces = {};
    this.service.getSpaces().subscribe(
      result => {
        if (result[0]) {
          for (const space of result[1]) {
            for (const version of space.versions) {
              this.service.getInfo(space.spacename, version).subscribe(
                result2 => {
                  if (!(space.spacename in  this.spaces)) {
                    this.spaces[space.spacename] = [];
                  }
                  this.spaces[space.spacename].push(version);
                  this.molsXspace[space.spacename] = result2[0][2];
                },
                error => {
                  this.molsXspace[space.spacename] = 0;
                });
            }
          }
        }
        else {
          alert(result[1])
        }
      },
      error => {
        alert('Unable to retrieve spaces list');
      }
    );
  }

  objID (i, j) {
    const iresult = this.result[i];
    if ('obj_id' in iresult) {
      return (iresult.obj_id[j]);
    }
    else {
      return ('-');
    }
  }

  search() {
     // CAST VERSION
    this.result = [];
    this.nameSrc = [];
    this.smileSrc = [];
    this.predicting = true;
    this.error = false;
    this.service.search(this.space, this.version, this.num_cutoff, this.dist_cutoff).subscribe(
      result => { let iter = 0;
        console.log(result);
        const intervalId = setInterval(() => {
          if (iter < 15) {
            this.checkSearch(result, intervalId);
          } else {
            this.predicting = false;
            this.error = true;
            this.error_message = 'Time out exceeded!'
            clearInterval(intervalId);
          }
          iter += 1;
        }, 4000);
        // this.result = result.search_results;
        // this.nameSrc = result.obj_nam;
        // this.smileSrc = result.SMILES;
      },
      error => {
        alert(error.message);
      }
    );
  }



  checkSearch(searchName, intervalId) {
    this.service.getSearch(searchName).subscribe(
      result => {
        this.result = result.search_results;
        this.nameSrc = result.obj_nam;
        this.smileSrc = result.SMILES;
        clearInterval(intervalId);
      },
      error => {
        if (error.error.code !== 0) {
          this.predicting = false;
          this.error = true;
          this.error_message = error.error.message;
          clearInterval(intervalId);

        }
      }
    );
  }


  public change(fileList: FileList): void {
    const file = fileList[0];
    this.similarity.file = file;
    this.similarity.file_info = {};
    this.similarity.file_info['name'] = file.name;
    this.similarity.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
    const extension = file.name.split('.');
    this.similarity.file_info['type_file'] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;
    fileReader.onloadend = function(x) {
      self.fileContent = fileReader.result;
      self.similarity.file_info['num_mols'] = (self.fileContent.match(/(\$\$\$\$)/g) || []).length;
      const res_array = self.fileContent.match(/>( )*<(.*)>/g);
      const res_dict = {};
      for (const variable of res_array) {
        const value = variable.replace(/[<> ]*/g, '');
        if (value in res_dict) {
          res_dict[value] = res_dict[value] + 1;
        }
        else {
          res_dict[value] = 1;
        }
      }
      self.similarity.file_fields = res_dict;
    };
    fileReader.readAsText(file);
  }

  ngAfterViewInit() {

    this.components.changes.subscribe(
      () => {
        $('#simlarityTable').DataTable().destroy();
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
          $('#simlarityTable').DataTable(settingsObj);
        }
    });
  }
}
