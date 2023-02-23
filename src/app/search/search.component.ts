import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
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
export class SearchComponent implements AfterViewInit, OnInit {
  
  @Input() spaceName;
  @Input() spaceVersion;
  
  constructor(
    public search: Search,
    public space: Space,
    public globals: Globals,
    public commonService: CommonService
    ) { }
    
    @ViewChildren('cmp') components: QueryList<ElementRef>;

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
          cauto: true,
          size: 10
        },
        // hovertemplate:'%{y:.2f}<text></text>'
        hovertemplate:'<b>%{text}</b>'
        }
      ],
      layout : {
        width: 700,
        height: 500,
        // margin: {r: 10, t: 30, b:0, pad: 0 },
        barmode: 'relative',
        hovermode: 'closest',
        hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 14 } },
        xaxis: {
          range: [-1.2, 1.2],
          zeroline: true,
          zerolinewidth: 4,
          zerolinecolor: 'black',
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
          tickvals: [-1.0, 1.0],
          ticktext: ['negative', 'positive']
        },
        yaxis: {
          tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 14 },
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

  showDistance() {
    if (this.search.metric!='substructural' && this.search.metric!='smarts') {
      return true;
    }
    return false;
  }

  showActivity() {
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

    this.plotRA.data[0].marker.color = iresult.ymatrix;
    for (let i=0; i<iresult.ymatrix.length; i++) {
        this.plotRA.data[0].x[i] = iresult.ymatrix[i] * 2 -1 ;
    }
    this.plotRA.data[0].y = iresult.distances;
    this.plotRA.data[0].text = iresult.obj_nam;
    this.plotRA.data[0].meta = iresult.SMILES;
  }

  ngOnInit(): void {
    
    this.commonService.searchCompleted$.subscribe(()=>{
      this.updateRA(0);  
      const SMILES = this.search.result[0].SMILES;
      const canvas = <HTMLCanvasElement>document.getElementById('ra_canvas');
      const context = canvas.getContext('2d');
      const options = {'width': 400, 'height': 250};
      const smilesDrawer = new SmilesDrawer.Drawer(options);
  
      PlotlyJS.newPlot('ra_plot', this.plotRA.data, this.plotRA.layout, this.plotRA.config);
      let myRAPlot = <CustomHTMLElement>document.getElementById('ra_plot');
      myRAPlot.on('plotly_hover', function(eventdata){ 
        var points = eventdata.points[0];
        SmilesDrawer.parse(SMILES[points.pointNumber], function(tree) {
          smilesDrawer.draw(tree, 'ra_canvas', 'light', false);
        });
      });
  
      // on onhover, clear the canvas
      myRAPlot.on('plotly_unhover', function(data){
        context.clearRect(0, 0, canvas.width, canvas.height);
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
