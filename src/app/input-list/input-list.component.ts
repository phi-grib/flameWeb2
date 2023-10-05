import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
import * as SmilesDrawer from 'smiles-drawer';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.css']
})
export class InputListComponent implements OnInit {

  basket_list = [];
  inputListName = 'input_list';
  basket_newest = undefined;
  basket_selected = undefined;
  compound_list = [];
  isvalidSeries = true;
  objectKeys = Object.keys;

  constructor(
    public commonService: CommonService,
    public service: PredictorService,
    private compound: Compound,
  ) { }

  ngOnInit(): void {
    this.refresh_list();
    this.commonService.currentCompoundTab$.subscribe( tab => {
      if(tab == 'input-list-tab') {
        setTimeout(() => {
          this.show_basket();
        }, 200);
      }  
    });
  }
  Save() {
    // const item = parseInt(this.basket_selected.substring(0, 1));
    this.compound.listCompoundsSelected = [];
    if (this.isvalidSeries) {
      this.compound.input_list = {
        name: this.inputListName,
        result: this.compound_list,
      };
      this.compound.input_list['result'].forEach(compound =>{
        this.compound.listCompoundsSelected.push(compound.name)
      })
      this.commonService.setIsvalidCompound(true);
      this.cleanOtherOptions();
    }
  }
  show_basket() {
    if (this.basket_list.length) {
      const item = parseInt(this.basket_selected.substring(0, 1));
      this.service.getBasket(item).subscribe((result) => {
        var tbl = <HTMLTableElement>document.getElementById('tableInputList');

        for (var i = 0; i < tbl.rows.length; ) {
          tbl.deleteRow(i);
        }

        this.compound_list = result.compounds;

        var ismiles = '';
        var canvasid = '';
        var seq = 1;
        this.compound_list.forEach(function (compound) {
          ismiles = compound.smiles;
          canvasid = 'inputlist' + seq;

          const tr = tbl.insertRow();

          const tdname = tr.insertCell();
          tdname.appendChild(document.createTextNode(compound.name));
          tdname.setAttribute('style', 'align-left');

          const tdsmiles = tr.insertCell();
          tdsmiles.setAttribute('class', 'align-middle text-center');
          const img = document.createElement('img');

          tdsmiles.appendChild(img);
          img.setAttribute('id', canvasid);
          img.setAttribute('data-smiles',ismiles)
          img.setAttribute('data-smiles-options','{ width: 200, height: 125 }')

          seq += 1;
        });
        SmilesDrawer.SmiDrawer.apply();
      });
    }
  }
  seriesNameChange() {
    this.isvalidSeries = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!this.inputListName.match(letters) || this.inputListName == '') {
      this.isvalidSeries = false;
    }
  }
  refresh_list() {
    this.service.getBasketList().subscribe(
      (result) => {
        const raw_list = result['basket_list'];
        this.basket_newest = result['newest'];
        this.basket_list = [];
        for (const line of raw_list) {
          const linestr = line[0] + ' | ' + line[1];
          this.basket_list.push(linestr);
        }
        this.basket_selected = this.basket_list[this.basket_newest];
      },
      (error) => {
        alert('unable to get input lists!');
      }
    );
  }
  cleanOtherOptions() {
    this.compound.sketchstructure = undefined;
    this.compound.input_file = undefined;
  }
}
