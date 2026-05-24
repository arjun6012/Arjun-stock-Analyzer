import { createServerFn } from "@tanstack/react-start";

export type Signal = "BUY" | "SELL" | "HOLD";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  sma20: number;
  sma50: number;
  rsi: number;
  signal: Signal;
  reason: string;
  // A naive "target sell price" — 5% above current or 52w high midpoint, whichever is higher
  suggestedSellPrice: number;
  suggestedBuyPrice: number;
  updatedAt: number;
}

const DEFAULT_TICKERS: { symbol: string; name: string }[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "ITC.NS", name: "ITC Limited" },
  { symbol: "LT.NS", name: "Larsen & Toubro" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints" },
  { symbol: "WIPRO.NS", name: "Wipro" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors" },
];

function sma(values: number[], period: number): number {
  if (values.length < period) return values.reduce((a, b) => a + b, 0) / values.length;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function rsi(values: number[], period = 14): number {
  if (values.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  const slice = values.slice(-(period + 1));
  for (let i = 1; i < slice.length; i++) {
    const diff = slice[i] - slice[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function deriveSignal(price: number, sma20Val: number, sma50Val: number, rsiVal: number): { signal: Signal; reason: string } {
  // Score-based composite
  let score = 0;
  const reasons: string[] = [];

  if (price > sma20Val && sma20Val > sma50Val) {
    score += 1;
    reasons.push("uptrend (SMA20>SMA50)");
  } else if (price < sma20Val && sma20Val < sma50Val) {
    score -= 1;
    reasons.push("downtrend (SMA20<SMA50)");
  }

  if (rsiVal < 30) {
    score += 2;
    reasons.push(`oversold RSI ${rsiVal.toFixed(0)}`);
  } else if (rsiVal > 70) {
    score -= 2;
    reasons.push(`overbought RSI ${rsiVal.toFixed(0)}`);
  } else {
    reasons.push(`neutral RSI ${rsiVal.toFixed(0)}`);
  }

  let signal: Signal = "HOLD";
  if (score >= 2) signal = "BUY";
  else if (score <= -2) signal = "SELL";

  return { signal, reason: reasons.join(" · ") };
}

async function fetchOne(symbol: string, name: string): Promise<StockQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=3mo`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LovableStocks/1.0)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    const closes: number[] = (result.indicators?.quote?.[0]?.close ?? []).filter(
      (v: number | null): v is number => typeof v === "number" && !Number.isNaN(v),
    );
    const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? closes[closes.length - 2] ?? price;
    const change = price - prev;
    const changePct = prev ? (change / prev) * 100 : 0;
    const sma20Val = sma(closes, 20);
    const sma50Val = sma(closes, 50);
    const rsiVal = rsi(closes, 14);
    const { signal, reason } = deriveSignal(price, sma20Val, sma50Val, rsiVal);

    return {
      symbol,
      name,
      price,
      previousClose: prev,
      change,
      changePercent: changePct,
      currency: meta.currency ?? "INR",
      sma20: sma20Val,
      sma50: sma50Val,
      rsi: rsiVal,
      signal,
      reason,
      suggestedBuyPrice: Math.min(price, sma20Val) * 0.98,
      suggestedSellPrice: Math.max(price, sma20Val) * 1.05,
      updatedAt: Date.now(),
    };
  } catch (e) {
    console.error("fetchOne failed", symbol, e);
    return null;
  }
}

export const getIndianStocks = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.all(DEFAULT_TICKERS.map((t) => fetchOne(t.symbol, t.name)));
  const quotes = results.filter((q): q is StockQuote => q !== null);
  return { quotes, fetchedAt: Date.now() };
});
