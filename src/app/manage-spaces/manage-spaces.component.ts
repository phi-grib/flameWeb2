import { Component } from '@angular/core';
import { Space, Globals } from '../Globals';
import { ToastrService } from 'ngx-toastr';
import { SbuilderComponent} from '../sbuilder/sbuilder.component';
import { SearcherComponent } from '../searcher/searcher.component';
import { ManageSpacesService } from './manage-spaces.service';
import { CommonFunctions } from '../common.functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-manage-spaces',
  templateUrl: './manage-spaces.component.html',
  styleUrls: ['./manage-spaces.component.css']
})
export class ManageSpacesComponent {

  constructor(
    public space: Space,
    public modalService: NgbModal,
    public globals: Globals, 
    public func: CommonFunctions, 
    public service: ManageSpacesService,
    public toastr: ToastrService) { 
  }

  newSpaceName = '';

  search (spaceName:string, spaceVersion:string, spaceType: string) {
    const modalRef = this.modalService.open(SearcherComponent, { size: 'lg'});
    modalRef.componentInstance.spaceName = spaceName;
    modalRef.componentInstance.spaceVersion = spaceVersion;
    modalRef.componentInstance.spaceType = spaceType;
  }

  buildSpace(spaceName:string, spaceVersion:string,) {
    // console.log('build space:', spaceName, spaceVersion)
    const modalRef = this.modalService.open(SbuilderComponent, { windowClass : 'modalClass'});
    modalRef.componentInstance.name = spaceName;
    modalRef.componentInstance.version = spaceVersion;
  }

  cloneSpace () {
    this.service.cloneSpace(this.space.spaceName).subscribe(
      result => {
        this.toastr.success('Space \'' + result['spacename'] + ' v.' + result['version'] + '\'', 'CREATED SUCCESFULLY', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
        this.space.spaces = [];
        $('#dataTableSpaces').DataTable().destroy();
        this.func.getSpaceList();
      },
      error => {
        this.toastr.error(error.error.error, 'ERROR', {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
      }
    );
  }

  createSpace(): void {
    const letters = /^[A-Za-z0-9_]+$/;
    if (this.newSpaceName.match(letters) && this.newSpaceName != 'test' ) {
        this.service.createSpace(this.newSpaceName).subscribe(
          result => {
            this.toastr.success('Space ' + this.newSpaceName, 'CREATED', {
              timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
            });
            this.space.spaces = [];
            $('#dataTableSpaces').DataTable().destroy();
            this.space.spaceName = this.newSpaceName;
            this.space.spaceVersion = undefined;
            // this.space.trained = false;
            this.func.getSpaceList();
          },
          error => {
              this.toastr.error(error.error.error, 'ERROR', {
                timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
              });
          }
        );
    } else {
        alert('Invalid name! Valid names must contain only letters, numbers and underlines. The special name "test" is not allowed');
    }
  }

  deleteSpace () {
    this.service.deleteSpace(this.space.spaceName).subscribe(
      result => {
        this.toastr.success( 'Space ' + this.space.spaceName + ' deleted', 'DELETED' , {
          timeOut: 4000, positionClass: 'toast-top-right', progressBar: true
        });
        this.space.spaces = [];
        $('#dataTableSpaces').DataTable().destroy();
        this.space.spaceName = undefined ;
        this.space.spaceVersion = undefined;
        this.func.getSpaceList();
      },
      error => {
        alert('Delete ERROR');
      }
    );
  }

  deleteSpaceVersion() {
    this.service.deleteVersion(this.space.spaceName, this.space.spaceVersion).subscribe(
      result => {
        this.toastr.success( 'Space ' + this.space.spaceName + '.v' + this.space.spaceVersion + ' deleted', 'DELETED', {
          timeOut: 4000, positionClass: 'toast-top-right'
        });
        
        this.space.spaces = [];
        $('#dataTableSpaces').DataTable().destroy();
        this.space.spaceVersion = undefined;
        this.func.getSpaceList();
      },
      error => {
        this.toastr.error( 'Space ' + this.space.spaceName + '.v' + this.space.spaceVersion + ' NOT deleted', 'ERROR', {
          timeOut: 4000, positionClass: 'toast-top-right'
        });
      }
    );

  }

}
