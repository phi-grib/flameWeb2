import { Component, OnInit } from '@angular/core';
import { Search, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { SearcherService } from './searcher.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Renderer2 } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css']
})
export class SearcherComponent implements OnInit {

  objectKeys = Object.keys;
  spaces: {};
  spaceName = '';
  spaceVersion = '0';
  sketchName = 'sketched_mol';
  num_cutoff = 10;
  dist_cutoff = 0.7;
  error = false;
  error_message = undefined;
  file = undefined;
  isvalidSketch = true;
  constructor(public service: SearcherService,
              private commonService: CommonService,
              private func: CommonFunctions,
              private renderer2: Renderer2,
              public activeModal: NgbActiveModal,
              public search: Search,
              public globals: Globals,
              private toastr: ToastrService) { }

  ngOnInit() {

    // inject into the HTML code these two scripts required by JSME
    const jsme_script = this.renderer2.createElement('script');
    jsme_script.type = 'text/javascript';
    jsme_script.src = 'assets/jsme/jsme.nocache.js';
    jsme_script.text = ``;
    this.renderer2.appendChild(document.body, jsme_script);

    const jsme_init = this.renderer2.createElement('script');
    jsme_init.type = 'text/javascript';
    jsme_init.src = 'assets/jsme/initQuery.js';
    jsme_init.text = ``;
    this.renderer2.appendChild(document.body, jsme_init);

    this.search.searchName = undefined;
    this.search.result = undefined;

  }

  public change(fileList: FileList): void {
    const file = fileList[0];
    this.search.file = file;
  }

  sketchNameChange() {
    this.isvalidSketch = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.sketchName.match(letters)) || this.sketchName=='') {
      this.isvalidSketch = false;
    }
  }


  search_structure () {
    var span = document.getElementById("molclipboard");
    var smiles = span.innerText;

    if (smiles===''){
      alert('no molecule entered!')
      return;
    }

    this.activeModal.close('Close click');
    if (this.spaceName != '') {
      const inserted = this.toastr.info('Running!', 'Search ' + this.searchName , {
        disableTimeOut: true, positionClass: 'toast-top-right'});

      this.service.runsearch(this.spaceName, this.spaceVersion, this.num_cutoff.toString(), this.dist_cutoff.toString(), smiles, 'smarts').subscribe(
        result => {
          this.search.searchName = result
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.checkSearch(result, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Search ' + this.searchName + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter += 1;
          }, 500);
        },
        error => {
          this.toastr.clear(inserted.toastId);
          alert('Error prediction: '+error.error.error);
        }
      );
    }
    else {
      alert('Space name undefined!')
    }
  }

  search_file() {
    this.activeModal.close('Close click');
    if (this.spaceName != '') {
      const inserted = this.toastr.info('Running!', 'Search ' + this.searchName , {
        disableTimeOut: true, positionClass: 'toast-top-right'});

      this.service.runsearch(this.spaceName, this.spaceVersion, this.num_cutoff.toString(), this.dist_cutoff.toString(), '', 'file').subscribe(
        result => {
          this.search.searchName = result
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.checkSearch(result, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Search ' + this.searchName + ' \n Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter += 1;
          }, 500);
        },
        error => {
          this.toastr.clear(inserted.toastId);
          alert('Error prediction: '+error.error.error);
        }
      );
    }
    else {
      alert('Space name undefined!')
    }
  }

  checkSearch(searchName, inserted, intervalId) {
    this.commonService.getSearch(searchName).subscribe(
      result => {
        // console.log(result)
        this.search.result = result.search_results;
        this.search.nameSrc = result.obj_nam;
        this.search.smileSrc = result.SMILES;
        clearInterval(intervalId);
        this.toastr.clear(inserted.toastId);
        this.toastr.success('Search ' + this.searchName + ' finished' , 'SEARCH COMPLETED', {
          timeOut: 2000, positionClass: 'toast-top-right'});
        
      },
      error => {
        if (error.error.code !== 0) {
          this.toastr.clear(inserted.toastId);
          clearInterval(intervalId);
          alert('Error search: '+error.error.error);
        }
      }
    );
  }

}
