const config = {
  port: process.env.PORT || 8080,
  finnhub: {
    apiKey: process.env.FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY',
    baseUrl: process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1'
  },
  stockSymbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'],
  updateInterval: 5000
};

module.exports = config; 