var Gdax = require('gdax');
var onPriceUpdate = require('./onPriceUpdate');

const websocket = new Gdax.WebsocketClient(['BTC-USD']);

websocket.on('message', data => {
  if (data.type !== "match") return;
  
  onPriceUpdate(parseFloat(data.price), data)
});
websocket.on('error', err => console.log(err.message));
websocket.on('close', () => console.log('closed'));