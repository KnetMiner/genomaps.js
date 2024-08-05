import { redraw, updateLabel, changeQtlColor, chart } from "./chart.js";
import * as d3 from "d3";
import $ from "jquery";

function generateCyJSNetwork(url, list) {
  // Implementation here
}

function save() {
  const html = d3
    .select("#map")
    .select("svg")
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .node().parentNode.innerHTML;

  //   saveAs(new Blob([html], { type: "application/svg+xml" }), "genome.svg");
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize chart
  redraw();

  // Bind events
  document
    .getElementById("basemap-file")
    .addEventListener("change", () => redraw(false));
  document
    .getElementById("show-qtl-labels")
    .addEventListener("change", updateLabel);
  document
    .getElementById("chromosome_per_row")
    .addEventListener("click", () => redraw());
  document
    .getElementById("chk-annotations")
    .addEventListener("click", () => redraw());
  document
    .querySelector('button[onclick="redraw(false)"]')
    .addEventListener("click", () => redraw(false));
  document
    .querySelector('button[onclick="redraw(true)"]')
    .addEventListener("click", () => redraw(true));
  document
    .querySelector('button[onclick="changeQtlColor()"]')
    .addEventListener("click", changeQtlColor);

  // Redraw on window resize
  window.addEventListener("resize", () => chart.redraw("#map"));
});

$(function () {
  // redraw on window resize
  var resize = function () {
    chart.redraw("#map");
  };

  d3.select(window).on("resize", resize);

  redraw();
});
