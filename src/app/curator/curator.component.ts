import { Component, OnInit } from '@angular/core';
import { CuratorService } from './curator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCuratedListComponent } from '../edit-curated-list/edit-curated-list.component';

@Component({
  selector: 'app-curator',
  templateUrl: './curator.component.html',
  styleUrls: ['./curator.component.css']
})
export class CuratorComponent implements OnInit {

  constructor(private service: CuratorService,
    private modalCuratorService: NgbModal) { }

  ngOnInit(): void {
  }

  curationSettings() {
    const modalRef = this.modalCuratorService.open(EditCuratedListComponent, { windowClass : 'modalClass'});

  }
}
