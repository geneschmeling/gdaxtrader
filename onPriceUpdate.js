var minPrice = null;
var maxPrice = null;
var startTime = null;
var elapsedTime = null;
var buyUsd = 0;
var sellBtc = 0;
var avgBtcCost = null;
var dollarsToBuyBtc = null;

// var currenttime = null;
// var elapsedtime = 0;
// var selltrig = .01; //amount above buy price to start looking for fall to order sell
// var sellprice = .001; //amount of fall after selltrig to order sell
// var buytrig =.03; //amount balow sell price to start looking for rise to order buy
// var buyprice = .001; //amount of rise after buytrig to order buy
// var dollarInvest = 100 //investment amount
// var numberofcoin = dollarInvest / price; //number of coin purchased

const minProfitPercentage = 0.07;
const percentageFallToSell = 0.005;
const percentageRiseBeforeBuy = 0.02;
const transactionFeePercentage = .025

let currentPrice = null;
let mostRecentBuyPrice = currentPrice;
const wallet = {
  usd: 100.0,
  btc: 0.0
};


function calculateTotalValue() {
  return wallet.usd + (wallet.btc * currentPrice);
}

function buy(buyUsd) {
  console.log(`Buying ${buyUsd}...`);
  console.dir(buyUsd);
  
  if (wallet.usd < 20) { buyUsd = wallet.usd;
    
  }
  else {buyUsd = wallet.usd / 2;
    
  }
  
  wallet.usd = wallet.usd - buyUsd;
  wallet.btc = wallet.btc + (buyUsd * (1 - (transactionFeePercentage / 100.0))) / currentPrice;
  
  mostRecentBuyPrice = currentPrice;
  maxPrice = currentPrice;
  minPrice = currentPrice;
  dollarsToBuyBtc = dollarsToBuyBtc + buyUsd;
  avgBtcCost = wallet.btc/wallet.usd;
  
  console.dir(wallet);
}

function sell(btc) {
  console.log(`Selling ${btc}...`);
  console.dir(wallet);
  
  wallet.btc = wallet.btc - btc;
  wallet.usd = wallet.usd + ((btc * (1 - (transactionFeePercentage / 100.0))) * currentPrice);
  
  mostRecentBuyPrice = currentPrice;
  minPrice = currentPrice;
  dollarsToBuyBtc = 0;
  
  console.dir(wallet);
}

function shouldBuy() {
  
  if ((((currentPrice - minPrice) / minPrice) * 100.0) > percentageRiseBeforeBuy) {
    return true;
  }
  if ((((currentPrice - mostRecentBuyPrice) / mostRecentBuyPrice) * 100.0) > percentageRiseBeforeBuy) {
    return true;
  }
  
  return false;
}

function shouldSell() {
  
  if ((((maxPrice - mostRecentBuyPrice) / mostRecentBuyPrice) * 100.0) > minProfitPercentage) {
    if ((((maxPrice - currentPrice) / maxPrice) * 100.0) > percentageFallToSell) {
      return true;
    }
  }
  
  return false;
}

module.exports = function onPriceUpdate(price, order) {
  currentPrice = price;
  
  if (minPrice == null) {
    minPrice = price;
    maxPrice = price;
    startTime = new Date().getTime();
    mostRecentBuyPrice = price;
  } else {
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
    elapsedTime = new Date().getTime() - startTime;
    
    if (wallet.usd > 10) {
      // buy mode
      if (shouldBuy()) buy(wallet.usd);
    } else {
      // sell mode
      if (shouldSell()) sell(wallet.btc);
    }
  }
  
  console.log(`currentPrice=${currentPrice.toFixed(2)}, totalValue=${calculateTotalValue().toFixed(2)}, btc=${wallet.btc.toFixed(7)}, dollarsToBuyBtc=${dollarsToBuyBtc().toFixed(2)}, wallet=${wallet.usd.toFixed(2)}, mostRecentBuyPrice=${mostRecentBuyPrice}, minPrice=${minPrice}, maxPrice=${maxPrice}, elapsedTime=${elapsedTime}`);
};
