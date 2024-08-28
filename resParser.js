"use strict";
const axios = require("axios");

async function parseResponse(word) {
  const response = await axios.get(`https://sozluk.gov.tr/gts_id?id=${word}`);
  word = response.data;
  try {
    if (!word.error) {
      // if the response contains actual data not an error
      for (let i = 0; i < word.length; i++) {
        console.log(`${word[i].madde}`);
        for (let j = 0; j < word[i].anlamlarListe.length; j++) {
          const meaning = word[i].anlamlarListe[j].anlam;
          const features = word[i].anlamlarListe[j].ozelliklerListe;
          let featureString;

          // Main if statement to figure out if the meaning has an ozelliklerListe in the JSON Resp.
          if (features) {
            let typeArray = features.map((feature) => feature.tur);

            // Destructure the typeArray to get the string values of topType
            const [topType] = typeArray;

            if (topType == "3") {
              featureString = `(${features
                .map((ParentFeature) => ParentFeature.tam_adi)
                .join(", ")})`;
            }
            if (topType != "3" && topType != undefined) {
              const subType = word[i].anlamlarListe[0].ozelliklerListe
                .map((parentFeature) =>
                  parentFeature.tur == "3" || parentFeature.tur == "4"
                    ? parentFeature.tam_adi
                    : ""
                )
                .filter((parentFeature) => parentFeature != "")
                .join(", ");

              const meaningOwnType = features
                .map((OwnFeature) => OwnFeature.tam_adi)
                .join(", ");

              featureString = `(${subType}, ${meaningOwnType})`;
            }
          } else {
            let fallbackType = word[i].anlamlarListe[0].ozelliklerListe
              .map((fallbackFeature) => {
                if (fallbackFeature.tur == "3") {
                  return fallbackFeature.tam_adi;
                } else {
                  return "";
                }
              })
              .filter((feature) => feature != "")
              .join(", ");

            // if the meaning does not have ozelliklerListe so it will inherit the ozelliklerListe from the first element of anlamlarListe
            featureString = `(${fallbackType})`;
          }
          console.log(`${j + 1}- ${featureString} ${meaning}`);
        }
      }
    } else {
      console.log(`Word not found`);
    }
  } catch (error) {
    console.log(`Error Parsing Response` + error);
  }
}

parseResponse("meme").then((data) => console.log(data));
module.exports = {
  parseResponse,
};
