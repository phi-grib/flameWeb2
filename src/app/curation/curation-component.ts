//author: Rodrigo Lorenzo Lorenzo 12-03-2021
import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Curation, Globals } from "../Globals";
import { CommonService } from "../common.service";
import { CurationComponentService } from "./curation-component.service";
import { CommonFunctions } from "../common.functions";
import * as PlotlyJS from "plotly.js/dist/plotly.js";
import * as SmilesDrawer from "smiles-drawer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

declare var $: any;

@Component({
  selector: "app-curation-documentation",
  templateUrl: "./curation-component.html",
  styleUrls: ["./curation-component.css"],
})
export class CurationComponent implements OnChanges {
  index: number = 0;
  constructor(
    public curationService: CurationComponentService,
    public func: CommonFunctions,
    public curation: Curation,
    public commonService: CommonService,
    public globals: Globals
  ) {}

  @Input() curationName;
  @ViewChildren("sml") components: QueryList<ElementRef>;
  @ViewChild("downloadSdf", { static: false }) downloadSdf: ElementRef;

  objectKeys = Object.keys;

  // materialModules = [MatIconModule];
  curationDocumentation = undefined;
  downloadLink = undefined;
  fileToUpload: File = null;
  public documentationVisible = false;
  substances = [];
  curation_head = [];
  sdfPath = "";

    //set options for pie plot
  plotPie = {
    data: [
      {
        values: [],
        labels: ["organic", "organometallic", "no_sanitizable"],
        textinfo: "label",
        marker: { colors: ["lightblue", "blue"] },
        type: "pie",
      },
    ],
    layout: {
      width: 400,
      height: 200,
      showlegend: true,
      margin: { r: 30, t: 20, b: 20, l: 90, pad: 10 },
    },
    config: {
      displaylogo: false,
      modeBarButtonsToRemove: [
        "lasso2d",
        "select2d",
        "autoScale2d",
        "hoverCompareCartesian",
      ],
    },
  };

      //set options for bar plot
  plotSummary = {
    data: [
      {
        x: ["Processed SMILES", "Unable to process"],
        y: [],
        name: "Curation results",
        type: "bar",
        texttemplate: "%{y:.2f}",
        textposition: "auto",
        textfont: { family: "Barlow Semi Condensed, sans-serif", size: 18 },
        marker: {
          color: "rgba(70,143,184,0.8)",
        },
      },
    ],
    layout: {
      yaxis: {
        // range: [0, 100],
        // titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
        tickfont: { family: "Barlow Semi Condensed, sans-serif", size: 18 },
      },
      xaxis: {
        tickfont: { family: "Barlow Semi Condensed, sans-serif", size: 18 },
      },
      width: 400,
      // height: 200,
      // margin: { r: 90, t: 100, b: 20, l: 30, pad: 10 },
      showlegend: true,
      barmode: "group",
    },
    config: {
      displayModeBar: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']
    },
  };

  ngOnChanges(): void {
    this.curation.stats = undefined;
    this.curation.substance = undefined;
    this.curation.error = undefined;
    this.curation.date = undefined;
    this.plotPie.data[0].labels = [];
    this.plotPie.data[0].values = [];
    this.plotSummary.data[0].y = [];

    this.getStatistics();
    this.getCurationHead();
  }

  //obtains the stats from the curation through commonService
  getStatistics() {
    this.commonService.getCurationStatistics(this.curationName).subscribe((result) => {
      if (result[0]) {
        this.curationDocumentation = result[1];
        this.curation.stats = this.curationDocumentation["curation_stats"];
        this.curation.substance = this.curationDocumentation[
          "substance_types"
        ];
        if (this.curation.stats["Unable to process"] != undefined) {
          this.plotSummary.data[0].y = [
            this.curation.stats["Processed SMILES"],
            this.curation.stats["Unable to process"],
          ];
        } else {
          this.plotSummary.data[0].y = [
            this.curation.stats["Processed SMILES"],
            0,
          ];
        }
        this.plotPie.data[0].labels = this.getPresentKeys();
        this.plotPie.data[0].values = this.getPresentValues();
        this.curation.name = this.func.curation.name;
        this.curation.date = this.func.curation.date;

      } else {
        this.curation.error = "No file sent";
      }
    });
  }

  //dinamically loads the keys for the pie plot
  getPresentKeys(): string[] {
    for (let i = 0; i < this.objectKeys(this.curation.substance).length; i++) {
      let item = this.objectKeys(this.curation.substance)[i];
      this.substances.push(item);
    }
    return this.substances;
  }
  //dinamically loads the values for the pie plot
  getPresentValues() {
    let values = [];
    for (let i = 0; i < this.substances.length; i++) {
      let item = this.curation.substance[this.substances[i]];
      values.push(item);
    }
    return values;
  }

  
  //obtains data from the header pickl through commonService
  getCurationHead() {
    $("#curationResults").DataTable().destroy();

      // let params = undefined;
      this.curation.parameters = {};
      this.globals.tableCurationHead = false;

      this.commonService.getCurationParams(this.curation.name).subscribe(
        (result) => {
          this.curation.parameters = result;

          this.commonService.getCurationHead(this.curation.name).subscribe(
            (result) => {
              if (result[0] === true) {
                this.curation.head = result[1];
                console.log(result[0]);
                $.fn.dataTable.ext.buttons.sdf = {
                    text: "SDF",
                    action: () => {
                      this.importFile("sdf");
                    },
                  };
                  $.fn.dataTable.ext.buttons.csv = {
                    text: "csv",
                    action: () => {
                      this.importFile("csv");
                    },
                  };
                  $.fn.dataTable.ext.buttons.xlsx = {
                    text: "Excel",
                    action: () => {
                      this.importFile("xlsx");
                    },
                  };
                  $.fn.dataTable.ext.buttons.tsv = {
                    text: "TSV",
                    action: () => {
                      this.importFile("tsv");
                    },
                  };
                  $.fn.dataTable.ext.buttons.json = {
                    text: "JSON",
                    action: () => {
                      this.importFile("json");
                    },
                  };
                  $("#curationResults").DataTable().destroy();
                  $("#curationResults").DataTable({
                    initComplete: function (settings, json) {
                      setTimeout(() => {
                          console.log('load buttons');
                        const table = $("#curationResults").DataTable({
                          dom:
                            '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
                            '<"row"<"col-sm-12"tr>>' +
                            '<"row"<"col-sm-5"i><"col-sm-7"p>>',
                          buttons: [
                            {
                              extend: "sdf",
                              text: "SDF",
                              className: "btn-primary",
                              title: "",
                            },
                            {
                              extend: "csv",
                              text: "CSV",
                              className: "btn-primary",
                              title: "",
                            },
                            {
                              extend: "xlsx",
                              text: "Excel",
                              className: "btn-primary",
                              title: "",
                            },
                            {
                              extend: "tsv",
                              text: "TSV",
                              className: "btn-primary",
                              title: "",
                            },
                            {
                              extend: "json",
                              text: "JSON",
                              className: "btn-primary",
                              title: "",
                            },
                          ],
                          deferRender: true,
                          ordering: true,
                          pageLength: 10,
                          columnDefs: [{ type: "date-euro", targets: 2 }],
                          order: [[1, "desc"]],
                          destroy: true,
                        });
                      }, 50);
                    },
                  });
                const options = { 'width': 300, 'height': 150 };
                const smilesDrawer = new SmilesDrawer.Drawer(options);
                setTimeout(() => {
                this.components.forEach((child) => {
                  SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
                    smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
                    }, function (err) {
                      console.log(err);
                    });
                  });
                }, 50);

                
                this.globals.tableCurationHead = true;
              }
            }
          );
        }, 
        (error)=>{
          alert(error.message);
        });
  }

  //called from download button inserted in datatable
  importFile(format) {
    console.log(format);
  this.curationService.exportFile(this.curation.name, format);
}

}
