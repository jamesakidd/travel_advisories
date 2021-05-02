const getJSONFromWWWPromise = (url) => {
  const got = require("got");

  return new Promise((resolve, reject) => {
    let rawdata;
    try {
      rawdata = got(url, { responseType: "json" });
    } catch (error) {
      console.log(`Error: ${error}`);
      reject(error);
    } finally {
      if (rawdata !== undefined) resolve(rawdata);
    }
  });
};

module.exports = {
  getJSONFromWWWPromise,
};
