const path = require("path");
const express = require("express");
const hbs = require("hbs");
const port = process.env.PORT || 3000
const categoryInfo = require("./utils/categoryInfo");
const stockInfo = require("./utils/stockInfo");
const availabilityInfo = require("./utils/availibilityInfo");
const {
  productsInfo,
  productInfo,
  clothInfo,
  brandsInfo,
  brandProducts,
} = require("./utils/productsInfo");

const app = express();

/*Defining the path of express config*/
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

/*Setting up the static directory*/
app.use(express.static(publicDirPath));

/*Setting up handlebars engine and the views path*/
app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialsPath);

/*Router to the home page*/
app.get("/", (req, res) => {
  res.render("index", {
    title: "Let's Shop",
  });
});

/*Router to all accessories page*/
app.get("/accessories", (req, res) => {
  categoryInfo("accessories", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const products = productsInfo(data, "accessories");
    res.render("categories", {
      products,
      title: "Accessories",
    });
  });
});

/*Router to a single accessories page*/
app.get("/accessories/:id", (req, res) => {
  const id = req.params.id;
  categoryInfo("accessories", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const category = productInfo(data, "accessories", id);
    if (!category) {
      return res.render("404", {
        message: "Accessory not found",
      });
    }
    stockInfo(category.manufacturer, id, (error, data) => {
      if (error) {
        return res.render("404", {
          message: error,
        });
      }
      const cloth = clothInfo(category, data);
      res.render("category", { cloth, title: cloth.name });
    });
  });
});

/*Router to all jackets page*/
app.get("/jackets", (req, res) => {
  categoryInfo("jackets", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const products = productsInfo(data, "jacket");
    res.render("categories", {
      products,
      title: "Jackets",
    });
  });
});

/*Router to a single jacket page*/
app.get("/jackets/:id", (req, res) => {
  const id = req.params.id;
  categoryInfo("jackets", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const category = productInfo(data, "jacket", id);
    if (!category) {
      return res.render("404", {
        message: "Jackets not found",
      });
    }
    stockInfo(category.manufacturer, id, (error, data) => {
      if (error) {
        return res.render("404", {
          message: error,
        });
      }
      const cloth = clothInfo(category, data);
      res.render("category", { cloth, title: cloth.name });
    });
  });
});

/*Router to all shirts page*/
app.get("/shirts", (req, res) => {
  categoryInfo("shirts", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    } else {
      const products = productsInfo(data, "shirt");
      res.render("categories", {
        products,
        title: "Shirts",
      });
    }
  });
});

/*Router to a single shirt page*/
app.get("/shirts/:id", (req, res) => {
  const id = req.params.id;
  let ids = [];
  categoryInfo("shirts", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const category = productInfo(data, "shirt", id);
    if (!category) {
      return res.render("404", {
        message: "Shirt Not found",
      });
    }
    stockInfo(category.manufacturer, id, (error, data) => {
      if (error) {
        return res.render("404", {
          message: error,
        });
      }
      const cloth = clothInfo(category, data);
      res.render("category", { cloth, title: cloth.name });
    });
  });
});

/*Router to all brands page*/
app.get("/brands", (req, res) => {
  categoryInfo("accessories", (error, data) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }
    const accessories = data.map((product) => product.manufacturer);
    categoryInfo("jackets", (error, data) => {
      if (error) {
        return res.render("404", {
          message: error,
        });
      }
      const jackets = data.map((product) => product.manufacturer);
      categoryInfo("shirts", (error, data) => {
        if (error) {
          return res.render("404", {
            message: error,
          });
        }
        const shirts = data.map((product) => product.manufacturer);
        const brands = brandsInfo(jackets, accessories, shirts);
        res.render("brands", { brands, title: "Brands" });
      });
    });
  });
});

/*Router to a single brand page*/
app.get("/availability/:brand", (req, res) => {
  const brand = req.params.brand;

  availabilityInfo(brand, (error, availableProducts) => {
    if (error) {
      return res.render("404", {
        message: error,
      });
    }

    categoryInfo("accessories", (error, data) => {
      if (error) {
        return res.render("404", {
          message: error,
        });
      }
      const accessories = data.filter(
        (product) => product.manufacturer.toLowerCase() == brand.toLowerCase()
      );
      categoryInfo("jackets", (error, data) => {
        if (error) {
          return res.render("404", {
            message: error,
          });
        }
        const jackets = data.filter(
          (product) => product.manufacturer.toLowerCase() == brand.toLowerCase()
        );
        categoryInfo("shirts", (error, data) => {
          if (error) {
            return res.render("404", {
              message: error,
            });
          }
          const shirts = data.filter(
            (product) =>
              product.manufacturer.toLowerCase() == brand.toLowerCase()
          );
          const brands = brandProducts(
            jackets,
            accessories,
            shirts,
            availableProducts
          );
          res.render("brand", { brands, title: brand.toUpperCase() });
        });
      });
    });
  });
});

/*Router to page not found page*/
app.get("*", (req, res) => {
  res.render("404", {
    message: "Page Not found",
  });
});

app.listen(port, () => {
  console.log("Server is running in port "+ port);
});
