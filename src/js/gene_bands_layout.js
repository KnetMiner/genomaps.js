//Produce layout for gene annotations
//GENEMAP.GeneClusterer is used to cluster genes if necessary
//Labella is used to generate layout of nodes
import * as d3 from "d3";
import _ from "lodash";

export const GeneBandsLayout = function (userConfig) {
  var defaultConfig = {
    longestChromosome: 100,
    layout: {
      width: 10, //not used
      height: 100,
      x: 0, //not used
      y: 0, //not used
    },
    doCluster: true,
    nClusters: 6,
    scale: 1,
    nGenesToDisplay: 1000,
  };

  var config = _.merge({}, defaultConfig, userConfig);
  var y;

  var buildYScale = function () {
    return d3
      .scaleLinear()
      .range([0, config.layout.height])
      .domain([0, config.longestChromosome]);
  };

  var shouldRecluster = function (nodes) {
    return config.doCluster;
  };

  var createNode = function (cluster) {
    if (cluster.type == "gene") {
      var gene = cluster;

      let result = {
        start: gene.start,
        end: gene.end,
        midpoint: gene.midpoint,
        color: gene.color,
        data: gene,
      };

      return result;
    } else if (cluster.type == "geneslist") {
      let maxPosition = cluster.genesList.reduce(function (max, current) {
        return Math.max(max, current.end);
      }, 0);
      let minPosition = cluster.genesList.reduce(function (min, current) {
        return Math.min(min, current.start);
      }, Infinity);

      let result = {
        start: minPosition,
        end: maxPosition,
        midpoint: cluster.midpoint,
        color: "#0000FF",
        data: cluster,
      };

      return result;
    }
  };

  var generateChromosomeLayout = function (chromosome) {
    y = buildYScale();

    //Start by constructing nodes directly from genes
    var nodeSource = chromosome.layout.geneBandDisplayClusters;
    var nodes = nodeSource.map(createNode);
    return nodes;
  };

  //Produce list of clusters (which could be single genes)
  //for a given chromosome
  var generateChromosomeClusters = function (chromosome) {
    var genes = chromosome.annotations.allGenes.filter(function (gene) {
      return gene.globalIndex < config.nGenesToDisplay;
    });

    genes.sort(function (lhs, rhs) {
      return lhs.midpoint - rhs.midpoint;
    });

    var geneClusters = [];

    var iGene = 0;
    while (iGene < genes.length) {
      let iDiff = iGene;
      while (
        iDiff < genes.length &&
        genes[iGene].midpoint == genes[iDiff].midpoint
      ) {
        iDiff++;
      }
      let nMatching = iDiff - iGene;

      if (nMatching == 1) {
        geneClusters.push(genes[iGene]);
        iGene++;
      } else {
        var genesList = genes.slice(iGene, iDiff);
        var id = genesList.reduce(function (sum, current) {
          return sum + current.id.toString();
        }, "");

        var genesCollection = {
          genesList: genesList,
          midpoint: genesList[0].midpoint,
          type: "geneslist",
          id: id,
        };
        geneClusters.push(genesCollection);
        iGene = iDiff;
      }
    }

    geneClusters.sort(function (lhs, rhs) {
      return lhs.midpoint < rhs.midpoint;
    });

    return geneClusters;
  };

  let my = {};

  my.layoutChromosome = function (chromosome) {
    chromosome.layout.geneBandNodes = generateChromosomeLayout(chromosome);
  };

  my.computeChromosomeClusters = function (chromosome) {
    let ly = chromosome.layout;
    ly.geneBandClusters = generateChromosomeClusters(chromosome);
    ly.geneBandDisplayClusters = ly.geneBandClusters.slice();
  };

  my.expandAllChromosomeClusters = function (chromosome) {
    let ly = chromosome.layout;
    ly.geneBandDisplayClusters = chromosome.annotations.allGenes;
  };

  my.collapseAllChromosomeClusters = function (chromosome) {
    let ly = chromosome.layout;
    ly.geneBandDisplayClusters = ly.geneBandClusters.slice();
  };

  my.expandAChromosomeCluster = function (chromosome, cluster) {
    let ly = chromosome.layout;
    ly.geneBandDisplayClusters = ly.geneBandClusters.slice();

    //add each gene as it's own cluster
    cluster.genesList.forEach(function (gene) {
      ly.geneBandDisplayClusters.push(gene);
    });

    //delete the original cluster
    var clusterIndex = ly.geneBandDisplayClusters.indexOf(cluster);
    ly.geneBandDisplayClusters.splice(clusterIndex, 1);
  };

  return my;
};
