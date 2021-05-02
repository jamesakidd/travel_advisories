const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  countries: process.env.ISOCOUNTRIES,
  alerts: process.env.GOCALERTS,
  coll: process.env.ALERTCOLLECTION,
  advisorycoll: process.env.ADVISORIESCOLLECTION,
  embassycoll: process.env.EMBASSYCOLL,
  embassydir: process.env.EMBASSYDIR,
  atlas: process.env.DBURL,
  appdb: process.env.DB,
  port: process.env.PORT,
  graphql: process.env.GRAPHQLURL,

};