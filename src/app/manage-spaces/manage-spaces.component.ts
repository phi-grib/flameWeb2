import { Component, OnInit } from '@angular/core';
import { Space, Globals } from '../Globals';
import { SearcherComponent} from '../searcher/searcher.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-spaces',
  templateUrl: './manage-spaces.component.html',
  styleUrls: ['./manage-spaces.component.css']
})
export class ManageSpacesComponent implements OnInit {

  constructor(
    public space: Space,
    public modalService: NgbModal,
    public globals: Globals) { 
  }

  ngOnInit(): void {
  }

  search (spaceName:string, spaceVersion:string) {
    const modalRef = this.modalService.open(SearcherComponent, { windowClass : 'modalClass'});
    modalRef.componentInstance.spaceName = spaceName;
    modalRef.componentInstance.spaceVersion = spaceVersion;
  }

  deleteSpace () {

  }

}
