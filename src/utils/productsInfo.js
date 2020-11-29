const productsInfo = (data, category) => {
  const products = data.map((product) => {
    product.image = `/img/${category}.jpg`;
    product.alt = category;
    return product;
  });
  return products;
};
const productInfo = (data, category, id) => {
  const product = data.find((element) => element.id == id);
  if (!product) {
    return null;
  }

  product.image = `/img/${category}.jpg`;
  product.alt = category;
  return product;
};
const clothInfo = (category, data) => {
  category.availability = data.availability;
  category.stockCol = data.availCol;
  return category;
};
const brandsInfo = (jackets, accessories, shirts) => {
  const allBrands = [...jackets, ...shirts, ...accessories];
  const brandsSet = new Set(allBrands);
  const brandsLower = Array.from(brandsSet);
  const brands = brandsLower.map((brand) => brand.toUpperCase());
  return brands;
};

const brandProducts = (jackets, accessories, shirts, availableProducts) => {
  let products = [];
  for (const { id, DATAPAYLOAD } of availableProducts) {
    const jacket = jackets.find(
      (element) => element.id.toLowerCase() == id.toLowerCase()
    );
    const shirt = shirts.find(
      (element) => element.id.toLowerCase() == id.toLowerCase()
    );
    const accessory = accessories.find(
      (element) => element.id.toLowerCase() == id.toLowerCase()
    );
    if (jacket) {
      let availability = DATAPAYLOAD.replace(
        /<AVAILABILITY>|<\/AVAILABILITY>|<INSTOCKVALUE>|<\/INSTOCKVALUE>/g,
        ""
      ).trim();
      jacket.availability = availability;
      products.push(jacket);
    }
    if (shirt) {
      let availability = DATAPAYLOAD.replace(
        /<AVAILABILITY>|<\/AVAILABILITY>|<INSTOCKVALUE>|<\/INSTOCKVALUE>/g,
        ""
      ).trim();
      shirt.availability = availability;
      products.push(shirt);
    }
    if (accessory) {
      let availability = DATAPAYLOAD.replace(
        /<AVAILABILITY>|<\/AVAILABILITY>|<INSTOCKVALUE>|<\/INSTOCKVALUE>/g,
        ""
      ).trim();
      accessory.availability = availability;
      products.push(accessory);
    }
  }
  products.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return products;
};

module.exports = {
  productsInfo,
  productInfo,
  clothInfo,
  brandsInfo,
  brandProducts,
};
