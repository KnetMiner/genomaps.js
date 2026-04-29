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

export async function redraw(resetZoom) {
  const sel = document.getElementById("basemap-file");
  if (!sel) return;

  const option = sel.options[sel.selectedIndex].value;
  const file = "./src/test/data/basemap/" + option + ".json";

  const numberPerRowInput = document.getElementById("chromosome_per_row");
  if (numberPerRowInput) {
    const numberPerRow = +numberPerRowInput.value;
    chart.layout().numberPerRow = numberPerRow;
  }

  if (resetZoom) {
    chart.resetZoom();
  }

  const qtlLabelSelect = document.getElementById("show-qtl-labels");
  if (qtlLabelSelect) {
    qtlLabelSelect.options[2].selected = true;
  }

  let annotationFile = null;
  const includeAnnotationsCheck = document.getElementById("chk-annotations");
  if (includeAnnotationsCheck && includeAnnotationsCheck.checked) {
    annotationFile = "./src/test/data/annotations/" + option + ".json";
  }

  await chart.draw("#map", file, annotationFile, false);
}
