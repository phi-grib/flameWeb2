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

  remove_building_space (name, version){
    const index = this.space.building_spaces.indexOf(name + '-' + version, 0);
    if (index > -1) {
      this.space.building_spaces.splice(index, 1);
    }
  }

  //builds a space using the parameters in this.space.parameters
  buildSpace(name, version): void {
    this.space.delta = {};
    this.space.delta = this.recursiveDelta(this.space.parameters);
    
    const inserted = this.toastr.info('Building', 'space ' + name + '.v' + version, {
      disableTimeOut: true, positionClass: 'toast-top-right'
    });

    this.activeModal.close('Close click');

    // add this space to the list of spaces being built
    this.space.building_spaces.push(name + '-' + version);

    // empty the description of this space while it is being built
    // for (var i in this.space.spaces) {
    //   const ispace = this.space.spaces[i];
    //   if (ispace[0] == name && ispace[1] == version) {
    //     this.space.spaces[i] = [name, version];
    //     break;
    //   }
    // }

    // call buildSpace service
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
        }, 2000);
      },
      error => {
        this.remove_building_space(name, version);
        this.space.spaces = [];
        $('#dataTableSpaces').DataTable().destroy();

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
        this.toastr.clear(inserted.toastId);

        this.remove_building_space(name, version);
        this.space.spaces = [];
        this.space.spaceName = name;
        this.space.spaceVersion = version;
        $('#dataTableSpaces').DataTable().destroy();

        this.toastr.success('space ' + name + '.v' + version + ' created', 'space CREATED', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });

        this.func.getSpaceList();

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

        clearInterval(intervalId);

      },
      error => { // CHECK what type of error
        if (error.error.code !== 0) {
          this.remove_building_space (name, version)
          this.space.spaces = [];
          $('#dataTableSpaces').DataTable().destroy();

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
