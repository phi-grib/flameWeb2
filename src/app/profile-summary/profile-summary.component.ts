import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonService } from '../common.service';
import { Prediction, Globals, Model, Profile } from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import 'datatables.net-bs4';
import chroma from "chroma-js";
import { SplitComponent } from 'angular-split';
import { ProfilingService } from '../profiling.service';
import * as XLSX from 'xlsx';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.css']
})
export class ProfileSummaryComponent implements OnInit {
  result: any;
  prevSelection: any = undefined;
  Smodel: number = undefined;
  Smol: number = undefined;
  gamaColor = undefined;
  profileSelected = undefined;
  prevTR = undefined;
  prevTH = undefined;
  profileVisible = false;
  opt2 = {
    autoWidth: true,
    destroy: true,
    paging: true,
    ordering: true,
    searching: true,
    info: true,
  }
  opt = {
    autoWidth: false,
    destroy: true,
    paging: false,
    ordering: true,
    searching: false,
    info: false,
  }
  constructor(
    public prediction: Prediction,
    public commonService: CommonService,
    public func: CommonFunctions,
    public globals: Globals,
    private model: Model,
    private renderer2: Renderer2,
    public profile: Profile,
    private profiling: ProfilingService,
    private clipboard: ClipboardService,
    private toastr: ToastrService,
  ) { }
  ngOnInit(): void {
    this.profiling.summaryActive$.subscribe(pname => {
      this.getProfileSummary(pname)
    })

  }
  showPrediction(event, molIndex, td) {
    const column = event.target._DT_CellIndex.column - 2;
    const modelName = this.profile.summary['endpoint'][column] + '-' + this.profile.summary['version'][column];
    const modelObj = this.model.listModels[modelName];
    if (modelObj) this.prediction.modelID = modelObj['modelID'];

    this.prediction.modelName = this.profile.summary['endpoint'][column];
    this.prediction.modelVersion = this.profile.summary['version'][column];
    this.commonService.setMolAndModelIndex(molIndex, column);
    this.selectedClass(event, td);
    $('#container-pred').show()
  }
  /**
   * Function to add specific styles to the selected prediction.
   * @param event 
   * @param td 
   */
  selectedClass(event, td) {
    if ((this.Smol, this.Smodel) != undefined) {
      this.renderer2.setStyle(this.Smol, 'background', 'white')
      $('#dataTablePrediction thead th:eq(' + this.Smodel + ')').css("background", 'white');
    }
    this.Smodel = event.target._DT_CellIndex.column;
    this.Smol = td;
    this.renderer2.setStyle(td, 'background', '#f7f9ea')
    $('#dataTablePrediction thead th:eq(' + this.Smodel + ')').css("background", '#f7f9ea');

    if (this.prevSelection) this.prevSelection.classList.remove('pselected');
    this.prevSelection = event.target;
    event.target.classList.add('pselected');

  }
  @ViewChild('mySplit') mySplitEl: SplitComponent
  // area size
  _size1 = 100;
  _size2 = 0;
  get size1() {
    return this._size1;
  }

  set size1(value) {
    this._size1 = value;
  }
  get size2() {
    return this._size2;
  }

  set size2(value) {
    this._size2 = value;
  }
  gutterClick(e) {
    if (e.gutterNum === 1) {
      if (e.sizes[1] == 100) {
        this.size1 = 100;
        this.size2 = 0;
      }
    }
  }
  getProfileSummary(pname) {
    this.profile.summary = undefined;
    this.profile.name = pname;
    this.profileVisible = false;
    setTimeout(() => {
      this.profiling.profileSummary(this.profile.name).subscribe(
        (res) => {
          if (res) {
            this.profile.summary = res;
            this.escaleColor();
            $('#dataTablePrediction').DataTable().destroy();
            $('#dataTablePrediction').DataTable().clear().draw();
            setTimeout(() => {
              $('#dataTablePrediction').DataTable(this.opt)
              this.addStructure();
              this.caption();
              this.profileVisible = true;
            }, 20);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }, 500)
  }
  deleteProfile() {
    this.profiling.deleteProfile(this.profile.name).subscribe(
      result => {
        this.profile.name = undefined;
        this.profile.summary = undefined;
        this.profile.item = undefined;
        this.toastr.success( 'Profile "' + this.profile.name + '" deleted', 'DELETED' , {
          timeOut: 500, positionClass: 'toast-top-right', progressBar: false});

        this.func.getProfileList();
      },
      error => {
        alert('Delete ERROR');
      }
    );
  }
  addStructure() {
    var options = { width: 100, height: 75 }
    const smilesDrawer = new SmilesDrawer.Drawer(options);

    console.log("here")
    console.log(this.profile.summary["obj_num"])
    for (let i = 0; i < this.profile.summary["obj_num"]; i++) {
      let td = document.getElementById("canvas" + i)
      const icanvas = document.createElement('canvas');
      td.appendChild(icanvas)
      SmilesDrawer.parse(
        this.profile.summary['SMILES'][i],
        function (tree) {
          smilesDrawer.draw(tree, icanvas, 'light', false);
        },
        function (err) {
          console.log(err);
        }
      );
    }
  }

  /**
   *Function that formats the data to generate excel,pdf
   * 
   */
  formatData(pdf: boolean): Array<[]> {
    var data = [];
    for (let i = 0; i < this.profile.summary['obj_nam'].length; i++) {
      var auxData = []
      const compound = this.profile.summary['obj_nam'][i];
      const smiles = this.profile.summary['SMILES'][i];
      auxData.push(compound, smiles)
      for (let y = 0; y < this.profile.summary['endpoint'].length; y++) {

        var value = this.profile.summary['values'][i][y].toFixed(2)
        if(pdf){
        if (!this.profile.summary['quantitative'][y]) {
          switch (value) {
            case 0:
              value = "Negative"
              break;
            case 1:
              value = 'Positive'
              break;
            default:
              value = "Uncertain"
              break;
          }

        }
      }
        else {
          if (value > 1 || value < 0) value = value.toFixed(2)
        }

        auxData.push(value)
      }
      data.push(auxData)
    }
    return data
  }
  savePDF() {
    const doc = new jsPDF();
    var data = this.formatData(true);
    autoTable(doc, {
      head: [['Compound', 'Structure', ...this.profile.summary.endpoint]],
      body: data,
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 60 },

      },
      styles: {
        halign: 'center'
      },
    })
    doc.text(this.profile.name, 15, 10)
    doc.save(this.profile.name + '.pdf');
  }
  saveEXCEL() {
    var data = this.formatData(false)
    const xls = Object.assign([], data);
    var head = [['Compound'], ['Structure'], ...this.profile.summary.endpoint]
    xls.splice(0, 0, head);
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(xls);
    ws['!cols'] = [{ width: 15 }, { width: 50 }];
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.profile.name + '.xlsx');
  }

  formatCopyText() {
    var data = this.formatData(false);
    var header = "Compound" + "\t" + "Structure"
    this.profile.summary.endpoint.forEach(model => {
      header = header + "\t" + model
    });
    var bodyText = ""
    for (let i = 0; i < data.length; i++) {
      // const element = array[i];
      for (let y = 0; y < data[i].length; y++) {
        bodyText = bodyText + data[i][y] + "\t"
      }
      bodyText = bodyText + "\n"
    }
    var text = header + "\n" + bodyText
    return text;
  }
  copy() {
    var text = this.formatCopyText();
    this.clipboard.copyFromContent(text);
  }
  /**
   * to do 
   */
  print() {


  }
  renderSort(event) {
    var pos = event.childNodes.length - 2;
    if (this.prevTH) {
      var oldPos = this.prevTH.childNodes.length - 2
      this.prevTH.childNodes[oldPos].classList.remove('text-dark')
      this.prevTH.childNodes[oldPos + 1].classList.remove('text-dark')
      this.prevTH.childNodes[oldPos].classList.add('text-secondary')
      this.prevTH.childNodes[oldPos + 1].classList.add('text-secondary')
    }
    let status = event.getAttribute('aria-label')
    if (status.includes('asc')) {
      event.childNodes[pos].classList.remove('text-secondary')
      event.childNodes[pos].classList.add('text-dark')
      event.childNodes[pos + 1].classList.remove('text-dark')
      event.childNodes[pos + 1].classList.add('text-secondary')
    } else {
      event.childNodes[pos].classList.remove('text-dark')
      event.childNodes[pos].classList.add('text-secondary')

      event.childNodes[pos + 1].classList.remove('text-secondary')
      event.childNodes[pos + 1].classList.add('text-dark')
    }
    this.prevTH = event
  }
  setColor(value) {
    var chr = chroma.scale('RdBu').domain([0, 6]); // we expect values from 3 to 9
    return chr(value)._rgb
  }
  caption() {
    var table = $("#caption")[0]
    for (var i = 0, row; row = table.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        var rgb = this.setColor(9 - col.innerText)
        col.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
      }
    }
  }
  /**
   * modifies the "profileSummary" array to add a new field 
   * where you set the color that belongs to the field
   */
  escaleColor() {
    var globalArr = []
    for (let i = 0; i < this.profile.summary.values.length; i++) {
      var arrValues = []
      for (let y = 0; y < this.profile.summary.endpoint.length; y++) {
        if (this.profile.summary.quantitative[y]) {
          let val = this.profile.summary.values[i][y];
          // convert 3 to 6 (blue), 9 to 0 (red)
          arrValues[y] = this.setColor(9 - val)
        } else {
          arrValues[y] = -1
        }
      }
      globalArr[i] = arrValues
    }
    this.profile.summary['escaleColor'] = globalArr
  }

  castValue(value: number, column?: number) {
    if (this.profile.summary['quantitative'][column]) return value.toFixed(1);
    return value == 1 ? 'Positive' : value == 0 ? 'Negative' : 'Uncertain';
  }

}
