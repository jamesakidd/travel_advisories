const setup = require("./setupalerts");
const dbRtns = require("./dbroutines");
const { coll, advisorycoll, embassycoll } = require("./config");
const dateTime = require("node-datetime");

const resolvers = {
  setupalerts: async () => {
    return (results = await setup.main());
  },

  alerts: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findAll(db, coll, {}, {}));
  },

  alertsforregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findAll(
      db,
      coll,
      { region: args.name },
      {}
    ));
  },

  alertsforsubregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findAll(
      db,
      coll,
      { subregion: args.name },
      {}
    ));
  },

  alertsfortraveller: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.findAll(
      db,
      advisorycoll,
      { name: args.name },
      {}
    );

    return (arr = results.map(
      ({ name: traveller, country: name, ...rest }) => ({
        traveller,
        name,
        ...rest,
      })
    ));
  },

  regions: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findUniqueValues(db, coll, "region"));
  },

  subregions: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findUniqueValues(db, coll, "subregion"));
  },

  allcountries: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findUniqueValues(db, coll, "name"));
  },

  addAdvisory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let alert = await dbRtns.findOne(db, coll, { name: args.country });
    let advisory = {
      name: args.name,
      country: args.country,
      text: alert.text,
      date: dateTime.create().format("Y-m-d H:M:S"),
    };
    let results = await dbRtns.addOne(db, advisorycoll, advisory);
    return results.insertedCount === 1 ? advisory : null;
  },

  advisoriesforuser: async (args) => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findAll(
      db,
      advisorycoll,
      { name: args.name },
      {}
    ));
  },

  alltravellers: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findUniqueValues(db, advisorycoll, "name"));
  },

  allEmbassyCountries: async () => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findUniqueValues(db, embassycoll, "sourceCountry"));
  },

  embassyForCountry: async (args) => {
    let db = await dbRtns.getDBInstance();
    return (results = await dbRtns.findAll(
      db,
      embassycoll,
      { sourceCountry: args.sourcecountry },
      {}
    ));
  },

};
module.exports = { resolvers };
