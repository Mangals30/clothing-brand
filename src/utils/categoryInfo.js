const request = require("request");
const categoryInfo = (category, callback) => {
  const categoryUrl = `https://bad-api-assignment.reaktor.com/products/${category}`;

  request({ url: categoryUrl, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect", undefined);
    } else if (response.body == "Not found") {
      callback("Unable to find the searched item", undefined);
    } else {
      callback(undefined, response.body);
    }
  });
};

module.exports = categoryInfo;
