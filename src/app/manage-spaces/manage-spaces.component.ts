import { Component } from '@angular/core';
import { Space, Globals } from '../Globals';
import { ToastrService } from 'ngx-toastr';
import { SearcherComponent } from '../searcher/searcher.component';
import { ManageSpacesService } from './manage-spaces.service';
import { CommonFunctions } from '../common.functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import 'datatables.net-bs4';
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

  search (spaceName:string, spaceVersion:string) {
    const modalRef = this.modalService.open(SearcherComponent, { size: 'lg'});
    modalRef.componentInstance.spaceName = spaceName;
    modalRef.componentInstance.spaceVersion = spaceVersion;
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
        // this.space.spaceName = this.space.spaceName;
        this.space.spaceVersion = '0';
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
