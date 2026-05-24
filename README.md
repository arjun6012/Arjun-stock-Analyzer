# Arjun Signal — Indian Market Finder & Technical Stock Screener

**Arjun Signal** is a modern, high-performance web application designed to track and screen over 230 major Indian equities listed on the NSE across all key sectors. By analyzing one year of daily historical data, the application calculates complex technical indicators, runs a composite multi-factor scoring algorithm to output Buy/Sell/Hold signals, and integrates matching live financial news feed.

Built on top of **TanStack Start** (Full-stack React) and styled with **TailwindCSS v4.0**, it features a clean dark-mode dashboard with interactive filtering, a persistent watchlist, and indicator-by-indicator analysis panels.

---

## 🌟 Key Features

- **230+ Stocks Screener**: Monitors leading Indian companies across sectors like Banking, IT, Auto, Energy, Power, FMCG, Pharma, Retail, Metals, Telecom, Infrastructure, Real Estate, and Defence.
- **8-Factor Technical Signal Engine**: Generates real-time recommendation signals (`BUY`, `SELL`, or `HOLD`) backed by a weighted composite scoring system.
- **Confidence Rating**: Calculates a confidence score (20% to 100%) indicating the strength of the bullish/bearish divergence.
- **Target Price Suggestions**: Automatically suggests buy zone entry limits and sell targets based on Bollinger Bands and Moving Averages.
- **Smart News Integration**: Pulls latest publisher headlines matching the stock's name and relevant stock market identifiers from Google News RSS.
- **Interactive Watchlist**: Allows bookmarking favorite stocks with automatic browser persistence using local storage.
- **Advanced Filtering**: Instant searching, sector filtering, and signal breakdown tabs.

---

## 🛠️ Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (Full-stack React framework with SSR, filesystem routing, and type-safe server functions)
- **Data Querying**: [TanStack Query v5](https://tanstack.com/query/latest) for client-side caching, Daily refresh scheduling, and optimistic state recovery.
- **Styling**: [TailwindCSS v4.0](https://tailwindcss.com/) with native CSS variables and modern HSL/OKLCH color space for visual highlights.
- **Package Manager**: [Bun](https://bun.sh/) (uses [bun.lock](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/bun.lock))
- **Deployment Platform**: Cloudflare Workers ready with [wrangler.jsonc](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/wrangler.jsonc).

---

## 📂 Project Structure & Key Files

Here are the primary files driving the application logic:

1. **[src/routes/index.tsx](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/src/routes/index.tsx)**:
   - Coordinates the dashboard view, including filters, sector tags, search bar, and general statistics cards.
   - Includes components such as `<StatCard />`, `<StockRow />`, `<IndicatorPanel />`, and `<NewsPanel />`.
   - Utilizes `localStorage` for watchlist state management.
2. **[src/lib/stocks.functions.ts](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/src/lib/stocks.functions.ts)**:
   - The algorithmic backbone of the application. Calculates standard math helpers like SMA, EMA, RSI, Standard Deviation, and Bollinger Bands.
   - Defines the sector/ticker lists and exports TanStack Server Functions: `getIndianStocks()` and `getStockNews()`.
   - Uses Yahoo Finance API queries for one-year historical charts.

3. **[src/server.ts](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/src/server.ts)**:
   - Serves as the SSR application entrypoint.
   - Captures catastrophic server-side rendering errors, normalizes them, and returns a branded error page instead of a generic JSON payload.

4. **[vite.config.ts](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/vite.config.ts)**:
   - Configures Vite with the `@lovable.dev/vite-tanstack-config` plugin bundle.
   - Instructs TanStack Start's server engine to use our custom entrypoint `src/server.ts`.

---

## 📈 The 8-Factor Signal Algorithm

The application computes signals using the `deriveSignal()` function inside [src/lib/stocks.functions.ts](file:///c:/Users/asasikumar/Desktop/nimble-market-finder/src/lib/stocks.functions.ts). The score is calculated as follows:

| Factor                     | Technical Criteria                                           | Score Impact | Reason Logged                     |
| :------------------------- | :----------------------------------------------------------- | :----------- | :-------------------------------- |
| **1. Long-term Trend**     | Price is above the 200-day Simple Moving Average (SMA)       | `+1.0`       | Above 200-day MA (long uptrend)   |
|                            | Price is below the 200-day Simple Moving Average (SMA)       | `-1.0`       | Below 200-day MA (long downtrend) |
| **2. Short-term Trend**    | SMA 20 is greater than SMA 50 (Golden Cross)                 | `+1.0`       | SMA20 > SMA50 (bullish cross)     |
|                            | SMA 20 is less than SMA 50 (Death Cross)                     | `-1.0`       | SMA20 < SMA50 (bearish cross)     |
| **3. Momentum Indicator**  | MACD Histogram is positive                                   | `+1.0`       | MACD positive                     |
|                            | MACD Histogram is negative                                   | `-1.0`       | MACD negative                     |
| **4. RSI Conditions**      | RSI-14 is oversold (`< 30`)                                  | `+2.0`       | Oversold RSI                      |
|                            | RSI-14 is overbought (`> 70`)                                | `-2.0`       | Overbought RSI                    |
|                            | RSI-14 is in a healthy momentum zone (`50 - 65`)             | `+0.5`       | Healthy RSI                       |
| **5. Bollinger Bands**     | Price is near lower band (`bbPct <= 0.1`)                    | `+1.0`       | Near lower Bollinger band         |
|                            | Price is near upper band (`bbPct >= 0.9`)                    | `-1.0`       | Near upper Bollinger band         |
| **6. 52-Week Proximity**   | Price is within 15% of the 52-week low                       | `+1.0`       | Only X% above 52w low             |
|                            | Price is within 5% of the 52-week high                       | `-1.0`       | Within X% of 52w high             |
| **7. 1-Month Momentum**    | Stock price gained more than 8% over the past month          | `+0.5`       | 1m momentum +X%                   |
|                            | Stock price lost more than 8% over the past month            | `-0.5`       | 1m momentum -X%                   |
| **8. Volume Confirmation** | Volume surges > 1.3x 20-day average during positive momentum | `+0.5`       | Volume surge Xx                   |
|                            | Volume surges > 1.3x 20-day average during negative momentum | `-0.5`       | Heavy selling volume Xx           |

### Signal Thresholds

- **`BUY`**: Score of `+2.5` or higher
- **`SELL`**: Score of `-2.5` or lower
- **`HOLD`**: Score is neutral between `-2.5` and `+2.5`

---

## 🚀 Getting Started (Beginner-Friendly Guide)

Follow these steps to run the application on your own computer.

### 📋 Step 1: Install a Runtime Environment

To run this website locally, you need a JavaScript runtime environment. You can use either **Node.js** (most common) or **Bun** (faster, recommended if you have it installed).

- **Option A: Node.js (Recommended for Beginners)**
  1.  Go to [nodejs.org](https://nodejs.org/).
  2.  Download and install the **LTS (Long Term Support)** version for your operating system.
  3.  This installer automatically installs both `node` and `npm` (Node Package Manager).
- **Option B: Bun (Advanced)**
  1.  Go to [bun.sh](https://bun.sh/).
  2.  Follow the installation command for your operating system.

---

### 💻 Step 2: Open the Project Terminal

1.  Open your code editor (like Visual Studio Code).
2.  Open the project folder inside your editor.
3.  Open a new terminal window:
    - In VS Code: Press `Ctrl + ` ` (backtick) or go to the top menu and select **Terminal > New Terminal**.
    - Alternatively: Open your system's Command Prompt (cmd) or PowerShell, and navigate to the project directory.

---

### 📦 Step 3: Install the Project Dependencies

Before running the app, you need to download the external code libraries (like React, TanStack, and Tailwind CSS) that it relies on.

Type **one** of the following commands in your terminal and press **Enter**:

```bash
# If you are using Node.js/npm:
npm install

# If you are using Bun:
bun install
```

_This might take a minute or two as it downloads the packages into a folder named `node_modules`._

---

### 🏃 Step 4: Start the Development Server

Now, boot up the local server to run the website.

Type **one** of the following commands in your terminal and press **Enter**:

```bash
# If you are using Node.js/npm:
npm run dev

# If you are using Bun:
bun dev
```

You should see output text in your terminal indicating that the server is running, showing a link like this:

```
  Ready in 1.2s
  ➜  Local:   http://localhost:3000/
```

**To view the app:**

1.  Hold down the `Ctrl` key (Windows/Linux) or `Cmd` key (macOS) and click the `http://localhost:3000/` link in the terminal.
2.  Alternatively, open your web browser (Chrome, Safari, Edge, etc.) and type `http://localhost:3000` in the address bar.

---

### 🛠️ Step 5: Troubleshooting (Common Issues)

#### 🛑 Error: "File npm.ps1 cannot be loaded because running scripts is disabled..." (Windows)

If you see this error on Windows when running PowerShell, your operating system is blocking custom scripts for security. You can solve this in three ways:

1.  **Use Command Prompt (CMD) instead of PowerShell**: Click the arrow dropdown next to the `+` sign in the VS Code terminal and select **Command Prompt**. Run `npm run dev` there.
2.  **Run with `.cmd` extension**: Type `npm.cmd run dev` instead of `npm run dev`.
3.  **Temporarily bypass security policy in PowerShell**: Run the following command in your terminal before starting:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    ```

#### 🛑 Command Not Found / Command Not Recognized

- Make sure you installed Node.js or Bun in Step 1.
- Try closing your code editor entirely and reopening it to refresh your terminal path.

---

### 🛠️ Production Build & Formatting

Once you are comfortable running the app, you can use these optional utility commands:

```bash
# Build the production optimized version of the app
npm run build   # or: bun run build

# Format all files automatically to make the code clean
npm run format  # or: bun run format

# Run code style and safety checks
npm run lint    # or: bun run lint
```

---

## 🛡️ Disclaimer

This application is an educational prototype and a technical stock screening experiment. None of the signals, scoring metrics, target suggestions, or articles presented should be considered financial, investment, tax, or legal advice. Perform your own due diligence before committing real capital.
