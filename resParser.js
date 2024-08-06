"use strict";
const axios = require("axios");

async function parseJSON(word) {
  const response = await axios.get(`https://sozluk.gov.tr/gts_id?id=${word}`);
  word = response.data;
  try {
    if (!word.error) {
      // if the response contains actual data not an error
      for (let i = 0; i < word.length; i++) {
        console.log(word[i].madde);
        for (let j = 0; j < word[i].anlamlarListe.length; j++) {
          let meaning = word[i].anlamlarListe[j].anlam;
          let features = word[i].anlamlarListe[j].ozelliklerListe;
          let featureString;
          // Main if statement to figure out if the meaning has an ozelliklerListe in the JSON Resp.
          if (features) {
            let typeArray = features.map((feature) => feature.tur);

            // Destructure the typeArray to get the string values of topType
            const [topType] = typeArray;

            if (topType == "3") {
              featureString = `(${features
                .map((feature) => feature.tam_adi)
                .join(", ")})`;
            } else if (topType != "3" && topType != undefined) {
              featureString = `(${word[i].anlamlarListe[0].ozelliklerListe
                .map((feature) =>
                  feature.tur == "3" || feature.tur == "4"
                    ? feature.tam_adi
                    : "-"
                )
                .filter((feature) => feature != "-")
                .join(", ")}, ${features
                .map((feature) => feature.tam_adi) // This map will go over ozelliklerListe that has tur value != 3 and adds their tam_adi to feautureString
                .join(", ")})`;
            }
          } else {
            // if the meaning does not have ozelliklerListe so it will inherit the ozelliklerListe from the first element of anlamlarListe
            featureString = `(${word[i].anlamlarListe[0].ozelliklerListe
              .map((feature) =>
                feature.tur == "3" ? feature.tam_adi : feature.tam_adi
              )
              .join(", ")})`;
          }
          console.log(`${j + 1}- ${featureString} ${meaning}`);
        }
      }
    } else {
      console.log(`Words not found`);
    }
  } catch (error) {
    console.log(`Error Parsing Response` + error);
  }
}

parseJSON("meme");
