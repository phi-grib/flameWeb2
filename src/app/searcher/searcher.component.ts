import { Component, OnInit } from '@angular/core';
import { Search, Space, Globals } from '../Globals';
import { CommonService } from '../common.service';
import { SearcherService } from './searcher.service';
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
  spaceType = '';
  sketchName = 'sketched_mol';
  num_cutoff = 10;
  dist_cutoff = 0.7;
  error = false;
  
  // set to undefine and create in ngOnInit based on the space selected type
  // metric = 'tanimoto';
  // distanceList = ['tanimoto', 'euclidean'];
  metric = undefined;
  distanceList = ['tanimoto','euclidean','substructure'];
  validList = { 'tanimoto': false, 'euclidean': false, 'substructure': false}
  
  error_message = undefined;
  file = undefined;
  isvalidSketch = true;
  isSMARTS = false;
  constructor(public service: SearcherService,
              private commonService: CommonService,
              private renderer2: Renderer2,
              public activeModal: NgbActiveModal,
              public search: Search,
              public space: Space,
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

    // console.log ('spaceType', this.spaceType)

    if (this.spaceType == 'fingerprints') {
      this.metric = 'tanimoto' 
      this.validList ['tanimoto'] = true;
    }
    else if (this.spaceType == 'descriptors') {
      this.metric = 'euclidean';
      this.validList ['euclidean'] = true;
    }
    else if (this.spaceType == 'substructure') {
      this.metric = 'substructure';
      this.validList ['substructure'] = true;
    }

    // enclosed in a Timeout to avoid mistakes in other components while loading
    setTimeout(()=> {
      this.search.searchName = undefined;
      this.search.result = undefined;
      this.search.file = undefined;
    }, 0);

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

    var structure_type = 'smiles'
    if (this.isSMARTS) {
      structure_type = 'smarts'
    }

    this.activeModal.close('Close click');
    if (this.spaceName != '') {
      const inserted = this.toastr.info('Running!', 'Search' , {
        disableTimeOut: true, positionClass: 'toast-top-right'});

      this.service.runsearch(this.spaceName, this.spaceVersion, this.num_cutoff.toString(), this.dist_cutoff.toString(), smiles, structure_type, this.sketchName).subscribe(
        result => {
          this.search.searchName = result;

          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.checkSearch(result, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Search Time Out' , 'Warning', {
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
      const inserted = this.toastr.info('Running!', 'Search', {
        disableTimeOut: true, positionClass: 'toast-top-right'});

      this.service.runsearch(this.spaceName, this.spaceVersion, this.num_cutoff.toString(), this.dist_cutoff.toString(), '', 'file', '').subscribe(
        result => {
          this.search.searchName = result
          let iter = 0;
          const intervalId = setInterval(() => {
            if (iter < 500) {
              this.checkSearch(result, inserted, intervalId);
            } else {
              clearInterval(intervalId);
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Search Time Out' , 'Warning', {
                                    timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter += 1;
          }, 1000);
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

        if (result['aborted']) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error("Search task has not completed. Check the browser console for more information", 
            'Aborted', {timeOut: 10000, positionClass: 'toast-top-right'});
          console.log('ERROR report produced by searching task');
          console.log(result['aborted']);
          this.search.searchName = undefined;
          clearInterval(intervalId);
          return;
        }

        if (!result['waiting']){
          this.search.result = result.search_results;
          this.search.nameSrc = result.obj_nam;
          this.search.smileSrc = result.SMILES;
          this.search.metric = result.metric;
          this.search.spaceName = this.spaceName;
          this.search.spaceVersion = this.spaceVersion;
          clearInterval(intervalId);
          this.toastr.clear(inserted.toastId);
          this.toastr.success('Search finished' , 'SEARCH COMPLETED', {
            timeOut: 2000, positionClass: 'toast-top-right'});
          this.commonService.setSearchCompleted();
        }
        
      },
      error => {
        this.toastr.clear(inserted.toastId);
        clearInterval(intervalId);
        alert('Error search: '+error.error.error);
      }
    );
  }

}
