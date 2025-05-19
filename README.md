# News Clock System – CasparCG

This project pushes real-time clock data to a CasparCG server using AMCP commands. It's modular, testable, and designed to work with HTML templates rendered by CasparCG.

## Features

- Modular architecture:
  - `CasparClient`: AMCP socket client
  - `ClockTicker`: Clock updater logic
  - `MAIN.html`: CasparCG template
- Real-Time Clock Updates
  - Sends clock data via CG ADD, CG UPDATE over TCP using the AMCP protocol
- Testable Design
  - Fully unit-testable using Jest with mocking and fake timers

# Getting Started

- Prerequisites

  - Node.js
  - (Optional) Docker to run CasparCG server locally

## Installation & Run

```bash
npm install
npm test
```

- CasparCG server is not required to run the unit tests. For full integration testing or rendering the HTML template, use Docker or a CasparCG desktop setup.

## Debugging in Browser

You can test the HTML template without running a CasparCG server:

```bash
http://127.0.0.1:5500/public/main/MAIN.html?debug=true
```

This enables debug mode, which:

- Displays on-screen debug controls (`Show` and `Hide` buttons).
- Simulates live clock updates using `leftTap("on", "BBC NEWS HH:MM")` every minute.
- Automatically hides the strap after 5 seconds.
- Includes a ticker area (`rightTab("on", "...")`) for scrolling headlines.

Debugging from DevTools Console:

- Show strap manually:

```bash
leftTap("on", "BBC NEWS 14:00");
```

![inspect-leftjoin](/public/assets/inspect-leftjoin.png)

- Hide strap:

```bash
leftTap("off");
```

- Show ticker:

```bash
rightTab("on", "Latest Headlines: Lorem ipsum...");
```

- Hide ticker:

```bash
rightTab("off");
```

## File Structure

```
news-clock-system-caspercg/
├── src/
│   ├── CasparClient.ts      # AMCP TCP client
│   ├── ClockTicker.ts       # Clock update logic
│   ├── clock-updater.ts     # Main entry point
│   ├── amcp.ts              # AMCP command builder
│   └── config.ts            # Host/port configuration
├── public/main/MAIN.html    # CasparCG HTML template
├── __tests__/               # Jest unit tests
├── package.json             # Project config
├── tsconfig.json            # TypeScript config
├── eslint.config.js         # Linting rules
├── jest.config.js           # Test configuration
```

# Testing Strategy

### Unit Tests

- ClockTicker
  - Mocks `Date` and verifies correct AMCP command is built and sent
- CasparClient
  - Ensures `sendCommand()` formats commands with `\r\n`
  - Verifies socket connection and error handling
- clock-updater
  - Mocks both modules to ensure correct orchestration

### Techniques Used

- `jest.useFakeTimers()` to simulate clock ticks

- Socket communication is mocked — no real TCP used in tests

## Testing Strategy

- Unit Tests
  - ✅ ClockTicker – test correct AMCP command built from a mocked Date
  - ✅ CasparClient – ensures commands are formatted + sent with \r\n
  - ✅ clock-updater – mocks both and verifies the flow
