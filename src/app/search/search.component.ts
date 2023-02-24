import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, OnChanges, Input } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import { Search, Globals, Space } from '../Globals';
import { CommonService } from '../common.service';
import { CustomHTMLElement } from '../Globals';
import * as PlotlyJS from 'plotly.js-dist-min';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit, OnChanges {
  
  @Input() spaceName;
  @Input() spaceVersion;
  
  constructor(
    public search: Search,
    public space: Space,
    public globals: Globals,
    public commonService: CommonService
    ) { }
    
    @ViewChildren('cmp') components: QueryList<ElementRef>;
    
    noNextMol = false;
    noPreviousMol = true;
    molIndex = 0;
    numMol = 1;
    SMILES = [];

    plotRA = {
      data : [{
        x: [],
        y: [],
        text: [],
        meta: [],
        type: 'scatter',
        mode: 'markers', 
        marker: {
          color: [],
          colorscale: 'RdBu',
          showscale: true,
          cauto: false,
          cmin: 0,
          cmax: 1,
          size: 10
        },
        // hovertemplate:'%{y:.2f}<text></text>'
        hovertemplate:'<b>%{text}</b><extra></extra>'
        }
      ],
      layout : {
        width: 600,
        height: 500,
        // margin: {r: 10, t: 30, b:0, pad: 0 },
        barmode: 'relative',
        hovermode: 'closest',
        hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 } },
        xaxis: {
          range: [-1.2, 1.2],
          zeroline: true,
          zerolinewidth: 2,
          zerolinecolor: 'black',
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          tickvals: [-1.0, 1.0],
          ticktext: ['negative', 'positive']
        },
        yaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          automargin: true
        },
        showlegend: false
      },
      config: {
        displaylogo: false,
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'flame_combo',
          width: 700,
          height: 500,
        },
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
      }
    }

  NextMol() {
    if (this.molIndex == this.numMol-1) {
      this.noNextMol=true;
    }
    else {
      this.noPreviousMol=false;
      this.molIndex+=1;
      this.noNextMol= (this.molIndex == this.numMol -1 ) ;
    }
    this.updateRA(this.molIndex);
  }

  PreviousMol() {
    if (this.molIndex == 0) {
      this.noPreviousMol=true;
    }
    else {
      this.noNextMol=false;
      this.molIndex-=1;
      this.noPreviousMol=(this.molIndex == 0);
    }
    this.updateRA(this.molIndex);
  }

  showDistance() {
    if (this.search.result == undefined) {
      return false;
    }
    if (this.search.metric!='substructural' && this.search.metric!='smarts') {
      return true;
    }
    return false;
  }

  showActivity() {
    if (this.search.result == undefined) {
      return false;
    }
    if ('ymatrix' in this.search.result[0]) {
      return true;
    }
    return false;
  }

  objID (i, j) {
    const iresult = this.search.result[i];
    if ('obj_id' in iresult) {
      return (iresult.obj_id[j]);
    }
    else {
      return ('-');
    }
  }

  updateRA (i) {
    const iresult =this.search.result[i];

    this.SMILES = this.search.result[i].SMILES;
    // let SMILESsrc = this.search.smileSrc[i];

    this.plotRA.data[0].marker.color = iresult.ymatrix;
    let isBinary = true;
    for (let i=0; i<iresult.ymatrix.length; i++) {
      if (iresult.ymatrix[i]!==1.0 && iresult.ymatrix[i]!==0.0) {
        isBinary = false;
        break;
      }
    }

    //TODO: change style depending if data is qualitative or quantitative
    if (isBinary) {
      for (let i=0; i<iresult.ymatrix.length; i++) {
          this.plotRA.data[0].x[i] = iresult.ymatrix[i] * 2 -1 ;
      }
      this.plotRA.data[0].marker.cauto = false;
      this.plotRA.data[0].marker.cmin = 0;
      this.plotRA.data[0].marker.cmax = 1;
      this.plotRA.layout.xaxis.range = [-1.2, 1.2];
    }
    else {
      this.plotRA.data[0].x = iresult.ymatrix;
      this.plotRA.data[0].marker.cauto = true;
      this.plotRA.layout.xaxis.range = [Math.min(iresult.ymatrix)*0.9,Math.max(iresult.ymatrix)*1.1];
      // this.plotRA.layout.xaxis.tickfont = {family: 'Barlow Semi Condensed, sans-serif', size: 16 };
    }

    // var update = {'visible':[true, false]}
    // if (value == 'density') {
    //   update = {'visible':[false, true]}
    // }
    // if (value == 'both') {
    //   update = {'visible':[true, true]}
    // }
    // PlotlyJS.restyle('scoresDIV', update);

    this.plotRA.data[0].y = iresult.distances;
    this.plotRA.data[0].text = iresult.obj_nam;
    this.plotRA.data[0].meta = iresult.SMILES;

    PlotlyJS.react('ra_plot', this.plotRA.data, this.plotRA.layout, this.plotRA.config);

    this.drawSource(this.search.smileSrc[i]);

  }

  drawSource (SMILESsrc) {
    const sourceSmilesDrawer = new SmilesDrawer.Drawer({'width': 300, 'height': 200});
    SmilesDrawer.parse(SMILESsrc, function(tree) {
      sourceSmilesDrawer.draw(tree, 'ra_source', 'light', false);
    });
  }

  ngOnChanges(): void {
    this.commonService.searchCompleted$.subscribe(()=>{
      this.numMol = this.search.nameSrc.length;
      this.molIndex = 0;
      this.noNextMol = (this.numMol == 1);
      this.noPreviousMol = true;
      this.SMILES = [];
      
      this.updateRA(0);  
      
      PlotlyJS.newPlot('ra_plot', this.plotRA.data, this.plotRA.layout, this.plotRA.config);
      
      let myRAPlot = <CustomHTMLElement>document.getElementById('ra_plot');

      const canvas = <HTMLCanvasElement>document.getElementById('ra_canvas');
      const options = {'width': 300, 'height': 200};
      const smilesDrawer = new SmilesDrawer.Drawer(options);
      
      let my =  this;
      myRAPlot.on('plotly_hover', function(eventdata){ 
        var points = eventdata.points[0];
        SmilesDrawer.parse(my.SMILES[points.pointNumber], function(tree) {
          smilesDrawer.draw(tree, 'ra_canvas', 'light', false);
        });
      });
      
      // on onhover, clear the canvas
      myRAPlot.on('plotly_unhover', function(data){
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      });
      


      // trick to show the screen after the tab change, when the canvas was already not rendered
      let me = this;
      $(document).on('shown.bs.tab', function (e) { 	
        var target = $(e.target).attr("href");
        if (target=='#pills-search-two') {
          me.drawSource(me.search.smileSrc[0]);
        }
       });
      
    }
    );
  }
  
  ngAfterViewInit() {
    
    this.components.changes.subscribe(() => {

      $('#similarityTable').DataTable().destroy();
      if (this.components !== undefined) {
        const options = {'width': 300, 'height': 150};
        const smilesDrawer = new SmilesDrawer.Drawer(options);
        this.components.forEach((child) => {
          SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
            smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
            }, function (err) {
              console.log(err);
            });
        });
      }

      const settingsObj: any = {
        dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
        '<"row"<"col-sm-12"tr>>' +
        '<"row"<"col-sm-5"i><"col-sm-7"p>>',
        buttons: [
          { 'extend': 'copy', 'text': 'Copy', 'className': 'btn-primary' , title: ''},
          { 'extend': 'excel', 'text': 'Excel', 'className': 'btn-primary' , title: ''},
          { 'extend': 'pdf', 'text': 'Pdf', 'className': 'btn-primary' , title: ''},
          { 'extend': 'print', 'text': 'Print', 'className': 'btn-primary' , title: ''}
        ],
        deferRender: true,
        // autoWidth: true
      };
      
      $('#similarityTable').DataTable(settingsObj);
    });
    
  }

}
