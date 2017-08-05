var minPrice = null;
var maxPrice = null;

module.exports = function onPriceUpdate(price) {
  if (minPrice == null) {
    minPrice = price;
    maxPrice = price;
  } else {
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
  }
  
  console.log(`${minPrice} - ${maxPrice}`);
};
