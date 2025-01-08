import Ajv from "ajv";
import annotationSchema from "../test/data/annotationsSchema.json";

const ajv = new Ajv();
const validate = ajv.compile(annotationSchema);
export const AnnotationReader = function () {
  var _readAnnotations = function (json) {
    console.log("annotation json:", json);
    const valid = validate(json);
    if (!valid) {
      console.log("annotation json:", json);
      console.log("Invalid data:", validate.errors);
      throw new Error("Invalid data");
    }
    var genome = {};
    genome.features = json.genome.features?.map((feature) => ({
      ...feature,
      midpoint: (feature.end - feature.start) / 2 + feature.start,
      selected: false,
    }));
    return genome;
  };

  return {
    readAnnotationJSONFromRawJSON: function (json) {
      return _readAnnotations(json);
    },
    readAnnotation: async function (path) {
      const data = await import(path);
      return _readAnnotations(data.default);
    },
  };
};
