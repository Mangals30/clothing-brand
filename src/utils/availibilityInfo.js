const request = require("request");
const availabilityInfo = (manufacturer, callback) => {
  const availabityUrl = `http://bad-api-assignment.reaktor.com/availability/${encodeURIComponent(
    manufacturer
  )}`;

  request({ url: availabityUrl, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect", undefined);
    } else if (response.body == "Not found") {
      callback("Not a proper manufacturer", undefined);
    } else {
      callback(undefined, response.body.response);
    }
  });
};

module.exports = availabilityInfo;
