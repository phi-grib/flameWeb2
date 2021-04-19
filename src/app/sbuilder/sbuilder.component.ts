import { Component, OnInit } from '@angular/core';
import { Space, Globals } from '../Globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SbuilderService } from './sbuilder.service';
import { CommonService } from '../common.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-sbuilder',
  templateUrl: './sbuilder.component.html',
  styleUrls: ['./sbuilder.component.css']
})
export class SbuilderComponent implements OnInit {

  constructor(
    public space: Space,
    public activeModal: NgbActiveModal,
    private commonService: CommonService,
    private toastr: ToastrService,
    private service: SbuilderService,
    private func: CommonFunctions
    ) {}

  ngOnInit(): void {
    this.getParameters();
  }

  getParameters(): void {
    this.commonService.getSpaceParameters(this.space.spaceName, this.space.spaceVersion).subscribe(
      result => {
        this.space.parameters = result;
      },
      error => {
        alert(error.status + ' : ' + error.statusText);
      }
      );
  }
    

 //returns true if v is a dictionary
 private isDict(v) {
  return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
}


//reads all the targeted fields in dictionary at all levels, returns a new dictionary with those values
private recursiveDelta(dict_in: {}) {
  let dict_aux = {};
  const dict_out = {};
  for (const key of Object.keys(dict_in)) {
    dict_aux = dict_in[key];
    for (const key2 of Object.keys(dict_aux)) {
      if (key2 === 'value') {
        if (this.isDict(dict_aux[key2])) {
          dict_out[key] = this.recursiveDelta(dict_aux[key2]);
        } else {
          if (dict_aux[key2] === '' || dict_aux[key2] === 'null') {
            dict_aux[key2] = null;
          }
          dict_out[key] = dict_aux[key2];
        }
      }
    }
  }
  return dict_out;
}

//builds a space using the parameters in this.space.parameters
buildSpace(name, version): void {
  this.space.delta = {};
  this.space.delta = this.recursiveDelta(this.space.parameters);
  // console.log(this.space.delta);

  // this.space.listspaces[name + '-' + version] = {
  //   name: name, version: version, trained: false, numMols: '-',
  //   variables: '-', type: '-', quality: {}, quantitative: false, conformal: false, ensemble: false
  // };

  // this.space.spaceName = undefined;

  const inserted = this.toastr.info('Building', 'space ' + name + '.v' + version, {
    disableTimeOut: true, positionClass: 'toast-top-right'
  });

  this.activeModal.close('Close click');


  this.service.buildSpace().subscribe(
    result => {
      let iter = 0;
      const intervalId = setInterval(() => {
        if (iter < 500) {
          this.checkspace(name, version, inserted, intervalId);
        } else {
          clearInterval(intervalId);
   
          this.toastr.clear(inserted.toastId);
          this.toastr.warning('space ' + name + '.v' + version + ' \n ', 'Interactive timeout exceeded, check latter...', {
            timeOut: 10000, positionClass: 'toast-top-right'
          });
        }
        iter += 1;
      }, 1000);
    },
    error => {
      $('#dataTableSpaces').DataTable().destroy();

      // this.space.listspaces[name + '-' + version].trained = false;
      this.toastr.clear(inserted.toastId);
      this.toastr.error('space ' + name + '.v' + version + ' \n ' + error.error, 'ERROR!', {
        timeOut: 10000, positionClass: 'toast-top-right'
      });
      this.func.getSpaceList();
    }
  );
}

// Periodic function to check space
checkspace(name, version, inserted, intervalId) {
  this.commonService.getSpace(name, version).subscribe(
    result => {

      $('#dataTableSpaces').DataTable().destroy();

      const dict_info = {};
      for (const aux of result) {
        dict_info[aux[0]] = aux[2];
      }
      const quality = {};
      for (const info of (Object.keys(dict_info))) {
        if (typeof (dict_info[info]) === 'number') {
          quality[info] = parseFloat(dict_info[info].toFixed(3));
        }
      }

      this.toastr.clear(inserted.toastId);

      // this.space.listspaces[name + '-' + version] = {
      //   name: name, version: version, spaceID: dict_info['spaceID'], trained: true,
      //   numMols: dict_info['nobj'], variables: dict_info['nvarx'], type: dict_info['space'], quality: quality,
      //   quantitative: dict_info['quantitative'], conformal: dict_info['conformal'], ensemble: dict_info['ensemble']
      // };

      this.toastr.success('space ' + name + '.v' + version + ' created', 'space CREATED', {
        timeOut: 5000, positionClass: 'toast-top-right'
      });

      // use the following code to make sure the new space list will show the space
      // const a = Object.keys(this.space.listspaces).sort();
      // var spaceIndex = a.indexOf(name+'-'+version);
      // this.space.page = Math.floor(spaceIndex/this.space.pagelen);

      this.space.spaceName = name;
      this.space.spaceVersion = version;
      this.func.getSpaceList();
      clearInterval(intervalId);

    },
    error => { // CHECK what type of error
      if (error.error.code !== 0) {
        $('#dataTableSpaces').DataTable().destroy();

        // this.space.listspaces[name + '-' + version].trained = false;
        this.toastr.clear(inserted.toastId);
        this.toastr.error('space ' + name + '.v' + version + ' \n ' + error.error.message, 'ERROR!', {
          timeOut: 10000, positionClass: 'toast-top-right'
        });
        clearInterval(intervalId);

        this.func.getSpaceList();
      }
    }
  );
}




}
