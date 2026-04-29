import { AnnotationReader } from "./annotation_reader";
import { BasemapReader } from "./basemap_reader";
// reads from the basemap and (optinally) annotation XML files
export const DataReader = function () {
  /// returns the color property of the data formatted as an HTML color (#ffffff)
  var getColor = function (d) {
    if (d == null || d === "") return "#333";
    var str = String(d);
    // Already #hex (e.g. from host)
    if (str.charAt(0) === "#") {
      return str.length >= 7 ? str : "#" + str.slice(1).padStart(6, "0");
    }
    // transform 0xffffff into #ffffff
    var zeros = new Array(8 - str.length + 1).join("0");
    let color = "#" + zeros + str.substring(2, str.length);

    //modify colours
    if (color == "#00FF00") {
      color = "#208000";
    }

    return color;
  };

  var _processBasemapData = function (genome) {
    genome.chromosomes.forEach(function (chromosome) {
      // console.log("chromosome", chromosome);
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

    if (typeof window !== "undefined" && window.__GENOMAPS_DEBUG__) {
      console.log("[genomaps] data_reader: annotations.features.length =", (annotations && annotations.features && annotations.features.length) || 0, "basemap chromosomes =", (genome.chromosomes && genome.chromosomes.length) || 0);
    }

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
        // Support both string and number (host may send "1", basemap may have number 1)
        return String(e.chromosome) === String(chromosome.number);
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

      if (typeof window !== "undefined" && window.__GENOMAPS_DEBUG__) {
        console.log("[genomaps] data_reader: chr", chromosome.number, "features matched:", {
          total: chromosomeAnnotations.length,
          genes: allGenes.length,
          qtls: qtls.length,
          snps: snps.length,
          firstSnpTrait: snps[0] && snps[0].trait,
          firstGeneTrait: allGenes[0] && allGenes[0].trait,
        });
      }

      //Build snps index (support both pvalue and pValue from host)
      var minSnpPValue = snps.reduce(function (cur, snp) {
        var p = snp.pvalue != null ? snp.pvalue : snp.pValue;
        return Math.min(cur, typeof p === "number" ? p : 1);
      }, 1);

      snps.forEach(function (snp, index) {
        snp.id = chromosome.number + "_" + index;
        var p = snp.pvalue != null ? snp.pvalue : snp.pValue;
        snp.importance = typeof p === "number" && minSnpPValue > 0
          ? Math.log(p) / Math.log(minSnpPValue)
          : 1;
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
