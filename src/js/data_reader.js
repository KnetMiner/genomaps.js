import { AnnotationReader } from "./annotation_reader";
import { BasemapReader } from "./basemap_reader";
// reads from the basemap and (optinally) annotation XML files
export const DataReader = function () {
  /// returns the color property of the data formatted as an HTML color (#ffffff)
  var getColor = function (d) {
    // transform 0xffffff into #ffffff
    // if any letters are missing i.e. #ffff append 0s at the start => #00ffff
    var zeros = new Array(8 - d.length + 1).join("0");
    let color = "#" + zeros + d.substring(2, d.length);

    //modify colours
    if (color == "#00FF00") {
      color = "#208000";
    }

    return color;
  };

  var _processBasemapData = function (genome) {
    genome.chromosomes.forEach(function (chromosome) {
      console.log("chromosome", chromosome);
      // include empty lists incase there is no annotation data
      chromosome.annotations = {
        allGenes: [],
        genes: [],
        qtls: [],
        snps: [],
      };
      if (!chromosome.bands) {
        chromosome.bands = [];
      }

      chromosome.bands.forEach(function (band) {
        band.color = getColor(band.color);
      });
    });

    return genome;
  };

  var _processJoinedData = function (data) {
    var genome = _processBasemapData(data[0]);
    var annotations = data[1];

    annotations.features.forEach(function (annotation) {
      annotation.color = getColor(annotation.color);
    });

    //Tag each gene with its global index
    var allGenomeGenes = annotations.features
      .filter(function (e) {
        return e.type.toLowerCase() === "gene";
      })
      .forEach(function (gene, index) {
        gene.globalIndex = index;
      });

    genome.chromosomes.forEach(function (chromosome) {
      var chromosomeAnnotations = annotations.features.filter(function (e) {
        return e.chromosome === chromosome.number;
      });

      var allGenes = chromosomeAnnotations.filter(function (e) {
        return e.type.toLowerCase() === "gene";
      });

      var qtls = chromosomeAnnotations.filter(function (e) {
        return e.type.toLowerCase() === "qtl";
      });

      var snps = chromosomeAnnotations.filter(function (e) {
        return e.type.toLowerCase() === "snp";
      });

      //Build snps index
      var minSnpPValue = snps.reduce(function (cur, snp) {
        return Math.min(cur, snp.pvalue);
      }, 1);

      snps.forEach(function (snp, index) {
        snp.id = chromosome.number + "_" + index;
        snp.importance = Math.log(snp.pvalue) / Math.log(minSnpPValue);
      });

      //Build qtl index
      qtls.forEach(function (qtl, index) {
        qtl.id = chromosome.number + "_" + index;
        qtl.selected = false;
      });

      //Build genes scores
      var maxScore = qtls.reduce(function (cur, qtl) {
        return Math.max(cur, qtl.score);
      }, 0);

      var maxOpacity = 0.9;
      var opacityFallOff = 3.5;
      var importanceFunction = function (index) {
        return maxOpacity - 0.5 + 1 / (1 + Math.pow(index, opacityFallOff));
      };

      allGenes.forEach(function (gene, index) {
        gene.visible = false;
        gene.hidden = false;
        gene.displayed = false;
        gene.importance = importanceFunction(index);
      });
      var genes = allGenes.slice(0, 100);

      chromosome.annotations = {
        genes: genes,
        allGenes: allGenes,
        qtls: qtls,
        snps: snps,
      };
    });

    return genome;
  };

  return {
    readData: async function (basemapPath, annotationPath, isString) {
      var basemapReader = BasemapReader();
      let basemapData;
      if (!isString) {
        basemapData = await basemapReader.readBasemap(basemapPath);
      } else {
        basemapData = basemapReader.readBasemapFromRawJSON(basemapPath);
      }
      if (annotationPath) {
        var annotationReader = AnnotationReader();
        let annotationPromise;
        if (isString) {
          annotationPromise =
            annotationReader.readAnnotationJSONFromRawJSON(annotationPath);
        } else {
          annotationPromise = annotationReader.readAnnotation(annotationPath);
        }

        var promise = Promise.all([basemapData, annotationPromise]).then(
          _processJoinedData,
          function (error) {
            // try and process the basemap file
            return basemapData.then(_processBasemapData);
          }
        );

        return promise;
      }

      return _processBasemapData(basemapData);
    },
  };
};
