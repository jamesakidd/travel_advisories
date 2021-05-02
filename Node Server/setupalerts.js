const utilities = require("./utilities");
const {
  countries,
  alerts,
  atlas,
  appdb,
  coll,
  embassydir,
  embassycoll,
} = require("./config");
const routines = require("./dbroutines");
const got = require("got");

const main = async () => {
  //Delete any existing documents from an alerts collection in the database
  let results = "";
  try {
    db = await routines.getDBInstance();
    let delResults = await routines.deleteAll(db, coll);
    results += `Deleted ${delResults.deletedCount} documents from ${coll} collection. `;

    let embDelResults = await routines.deleteAll(db, embassycoll);
    results += `Deleted ${embDelResults.deletedCount} documents from ${embassycoll} collection. `;

    //Obtain the country ISO JSON from GitHub and place it in an array variable. Loop through the array using the .map operation and Promise.allSelected combination
    let countriesArr = [];
    let rawData = await routines.getRawDataFromInternet(countries);
    rawData = rawData.body;
    rawData.map((country) => {
      let countryJson = {
        Name: country.name,
        Code: country["alpha-2"],
        Region: country.region,
        SubRegion: country["sub-region"],
      };
      countriesArr.push(countryJson);
    });

    //Obtain the ALERT JSON from the GOC site.
    let alertJson = await routines.getRawDataFromInternet(alerts);
    alertJson = alertJson.body;

    if (alertJson !== undefined) {
      results += "Retrieved alert JSON from remote website. ";
    }
    if (rawData !== undefined) {
      results += "Retrieved country JSON from remote website. ";
    }

    // With each country, look up the corresponding JSON in the alerts
    let docsToAdd = [];
    countriesArr.map((country) => {
      let currentCode = country.Code;
      let docToAdd;
      if (alertJson.data[currentCode] !== undefined) {
        if (country.Name === "Antarctica") {
          docToAdd = {
            country: country.Code,
            name: country.Name,
            text: alertJson.data[currentCode].eng["advisory-text"],
            date: alertJson.data[currentCode]["date-published"].date,
            region: "Antarctica",
            subregion: "Antarctica",
          };
        } else {
          docToAdd = {
            country: country.Code,
            name: country.Name,
            text: alertJson.data[currentCode].eng["advisory-text"],
            date: alertJson.data[currentCode]["date-published"].date,
            region: country.Region,
            subregion: country.SubRegion,
          };
        }
      } else {
        docToAdd = {
          country: country.Code,
          name: country.Name,
          text: "No travel alerts",
          date: "",
          region: country.Region,
          subregion: country.SubRegion,
        }; //ob
      } //else

      docsToAdd.push(docToAdd);
    }); //map

    let resultArray = await Promise.allSettled(
      docsToAdd.map((doc) => {
        return routines.addOne(db, coll, doc);
      })
    );

    

    const populateAsync = async (country) => {
      let result;
      
      try {
        result = await got(`${embassydir}cta-cap-${country.Code}.json`, {
          responseType: "json",
        });
        
        const p = result.body;
        let embassyToAdd = {
          sourceCountry: country.Name,
          lat: p.data.eng.offices["0"].lat,
          lng: p.data.eng.offices["0"].lng,
          country: p.data.eng.offices["0"].country,
          city: p.data.eng.offices["0"].city,
          address: p.data.eng.offices["0"].address,
          embassytype: p.data.eng.offices["0"].type,
          passport: p.data.eng.offices["0"]["has-passport-services"],
          tel: p.data.eng.offices["0"]["tel-legacy"],
          fax: p.data.eng.offices["0"]["fax-legacy"],
          email: p.data.eng.offices["0"]["email-1"],
          website: p.data.eng.offices["0"].internet,
        };

        // let detail = {
        //   security: 
        // }


        await routines.addOne(db, embassycoll, embassyToAdd);
      } catch (error) {
        
      }
    };

    countriesArr.map((country) => {
      populateAsync(country);
    });


    results += `Added appoximately ${resultArray.length} new documents to the ${coll} collection. `;
    results += `Added appoximately ${resultArray.length} new documents to the ${embassycoll} collection. `;
  } catch (err) {
    console.log(err);
  } finally {
    return { results: results };
  }
}; //main

module.exports = { main };
