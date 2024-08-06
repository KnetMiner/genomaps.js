// chart.js
// import "./style.less";
import "./less/index.less";
import { GENEMAP } from "./genemap.js";

export const chart = GENEMAP.GeneMap().width("100%").height("100%");

export function updateLabel() {
  const geneLabelSelect = document.getElementById("show-gene-labels");
  const geneValue =
    geneLabelSelect.options[geneLabelSelect.selectedIndex].value;

  chart.setGeneLabels(geneValue);

  const qtlLabelSelect = document.getElementById("show-qtl-labels");
  const qtlValue = qtlLabelSelect.options[qtlLabelSelect.selectedIndex].value;

  chart.setQtlLabels(qtlValue);
  chart.redraw("#map");
}

export function changeQtlColor() {
  chart.changeQtlColor("C6", "#000");
}

export function redraw(resetZoom) {
  // const sel = document.getElementById("basemap-file");
  // let option = sel.options[sel.selectedIndex].value;

  // if (option === "cow_milk" || option === "cow_weight") {
  //   option = "cow";
  // }

  // const file = "basemap/" + option + ".xml";
  // const numberPerRow = +document.getElementById("chromosome_per_row").value;
  // chart.layout().numberPerRow = numberPerRow;

  if (resetZoom) {
    chart.resetZoom();
  }

  // document.getElementById("show-qtl-labels").options[2].selected = true;

  // let annotationFile = null;
  // const includeAnnotations = document.getElementById("chk-annotations").checked;

  // if (includeAnnotations) {
  //   annotationFile =
  //     "annotations/" + sel.options[sel.selectedIndex].value + ".xml";
  // }

  const basemap = "./test/data/basemap/arabidopsis.json";
  const annotationFile = "./test/data/annotations/arabidopsis.json";

  // Update this line to your actual function call
  chart.draw("#map", basemap, annotationFile);
}
