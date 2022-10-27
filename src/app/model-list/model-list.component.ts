import { Component, Input, OnInit } from '@angular/core';
import { Model, Prediction, Globals } from '../Globals';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
import 'datatables.net-bs4';
import { CommonService } from '../common.service';
declare var $: any;

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  @Input() DTID;
  @Input() chkbox;

  constructor(
    public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions,
    private commonService: CommonService,
    private toastr: ToastrService) {}
    

  models: Array<any>;
  objectKeys = Object.keys;

  ngOnInit() {
    this.commonService.loadCollection$.subscribe(res => {
      this.checkCollection(res);
    })
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.func.getModelList();
  }
  onChange(name, version, event): void {
    const obj = {
      name: name,
      version: version,
    };
    const isChecked = event.target.checked;
    if (isChecked) {
      this.model.listModelsSelected.push(obj);
    } else {
      this.model.listModelsSelected.splice(
        this.model.listModelsSelected.findIndex(
          (model) => model.name === name && model.version === version
        ),
        1
      );
    }
  }
  selectAll(event) {
    const isChecked = event.target.checked;
    $('#dataTableModelsSelector').DataTable().rows().every(function (idx, tableLoop, rowLoop) {
      var node = this.node()
      let checkbox = node.childNodes[0].childNodes[0]
      if (checkbox.checked != isChecked) checkbox.click();
    });
  }
  checkCollection(collect: Object) {
    var notFound = []
    for (let i = 0; i < collect['endpoints'].length; i++) {
      var found = false
      const element = collect['endpoints'][i] + '-' + collect['versions'][i]
      for (let key in this.model.listModels) {
        if (element == key) {
          found = true
        }
      }
      if (!found) notFound.push(element)
    }
    if (notFound.length > 0) {
      this.toastr.error('Collection ' + collect['name'] + ' \n Contains models not found in the current repository:' + '\n' + notFound, 'Failed', {
        timeOut: 10000, positionClass: 'toast-top-right'
      });
    } else {
      this.loadCollection(collect);
    }
  }
  loadCollection(collect: Object) {
    this.model.listModelsSelected = []
    $('#dataTableModelsSelector').DataTable().rows().every(function (idx, tableLoop, rowLoop) {
      var node = this.node()
      let checkbox = node.childNodes[0].childNodes[0]
      checkbox.checked = false; //first clean all checkboxes
    });

    const self = this;
    $('#dataTableModelsSelector').DataTable().rows().every(function (idx, tableLoop, rowLoop) {
      var data = this.data();
      var node = this.node()
      let checkbox = node.childNodes[0].childNodes[0]
      for (let i = 0; i < collect['endpoints'].length; i++) {
        if (data[2] == collect['endpoints'][i] && data[3] == collect['versions'][i]) {
          checkbox.checked = true;
          const obj = {
            name: data[2],
            version: parseInt(data[3]),
          };
          self.model.listModelsSelected.push(obj)
        }
      }
    });
  }
}
