import Ajv from "ajv";
import basemapSchema from "../test/data/basemapSchema.json";
const ajv = new Ajv();
const validate = ajv.compile(basemapSchema);

export const BasemapReader = function () {
  var _readBasemapJSON = function (json) {
    // Validate data
    const valid = validate(json);

    if (!valid) {
      console.log("json:", json);
      console.log("Invalid data:", validate.errors);
      throw new Error("Invalid data");
    }

    var genome = {};
    genome.chromosomes = json?.chromosomes;

    return genome;
  };

  return {
    readBasemap: async function (path) {
      const data = await import(path);
      return _readBasemapJSON(data.default);
    },
    readBasemapFromRawJSON: function (json) {
      return _readBasemapJSON(json);
    },
  };
};
