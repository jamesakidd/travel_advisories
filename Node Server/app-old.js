const { port } = require("./config");
const express = require("express");
const myroutes = require('./project1routes')

const app = express();
// parse application/json
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodie

app.use((req, res, next) => {
  console.log("Time:", new Date() + 3600000 * -5.0); // GMT-->EST
  next();
});

// app.get("/", (req, res) => {
//   res.send("\n\nHello world! again\n\n");
// });

app.use('/api/p1/setup', myroutes);
app.use(express.static('public'));





app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
