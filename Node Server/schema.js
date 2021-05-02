const { buildSchema } = require("graphql");
const schema = buildSchema(`

type Query {
setupalerts: results,
alerts: [Alert],
alertsforsubregion(name: String): [Alert],
alertsforregion(name: String): [Alert],
alertsfortraveller(name: String): [CustomAdvisory],
regions: [String],
subregions: [String],
allcountries: [String],
advisoriesforuser(name: String): [Advisory],
alltravellers: [String],
allEmbassyCountries: [String],
embassyForCountry(sourcecountry: String): [Embassy],
}

type results{
    results: String
}

type Alert{
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
    }

type Advisory {
    name: String
    country: String
    text: String
    date: String
}

type CustomAdvisory {
    traveller: String
    name: String
    text: String
    date: String
}

type Embassy {
    sourceCountry: String
    lat: String
    lng: String
    country: String
    city: String
    address: String
    embassytype: String
    passport: Int
    tel: String
    fax: String
    email: String
    website: String
}

type Mutation {
    addAdvisory(name: String, country: String): Advisory
}

`);
module.exports = { schema };
