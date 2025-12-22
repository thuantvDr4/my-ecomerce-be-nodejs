// @ts-nocheck
const productRegistry = {};

const registerProductType = (type, classRef) => {
  productRegistry[type] = classRef;
};

const getProductClass = (type) => {
  return productRegistry[type];
};

module.exports = {
  getProductClass,
  registerProductType,
};
