import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCuratedListComponent } from '../edit-curated-list/edit-curated-list.component';
import { Curation, Globals } from '../Globals';

@Component({
  selector: 'app-curator',
  templateUrl: './curator.component.html',
  styleUrls: ['./curator.component.css']
})
export class CuratorComponent implements OnInit {

curations: any;
  constructor(private commonService: CommonService,
    private modalCuratorService: NgbModal) { }

  ngOnInit(): void {
    this.commonService.getCurations().subscribe(
      result => {
        this.curations = result;
        console.log(this.curations);
      });
    
  }

  curationSettings() {
    const modalRef = this.modalCuratorService.open(EditCuratedListComponent, { windowClass: 'modalClass' });

  }
}
