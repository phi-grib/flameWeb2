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
    isBinary = false;
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
          colorscale: 'Bluered', 
          showscale: false,
          cauto: false,
          cmin: 0,
          cmax: 1,
          size: 10
        },
        hovertemplate:'<b>%{text}</b>  sim:%{y:.2f}<extra></extra>'
        }
      ],
      layout : {
        width: 500,
        height: 400,
        margin: {r: 20, l:20, t: 0, b:20, pad: 0 },
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
          range: [-0.1, 1.1],
          zeroline: true,
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          automargin: true
        },
        showlegend: false
      },
      config: {
        displaylogo: false,
        displayModeBar: false 
      }
    }

    plotRAQuantitative = {
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
          showscale: false,
          cauto: true,
          size: 10
        },
        hovertemplate:'<b>%{text}</b>  act:%{x:.2f]} sim:%{y:.2f}<extra></extra>'
        }
      ],
      layout : {
        width: 500,
        height: 400,
        margin: {r: 20, l:20, t: 0, b:20, pad: 0 },
        barmode: 'relative',
        hovermode: 'closest',
        hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 16 } },
        xaxis: {
          zeroline: false,
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          ticktext: ['negative', 'positive']
        },
        yaxis: {
          range: [-0.1, 1.1],
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 16 },
          zeroline: true,
          automargin: true
        },
        showlegend: false
      },
      config: {
        displaylogo: false,
        displayModeBar: false 
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
    
    if (this.isBinary) {
      this.plotRA.data[0].x[i]=[];
      for (let i=0; i<iresult.ymatrix.length; i++) {
        this.plotRA.data[0].x[i] = iresult.ymatrix[i] * 2 -1 ;
      };
      this.plotRA.data[0].marker.color = iresult.ymatrix;
      this.plotRA.data[0].y = iresult.distances;
      this.plotRA.data[0].text = iresult.obj_nam;
      this.plotRA.data[0].meta = iresult.SMILES;
      PlotlyJS.react('ra_plot', this.plotRA.data, this.plotRA.layout, this.plotRA.config);
    }
    else {
      this.plotRAQuantitative.data[0].marker.color = iresult.ymatrix;
      this.plotRAQuantitative.data[0].x = iresult.ymatrix;
      this.plotRAQuantitative.data[0].y = iresult.distances;
      this.plotRAQuantitative.data[0].text = iresult.obj_nam;
      this.plotRAQuantitative.data[0].meta = iresult.SMILES;
      PlotlyJS.react('ra_plot', this.plotRAQuantitative.data, this.plotRAQuantitative.layout, this.plotRAQuantitative.config);
    }

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
      
      // check if the activities are binary or quantitative
      this.isBinary = true;
      let found = false;
      let val = 0;
      for (let i=0; i<this.search.result.length; i++) {
        for (let j=0; j<this.search.result[i].ymatrix.length; j++ ) {
          val = this.search.result[i].ymatrix[j]
          if (val!==1.0 && val!==0.0) {
            this.isBinary = false;
            found = true;
          }
        }
        if (found) { break }
      }

      this.updateRA(0);  
      
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
    });
  }
  
  ngAfterViewInit() {
    // {{this.search.smileSrc[i]}}
    this.components.changes.subscribe(() => {
      $('#similarityTable').DataTable().destroy();
      if (this.components !== undefined) {
        this.components.forEach((child) => {
            let smile = child.nativeElement.getAttribute("id")
            child.nativeElement.setAttribute('data-smiles',smile)
        });
        SmilesDrawer.SmiDrawer.apply();
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
      };
      
      $('#similarityTable').DataTable(settingsObj);
    });
    
  }

}
