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
 
  if (resetZoom) {
    chart.resetZoom();
  }

  chart.zoomIn(1.5);

}
