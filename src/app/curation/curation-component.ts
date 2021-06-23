//author: Rodrigo Lorenzo Lorenzo 12-03-2021

import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Curation, CustomHTMLElement, Globals } from "../Globals";
import { CommonService } from "../common.service";
import { CurationComponentService } from "./curation-component.service";
import { CommonFunctions } from "../common.functions";
import * as PlotlyJS from "plotly.js/dist/plotly.js";
import * as SmilesDrawer from "smiles-drawer";
import { ViewChildren } from "@angular/core";
import { QueryList } from "@angular/core";
import { ElementRef } from "@angular/core";
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

  // materialModules = [MatIconModule];
  curationDocumentation = undefined;
  downloadLink = undefined;
  fileToUpload: File = null;
  public documentationVisible = false;
  objectKeys = Object.keys;
  substances = [];
  curation_head = [];
  sdfPath = "";

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
      width: 300,
      height: 200,
      showlegend: true,
      margin: { r: 30, t: 30, b: 10, l: 30, pad: 0 },
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
        range: [0, 100],
        // titlefont: {family: 'Barlow Semi Condensed, sans-serif', size: 24 },
        tickfont: { family: "Barlow Semi Condensed, sans-serif", size: 18 },
      },
      xaxis: {
        tickfont: { family: "Barlow Semi Condensed, sans-serif", size: 18 },
      },
      width: 350,
      height: 250,
      showlegend: true,
      barmode: "group",
    },
    config: {
      // displaylogo: false,
      displayModeBar: false,
      // modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'hoverCompareCartesian']
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
    // this.getFullCuration();
  }

  getStatistics() {
    this.documentationVisible = false;
    this.commonService
      .getCurationStatistics(this.curationName)
      .subscribe((result) => {
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

  getPresentKeys(): string[] {
    for (let i = 0; i < this.objectKeys(this.curation.substance).length; i++) {
      let item = this.objectKeys(this.curation.substance)[i];
      this.substances.push(item);
    }
    return this.substances;
  }

  getPresentValues() {
    let values = [];
    for (let i = 0; i < this.substances.length; i++) {
      let item = this.curation.substance[this.substances[i]];
      values.push(item);
    }
    return values;
  }

  drawCurationHeader() {
    console.log("entra");
    const options = { width: 600, height: 300 };
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    for (let i = 0; i < this.curation.head["structure_curated"]; i++) {
      SmilesDrawer.parse(
        this.curation.head["structure_curated"][i],
        function (tree) {
          // Draw to the canvas
          smilesDrawer.draw(tree, "this_canvas" + i, "dark", false);
        },
        function (err) {
          console.log(err);
        }
      );
    }
  }

  getCurationHead() {
      $("#curation").DataTable().destroy();

      let params = undefined;
      this.curation.parameters = {};
      this.globals.tableCurationHead = false;

      this.commonService
        .getCurationParams(this.curation.name)
        .subscribe((result) => {
          if (result[0] === true) {
            params = result[2];
            for (let item of params) {
              let keyvalue = item.split(" : ");
              this.curation.parameters[keyvalue[0]] = keyvalue[1];
            }
            this.commonService
              .getCurationHead(this.curation.name)
              .subscribe((result) => {
                if (result[0] === true) {
                  let response = result[1];
                  this.curation.head[
                    this.curation.parameters["molecule_identifier"]
                  ] = response[this.curation.parameters["molecule_identifier"]];
                  this.curation.head[
                    this.curation.parameters["structure_column"]
                  ] = response[this.curation.parameters["structure_column"]];
                  this.curation.head[
                    this.curation.parameters["structure_curated"]
                  ] = response[this.curation.parameters["structure_curated"]];
                  this.curation.head[
                    this.curation.parameters["substance_type_name"]
                  ] = response[this.curation.parameters["substance_type_name"]];
                  if (
                    this.curation.head[
                      this.curation.parameters["substance_type_name"]
                    ] ===
                    response[this.curation.parameters["substance_type_name"]]
                  ) {
                    $.fn.dataTable.ext.buttons.download = {
                      text: "Download",
                      action: () => {
                        this.importFile();
                      },
                    };
                    $("#curation").DataTable().destroy();
                    $("#curation").DataTable({
                      initComplete: function (settings, json) {
                        setTimeout(() => {
                          const table = $("#curation").DataTable({
                            dom:
                              '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
                              '<"row"<"col-sm-12"tr>>' +
                              '<"row"<"col-sm-5"i><"col-sm-7"p>>',
                            buttons: [
                              {
                                extend: "copy",
                                text: "Copy",
                                className: "btn-primary",
                                title: "",
                              },
                              {
                                extend: "download",
                                text: "Download",
                                className: "btn-primary",
                                title: "",
                              },
                              {
                                extend: "excel",
                                text: "Excel",
                                className: "btn-primary",
                                title: "",
                              },
                              {
                                extend: "pdf",
                                text: "Pdf",
                                className: "btn-primary",
                                title: "",
                              },
                              {
                                extend: "print",
                                text: "Print",
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
                    this.globals.tableCurationHead = true;
                  }
                }
                //this.drawCurationHeader();
              });
          }
        });
    
  }
  //called from download button inserted in datatable
  importFile() {
    let line = "";
    this.commonService
      .getFullCuration(this.curation.name)
      .subscribe((result) => {
        if (result[0] == true) {
          console.log(this.curation.parameters.outfile_type);
          if (this.curation.parameters.outfile_type.includes("sdf")) {
            this.curationService.exportFile(this.curation.name, 'sdf');            
          } else if (this.curation.parameters.outfile_type.includes("csv")) {
            this.curationService.exportFile(this.curation.name, 'csv');            
          } else if (this.curation.parameters.outfile_type.includes("tsv")) {
            this.curationService.exportFile(this.curation.name, 'tsv');            
          } else if (this.curation.parameters.outfile_type.includes("json")) {
            this.curationService.exportFile(this.curation.name, 'json'); 
          } else if (this.curation.parameters.outfile_type.includes("xlsx")) {
            this.curationService.exportFile(this.curation.name, 'xlsx'); 
          }
        }
    });
  }
  getCurationParams() {
    this.commonService
      .getCurationParams(this.curation.name)
      .subscribe((result) => {
        if (result[0]) {
          this.curation.parameters = result[2];
        }
      });
  }

  convertToFileString(objArray): string {
    let separator = "";
    var toArrayObj = Object.keys(objArray).map((key) => [
      String(key),
      objArray[key],
    ]);
    var array =
      typeof toArrayObj != "object" ? JSON.parse(toArrayObj) : toArrayObj;
    var headers = Object.keys(objArray).toString();
    let emptyvar = undefined;
    let csvContent = array.map((e) => e.join(",")).join("\n");
    emptyvar = csvContent.split("\n");

    return csvContent;
  }

  convertToOctet(wbout) {
    var buf = new ArrayBuffer(wbout.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

}
