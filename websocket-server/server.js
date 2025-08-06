const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;

const stockData = [
  { symbol: 'FB', name: 'Meta Platforms', basePrice: 36.85 },
  { symbol: 'ZNGA', name: 'Zynga', basePrice: 4.48 },
  { symbol: 'TRI', name: 'Thomson Reuters', basePrice: 38.50 },
  { symbol: 'ORCL', name: 'Oracle', basePrice: 28.07 },
  { symbol: 'F', name: 'Ford Motor Company', basePrice: 19.72 },
  { symbol: 'BIDU', name: 'Baidu', basePrice: 101.83 },
  { symbol: 'AAPL', name: 'Apple', basePrice: 403.03 },
  { symbol: 'YHOO', name: 'Yahoo!', basePrice: 35.46 },
  { symbol: 'MSFT', name: 'Microsoft', basePrice: 57.82 },
  { symbol: 'LNKD', name: 'LinkedIn', basePrice: 178.08 },
  { symbol: 'GOOG', name: 'Alphabet', basePrice: 1016.92 },
  { symbol: 'EA', name: 'Electronic Arts', basePrice: 25.96 }
];

function generateRandomPrice(basePrice) {
  const volatility = 0.02;
  const change = (Math.random() - 0.5) * volatility * basePrice;
  return Math.max(0, basePrice + change);
}

function generateStockUpdate(stock) {
  const currentPrice = generateRandomPrice(stock.basePrice);
  const previousPrice = stock.lastPrice || stock.basePrice;
  const priceChange = currentPrice - previousPrice;
  const percentageChange = (priceChange / previousPrice) * 100;
  
  stock.lastPrice = currentPrice;
  
  return {
    symbol: stock.symbol,
    name: stock.name,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    priceChange: parseFloat(priceChange.toFixed(2)),
    percentageChange: parseFloat(percentageChange.toFixed(2)),
    lastTradeTime: new Date().toLocaleTimeString(),
    volume: Math.floor(Math.random() * 10000) + 1000
  };
}

function broadcastStockUpdates() {
  const updates = stockData.map(stock => generateStockUpdate(stock));
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'stock-update',
        data: updates
      }));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        console.log('Client subscribed to stock updates');
        ws.send(JSON.stringify({
          type: 'subscribed',
          message: 'Successfully subscribed to stock updates'
        }));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

setInterval(broadcastStockUpdates, 3000);

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Connect to: ws://localhost:${PORT}`);
}); 