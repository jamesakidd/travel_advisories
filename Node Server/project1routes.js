const { coll } = require("./config");
const express = require("express");
const router = express.Router();
const dbRtns = require("./dbroutines");
const setup = require("./setupalerts");

router.get("/", async (req, res) => {
  try {
    let results = await setup.main();
    res.status(200).send(results);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get failed - internal server error");
  }
});

module.exports = router;