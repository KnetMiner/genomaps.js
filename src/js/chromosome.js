import * as d3 from "d3";
import _ from "lodash";
import $ from "jquery";
export const Chromosome = function (userConfig) {
  var defaultConfig = {
    border: false,
    longestChromosome: 100,
    bands: "basemap",
    layout: {
      width: 10,
      height: 100,
      x: 0,
      y: 0,
    },
    scale: 1,
    onAnnotationSelectFunction: $.noop(),
    drawing: null,
  };

  var config = _.merge({}, defaultConfig, userConfig);

  var buildYScale = function () {
    return d3
      .scaleLinear()
      .range([0, config.layout.height])
      .domain([0, config.longestChromosome]);
  };

  // function to update a single chromosome element given the enter + update selection
  // and data. This assumes the basic element structure is in place.
  var updateChromosome = function (chromosome) {
    var y = buildYScale();
    var height = y(chromosome.length);
    var chromosomeGroup = d3.select(this);

    chromosomeGroup
      .attr("id", "chromosome_" + chromosome.number)
      .attr(
        "transform",
        "translate(" + config.layout.x + "," + config.layout.y + ")"
      );

    chromosomeGroup
      .select("defs")
      .html("")
      .append("mask")
      .attr("id", "chromosome_mask_" + chromosome.number)
      .append("rect")
      .attr("class", "mask_rect");

    chromosomeGroup
      .select("#chromosome_mask_" + chromosome.number)
      .attr("width", config.layout.width)
      .attr("height", height);

    var chromosomeShape = {
      width: config.layout.width,
      height: height,
      rx: Math.min(config.layout.width * 0.4, config.layout.height * 0.1),
      ry: Math.min(config.layout.width * 0.4, config.layout.height * 0.1),
    };

    chromosomeGroup
      .select(".mask_rect")
      .attr("width", chromosomeShape.width)
      .attr("height", chromosomeShape.height)
      .attr("rx", chromosomeShape.rx)
      .attr("ry", chromosomeShape.ry);
    chromosomeGroup
      .select("rect.background")
      .attr("width", chromosomeShape.width)
      .attr("height", chromosomeShape.height)
      .attr("rx", chromosomeShape.rx)
      .attr("ry", chromosomeShape.ry);
    chromosomeGroup
      .select("rect.outline")
      .attr("width", chromosomeShape.width)
      .attr("height", chromosomeShape.height)
      .attr("rx", chromosomeShape.rx)
      .attr("ry", chromosomeShape.ry);

    var selection = [];

    var updateSelection = function () {
      var gSelect = chromosomeGroup.selectAll("rect.selection").data(selection);

      gSelect
        .enter()
        .append("rect")
        .attr("class", "selection")
        .style("fill", "gray")
        .style("opacity", 0.2);

      gSelect
        .attr("x", 0)
        .attr("y", function (d) {
          return Math.min(d.start, d.end);
        })
        .attr("width", config.layout.width)
        .attr("height", function (d) {
          return Math.abs(d.end - d.start);
        });

      gSelect.exit().remove();
    };

    var drag = d3
      .drag()
      .on("start", function (event) {
        //log.info(y.invert( d3.event.y))
        var pos = d3.pointer(event, this);
        selection.push({
          start: pos[1],
          end: pos[1],
        });
        updateSelection();
        event.sourceEvent.stopPropagation();
      })
      .on("drag", function (event) {
        selection[0].end = d3.pointer(event, this)[1];
        updateSelection();
        event.sourceEvent.stopPropagation();
        event.sourceEvent.preventDefault();
      })
      .on("end", function (event) {
        event.sourceEvent.stopPropagation();
        var geneStart = y.invert(selection[0].start);
        var geneEnd = y.invert(selection[0].end);
        if (geneStart > geneEnd) {
          var temp = geneStart;
          geneStart = geneEnd;
          geneEnd = temp;
        }

        var nodesToUpdate = chromosome.layout.geneBandNodes.filter(function (
          node
        ) {
          return node.data.midpoint > geneStart && node.data.midpoint < geneEnd;
        });

        nodesToUpdate.forEach(function (node) {
          if (node.data.type == "gene") {
            node.data.visible = true;
          } else if (node.data.type == "geneslist") {
            node.data.genesList.forEach(function (gene) {
              gene.visible = true;
            });
          }
        });

        config.onAnnotationSelectFunction();

        selection = [];
        updateSelection();
      });

    chromosomeGroup.select("rect.background").call(drag);

    if (config.border) {
      chromosomeGroup
        .select("rect.border")
        .attr("width", config.layout.width)
        .attr("height", config.layout.height);
    }

    // setup the chromosome bands
    var bandsContainer = chromosomeGroup.select(".bands_container");

    var drawBands;
    if (config.bands == "basemap") {
      drawBands = drawBasemapBands;
    } else if (config.bands == "genes") {
      drawBands = drawGeneLinesAndBands;
    }

    drawBands(bandsContainer, chromosome);
    chromosomeGroup
      .select(".bands_container")
      .style("mask", "url(#chromosome_mask_" + chromosome.number + ")");
  }; // updateChromosome

  var drawBasemapBands = function (bandsContainer, chromosome) {
    var y = buildYScale();
    var bands = bandsContainer.selectAll("rect.band").data(chromosome.bands);
    bands.enter().append("rect").attr("class", "band");

    bands
      .attr("width", config.layout.width)
      .attr("y", function (d) {
        return y(d.start);
      })
      .attr("height", function (d) {
        return y(d.end - d.start);
      })
      .attr("fill", function (d) {
        return d.color;
      });

    bands.exit().remove();
  };

  var generateGeneLineAttr = function (y, gene) {
    var rawHeight = gene.end - gene.start;
    var rawDY = y(rawHeight);

    var result;

    if (rawDY * config.scale > 2) {
      result = { y: y(gene.start), height: rawDY };
    } else {
      let height = Math.min(2 / config.scale, 2);
      result = { y: y(gene.midpoint) - height / 2, height: height };
    }

    result.fill = gene.color;
    result.width = config.layout.width;
    result["fill-opacity"] = 0.8;
    result["stroke-dasharray"] = [
      0,
      config.layout.width,
      result.height,
      config.layout.width + result.height,
    ];
    result["stroke-width"] = config.layout.width / 5;

    return result;
  };

  var drawGeneLinesAndBands = function (bandsContainer, chromosome) {
    var y = buildYScale();
    var bandsRect = bandsContainer.selectAll("rect.band");
    var bands = bandsRect.data(chromosome.layout.geneBandNodes);

    bands
      .enter()
      .append("rect")
      .attr("id", function (d) {
        return d.data.id;
      })
      .attr("class", "band geneline infobox");

    bands.each(function (band) {
      let attribs = generateGeneLineAttr(y, band);
      d3.select(this)
        .attr("y", attribs.y)
        .attr("height", attribs.height)
        .attr("fill", attribs.fill)
        .attr("width", attribs.width)
        .attr("fill-opacity", attribs["fill-opacity"])
        .attr("stroke-dasharray", attribs["stroke-dasharray"])
        .attr("stroke-width", attribs["stroke-width"]);
    });

    bands.classed("selected", function (d) {
      return d.data.selected;
    });

    // adding basempsbands
    var baseBands = bandsRect.data(chromosome.bands);
    baseBands
      .attr("width", config.layout.width)
      .attr("y", function (d) {
        return y(d.start);
      })
      .attr("height", function (d) {
        return y(d.end - d.start);
      })
      .attr("fill", function (d) {
        return "white";
      });

    bands.on("click", function (e, d) {
      //If user clicks on a gene, toggle gene selection
      if (d.data.type == "gene") {
        if (d.data.displayed && !d.data.visible && !d.data.hidden) {
          //this gene was annotated automatically - hide it
          d.data.visible = false;
          d.data.hidden = true;
        } else {
          //toggle visibility
          d.data.visible = !d.data.visible;
        }

        config.onAnnotationSelectFunction();
      }

      //If user clicks on a cluster of genes, expand that cluster
      if (d.data.type == "geneslist") {
        let clusterCurrentlyHidden = d.data.genesList.some(function (gene) {
          return !gene.displayed;
        });

        d.data.genesList.forEach(function (gene) {
          gene.visible = clusterCurrentlyHidden;
          gene.hidden = !clusterCurrentlyHidden;
        });

        config.onAnnotationSelectFunction();
      }
    });

    bands.exit().remove();
  };

  // An SVG representation of a chromosome with banding data. This is expecting the passed selection to be within an
  // SVG element and to have a list of chromosome JSON objects as its data.
  function my(selection) {
    selection.each(function (d) {
      // build up the selection of chromosome objects
      var chromosomes = d3.select(this).selectAll(".chromosome").data([d]);

      // setup a basic element structure for any new chromosomes
      var enterGroup = chromosomes
        .enter()
        .append("g")
        .attr("class", "chromosome");
      enterGroup.append("defs");
      enterGroup.append("rect").classed("background", true);
      enterGroup.append("g").classed("bands_container", true);
      enterGroup.append("rect").classed("outline", true);

      if (config.border) {
        enterGroup.append("rect").classed("border", true);
      }

      // update each of the chromosomes
      d3.select(this).selectAll(".chromosome").each(updateChromosome);

      // remove any missing elements
      chromosomes.exit().remove();
    });
  }

  my.onAnnotationSelectFunction = function (value) {
    if (!arguments.length) {
      return config.onAnnotationSelectFunction;
    }

    config.onAnnotationSelectFunction = value;
    return my;
  };

  my.layout = function (value) {
    if (!arguments.length) {
      return config.layout;
    }

    config.layout = value;
    return my;
  };

  my.drawing = function (value) {
    if (!arguments.length) {
      return config.drawing;
    }

    config.drawing = value;
    return my;
  };

  my.longestChromosome = function (value) {
    if (!arguments.length) {
      return config.longestChromosome;
    }

    config.longestChromosome = value;
    return my;
  };

  my.bands = function (value) {
    if (!arguments.length) {
      return config.bands;
    }

    config.bands = value;
    return my;
  };

  my.scale = function (value) {
    if (!arguments.length) {
      return config.scale;
    }

    config.scale = value;
    return my;
  };

  my.infoBoxManager = function (value) {
    if (!arguments.length) {
      return config.infoBoxManager;
    }

    config.infoBoxManager = value;
    return my;
  };

  return my;
};
