# Shared Models Library

This library contains shared TypeScript interfaces used across the real-time stock app.

## 📁 Structure

```
libs/models/src/lib/
├── stock.interface.ts      # Stock-related interfaces
├── ui-events.interface.ts  # UI event interfaces
└── models.ts              # Main export file
```

## 🏗️ Interfaces

### Stock Interfaces (`stock.interface.ts`)

#### `Stock`
Base stock information without UI state.
```typescript
interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  lastTradeTime: string;
  volume: number;
}
```

#### `StockWithUIState`
Stock information with UI state (extends `Stock`).
```typescript
interface StockWithUIState extends Stock {
  isActive: boolean; // Whether live updates are enabled for this stock
}
```

### UI Event Interfaces (`ui-events.interface.ts`)

#### `ToggleEvent`
Event emitted when a stock's live update toggle is changed.
```typescript
interface ToggleEvent {
  symbol: string;
  isActive: boolean;
}
```

#### `LiveUpdatesState`
Global state for live updates configuration.
```typescript
interface LiveUpdatesState {
  enabled: boolean;
  activeStocks: string[];
}
```

## 🔄 Migration from Old Names

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `StockData` | `StockWithUIState` | Stock with UI state (isActive) |
| `Stock` | `Stock` | Base stock information |
| `ToggleEvent` | `ToggleEvent` | Toggle event (unchanged) |
| `LiveUpdatesState` | `LiveUpdatesState` | Live updates state (unchanged) |

## 📦 Usage

```typescript
import { Stock, StockWithUIState, ToggleEvent, LiveUpdatesState } from '@real-time-stock-app/models';
```

## 🎯 Design Principles

1. **Clear Naming**: Interfaces have descriptive names that indicate their purpose
2. **Separation of Concerns**: UI state is separated from data models
3. **Extensibility**: Base interfaces can be extended for specific use cases
4. **Type Safety**: All interfaces are strongly typed for better development experience
