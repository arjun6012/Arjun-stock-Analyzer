import { createServerFn } from "@tanstack/react-start";

export type Signal = "BUY" | "SELL" | "HOLD";

export interface NewsItem {
  title: string;
  link: string;
  publisher: string;
  publishedAt: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
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
  suggestedSellPrice: number;
  suggestedBuyPrice: number;
  updatedAt: number;
}


const DEFAULT_TICKERS: { symbol: string; name: string; sector: string }[] = [
  // Banking & Financials
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking" },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", sector: "Banking" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank", sector: "Banking" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "Financials" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv", sector: "Financials" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance" },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance" },
  // IT
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT" },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", sector: "IT" },
  { symbol: "TECHM.NS", name: "Tech Mahindra", sector: "IT" },
  { symbol: "LTIM.NS", name: "LTIMindtree", sector: "IT" },
  // Energy & Oil
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { symbol: "ONGC.NS", name: "Oil & Natural Gas Corp", sector: "Energy" },
  { symbol: "NTPC.NS", name: "NTPC", sector: "Power" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp", sector: "Power" },
  { symbol: "COALINDIA.NS", name: "Coal India", sector: "Energy" },
  { symbol: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure" },
  // Auto
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Auto" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Auto" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors", sector: "Auto" },
  // FMCG
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "FMCG" },
  { symbol: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG" },
  // Pharma
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Laboratories", sector: "Pharma" },
  { symbol: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals", sector: "Healthcare" },
  // Metals & Materials
  { symbol: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Conglomerate" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Cement" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", sector: "Paints" },
  // Telecom & Infra
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure" },
  // Consumer & Retail
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Retail" },
  { symbol: "DMART.NS", name: "Avenue Supermarts (DMart)", sector: "Retail" },
  { symbol: "TRENT.NS", name: "Trent", sector: "Retail" },
  { symbol: "ZOMATO.NS", name: "Zomato (Eternal)", sector: "Tech" },
  { symbol: "PAYTM.NS", name: "Paytm", sector: "Fintech" },
  { symbol: "NYKAA.NS", name: "Nykaa", sector: "Retail" },
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
