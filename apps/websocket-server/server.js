const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const config = require('./config');
const ApiEndpoints = require('./api-endpoints');

const PORT = config.port;
const FINNHUB_API_KEY = config.finnhub.apiKey;
const FINNHUB_BASE_URL = config.finnhub.baseUrl;
const STOCK_SYMBOLS = config.stockSymbols;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const stockData = new Map();

async function fetchStockQuote(symbol) {
  const url = `${FINNHUB_BASE_URL}${ApiEndpoints.QUOTE}?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  const metricsUrl = `${FINNHUB_BASE_URL}${ApiEndpoints.STOCK_METRIC}?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;

  try {
    const [quoteResponse, metricsResponse] = await Promise.all([
      fetch(url),
      fetch(metricsUrl).catch(() => null)
    ]);

    if (!quoteResponse.ok) {
      throw new Error(`HTTP error! status: ${quoteResponse.status}`);
    }

    const quote = await quoteResponse.json();
    let weekHigh52 = 0;
    let weekLow52 = 0;

    if (metricsResponse && metricsResponse.ok) {
      const metrics = await metricsResponse.json();
      if (metrics.metric) {
        weekHigh52 = metrics.metric['52WeekHigh'] || 0;
        weekLow52 = metrics.metric['52WeekLow'] || 0;
      }
    }

    const priceChange = quote.d;
    console.log(`Updated ${symbol}: $${quote.c} (${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}) - 52W: $${weekHigh52.toFixed(2)}/$${weekLow52.toFixed(2)}`);

    return {
      symbol,
      name: `${symbol} Stock`,
      currentPrice: quote.c,
      priceChange: quote.d,
      percentageChange: quote.dp,
      lastTradeTime: new Date(quote.t * 1000).toISOString(),
      dailyHigh: quote.h,
      dailyLow: quote.l,
      weekHigh52: weekHigh52,
      weekLow52: weekLow52,
      isActive: true
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return null;
  }
}

async function fetchAllStockQuotes() {
  console.log('Fetching stock quotes from Finnhub...');
  
  const activeSymbols = STOCK_SYMBOLS.filter(symbol => {
    const stock = stockData.get(symbol);
    return stock && stock.isActive;
  });

  if (activeSymbols.length === 0) {
    return;
  }

  const quotes = await Promise.all(
    activeSymbols.map(symbol => fetchStockQuote(symbol))
  );

  const validQuotes = quotes.filter(quote => quote !== null);

  if (validQuotes.length > 0) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'stock-update',
          data: validQuotes
        }));
      }
    });

    validQuotes.forEach(quote => {
      stockData.set(quote.symbol, quote);
    });
  }
}

setInterval(fetchAllStockQuotes, config.updateInterval);

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  const initialData = Array.from(stockData.values());
  if (initialData.length > 0) {
    ws.send(JSON.stringify({
      type: 'stock-update',
      data: initialData
    }));
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        console.log('Client subscribed to stock updates');
        ws.send(JSON.stringify({
          type: 'subscribed',
          message: 'Successfully subscribed to stock updates'
        }));
      } else if (data.type === 'toggle-stock') {
        const { symbol, isActive } = data;
        let stock = stockData.get(symbol);
        
        if (!stock) {
          stock = {
            symbol,
            name: `${symbol} Stock`,
            currentPrice: 0,
            priceChange: 0,
            percentageChange: 0,
            lastTradeTime: new Date().toISOString(),
            dailyHigh: 0,
            dailyLow: 0,
            weekHigh52: 0,
            weekLow52: 0,
            isActive: false
          };
        }
        
        stock.isActive = isActive;
        stockData.set(symbol, stock);
        console.log(`${symbol} ${isActive ? 'activated' : 'deactivated'}`);
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

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Connect to: ws://localhost:${PORT}`);
  console.log(`Tracking stocks: ${STOCK_SYMBOLS.join(', ')}`);
  
  if (FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
    console.log('Warning: Please set your FINNHUB_API_KEY environment variable');
  }
}); 