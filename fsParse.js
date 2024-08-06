"use strict";

const fs = require("fs");

const parseRes = function () {
  fs.readFile("tdk.json", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const word = JSON.parse(data);
    for (let i = 0; i < word.length; i++) {
      console.log(word[i].madde);
      for (let j = 0; j < word[i].anlamlarListe.length; j++) {
        let meaning = word[i].anlamlarListe[j].anlam;
        let features = word[i].anlamlarListe[j].ozelliklerListe;
        let featureString;
        // Main if statement to figure out if the meaning has an ozelliklerListe in the JSON Resp.
        if (features) {
          let typeArray = features.map((feature) => feature.tur);

          if (typeArray.length > 0) {
            // Destructure the typeArray to get the string values of topType, subType, and otherTypes
            const [topType] = typeArray;

            if (topType == "3") {
              featureString = `(${features
                .map((feature) => feature.tam_adi)
                .join(", ")})`;
            } else if (topType != "3") {
              featureString = `(${word[i].anlamlarListe[0].ozelliklerListe
                .map((feature) => feature.tam_adi)
                .join(", ")}, ${features
                .map((feature) => feature.tam_adi)
                .join(", ")}) `;
            }
          }
        } else {
          featureString = `(${word[i].anlamlarListe[0].ozelliklerListe
            .map((fallbackFeature) => fallbackFeature.tam_adi)
            .join(", ")})`;
        }
        console.log(`${j + 1}- ${featureString} ${meaning}`);
      }
    }
  });
};
parseRes();
