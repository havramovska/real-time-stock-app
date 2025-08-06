try {
  require('dotenv').config();
} catch (error) {}

module.exports = {
  finnhub: {
    apiKey: process.env.FINNHUB_API_KEY || 'd29kpu1r01qvhsftp160d29kpu1r01qvhsftp16g',
    baseUrl: 'https://finnhub.io/api/v1'
  },
  websocket: {
    port: process.env.WS_PORT || 3001
  }
}; 