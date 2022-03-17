import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelerService } from './labeler.service';
import { CommonFunctions } from '../common.functions';
import { Model} from '../Globals';
// import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
declare var $: any;

@Component({
  selector: 'app-labeler',
  templateUrl: './labeler.component.html',
  styleUrls: ['./labeler.component.css']
})
export class LabelerComponent implements OnInit {

  constructor(
    public model: Model,
    public service: LabelerService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public func: CommonFunctions) { 
  }

  labelBackup:any;
  isvalid:boolean;

  labelChange() {
    const imodel = this.model.listModels[this.model.name+'-'+String(this.model.version)];
    // const clabels = ['bio_type', 'bio_subtype', 'bio_endpoint', 'bio_species'];
    const clabels = ['bio_type', 'bio_endpoint', 'bio_species'];
    this.isvalid = true;
    for (let i=0; i<clabels.length; i++) {
      if ((imodel[clabels[i]].length > 15) || (imodel[clabels[i]].length <2)) {
        this.isvalid = false;
        break;
      }
    }
  }

  ngOnInit(): void {
    const imodel = this.model.listModels[this.model.name+'-'+String(this.model.version)];
    this.labelBackup = {
      maturity : imodel.maturity,
      bio_type : imodel.bio_type,
      bio_subtype : imodel.bio_subtype,
      bio_endpoint : imodel.bio_endpoint,
      bio_species : imodel.bio_species
    };
    this.labelChange();
  }

  cancelInput(){
    const imodel = this.model.listModels[this.model.name+'-'+String(this.model.version)];
    imodel.maturity = this.labelBackup.maturity;
    imodel.bio_type = this.labelBackup.bio_type;
    imodel.bio_subtype = this.labelBackup.bio_subtype;
    imodel.bio_endpoint = this.labelBackup.bio_endpoint;
    imodel.bio_species = this.labelBackup.bio_species;
    this.activeModal.close('Close click');
  }

  applyLabels() {
    const imodel = this.model.listModels[this.model.name+'-'+String(this.model.version)];
    let labelDelta = {
      maturity : imodel.maturity,
      type : imodel.bio_type,
      // subtype : imodel.bio_subtype,
      endpoint : imodel.bio_endpoint,
      species : imodel.bio_species
    };
    let delta = JSON.stringify(labelDelta);
    
    // console.log(delta)
    
    this.service.updateLabels(this.model.name, this.model.version, delta).subscribe(
      result => {
        this.func.getModelList();
        this.toastr.success('Model ' + this.model.name + '.v' + this.model.version , 'LABELS UPDATED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      },
      error => {
          alert('Error updating labels: '+error.error.error);
      }
    );
        
    this.activeModal.close('Close click');
  }
      
}
