# Mock Data Sources

This folder contains mock data for development and testing purposes.

## Structure

- `mock-stock-data.ts` - Mock stock market data for the dashboard
- `index.ts` - Barrel export file for clean imports

## Usage

```typescript
import { MOCK_STOCK_DATA } from '../../../../data/sources/mocks';
```

## Data Structure

The mock data follows the `StockData` interface defined in `src/app/features/stocks/models/stock-data.model.ts`.

### Stock Data Properties

- `symbol` - Stock ticker symbol (e.g., 'AAPL', 'GOOG')
- `name` - Company name
- `currentPrice` - Current stock price
- `priceChange` - Price change from previous close
- `percentageChange` - Percentage change from previous close
- `lastTradeTime` - Time of last trade
- `volume` - Trading volume
- `isActive` - Whether the stock is currently active/trading

## Adding New Mock Data

1. Create a new file following the naming convention: `mock-[data-type]-data.ts`
2. Export the data as a named constant
3. Add the export to `index.ts`
4. Update this README with the new data structure 