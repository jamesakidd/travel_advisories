const path = require("path"); // needed for refresh
const { graphql } = require("./config");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const { resolvers } = require("./resolver");
const { schema } = require("./schema");
const cors = require("cors");
const port = process.env.PORT || 5000;


app.use(express.static('public'));
app.use(cors());
app.get("/*", (request, response) => {
  // needed for refresh
  response.sendFile(path.join(__dirname, "public/index.html"));
});
app.use(
  graphql,
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);
app.listen(port);

console.log(`Server ready on port: ${port}${graphql} - ${process.env.NODE_ENV}`);
