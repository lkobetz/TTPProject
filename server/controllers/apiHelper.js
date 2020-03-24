const request = require("request");

// production is mounted on: https://cloud.iexapis.com/
// test is mounted on: https://sandbox.iexapis.com/

// development:
// const { tpApiToken } = require("../../secrets");
// production:
const tpApiToken = process.env.pApiToken;

module.exports = {
  /*
   ** This method returns a promise
   ** which gets resolved or rejected based
   ** on the result from the API
   */
  make_API_call: function(ticker) {
    const url = `https://cloud.iexapis.com/stable/stock/${ticker}/quote/?token=${tpApiToken}&period=annual`;
    return new Promise((resolve, reject) => {
      request(url, { json: true }, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
      });
    });
  }
};
