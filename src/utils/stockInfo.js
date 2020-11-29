const request = require("request");
const stockInfo = (manufacturer, id, callback) => {
  const availibityUrl = `http://bad-api-assignment.reaktor.com/availability/${encodeURIComponent(
    manufacturer
  )}`;

  request({ url: availibityUrl, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect", undefined);
    } else if (response.body == "Not found") {
      callback("Not a proper manufacturer", undefined);
    } else {
      const testProduct = response.body.response.find(
        (product) => product.id.toLowerCase() == id.toLowerCase()
      );
      let datapayload = testProduct.DATAPAYLOAD;
      let availability = datapayload
        .replace(
          /<AVAILABILITY>|<\/AVAILABILITY>|<INSTOCKVALUE>|<\/INSTOCKVALUE>/g,
          ""
        )
        .trim();
      let availCol = "";
      if (availability == "INSTOCK") {
        availability = "Available";
        availCol = "green";
      } else if (availability == "OUTOFSTOCK") {
        availability = "Out of Stock";
        availCol = "red";
      } else {
        availability = "Stock Info Not available";
        availCol = "blue";
      }
      callback(undefined, { availability, availCol });
    }
  });
};

module.exports = stockInfo;
