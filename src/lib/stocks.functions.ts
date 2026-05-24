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
  sma200: number;
  ema12: number;
  ema26: number;
  macd: number;
  macdSignal: number;
  macdHist: number;
  rsi: number;
  bbUpper: number;
  bbLower: number;
  bbMid: number;
  bbPct: number; // 0..1 position within bands
  week52High: number;
  week52Low: number;
  pctFrom52High: number; // negative = below high
  pctFrom52Low: number;
  momentum1m: number; // % over ~21 trading days
  momentum3m: number; // % over ~63 trading days
  avgVolume20: number;
  volumeRatio: number; // recent 5d avg / 20d avg
  signal: Signal;
  confidence: number; // 0..100
  score: number;
  reasons: string[];
  reason: string;
  suggestedSellPrice: number;
  suggestedBuyPrice: number;
  updatedAt: number;
}


const DEFAULT_TICKERS: { symbol: string; name: string; sector: string }[] = [
  // Banking
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking" },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", sector: "Banking" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank", sector: "Banking" },
  { symbol: "PNB.NS", name: "Punjab National Bank", sector: "Banking" },
  { symbol: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking" },
  { symbol: "CANBK.NS", name: "Canara Bank", sector: "Banking" },
  { symbol: "UNIONBANK.NS", name: "Union Bank of India", sector: "Banking" },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank", sector: "Banking" },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank", sector: "Banking" },
  { symbol: "AUBANK.NS", name: "AU Small Finance Bank", sector: "Banking" },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank", sector: "Banking" },
  { symbol: "RBLBANK.NS", name: "RBL Bank", sector: "Banking" },
  { symbol: "YESBANK.NS", name: "Yes Bank", sector: "Banking" },
  // Financials / NBFC
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "Financials" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv", sector: "Financials" },
  { symbol: "JIOFIN.NS", name: "Jio Financial Services", sector: "Financials" },
  { symbol: "CHOLAFIN.NS", name: "Cholamandalam Investment", sector: "Financials" },
  { symbol: "SHRIRAMFIN.NS", name: "Shriram Finance", sector: "Financials" },
  { symbol: "MUTHOOTFIN.NS", name: "Muthoot Finance", sector: "Financials" },
  { symbol: "LICHSGFIN.NS", name: "LIC Housing Finance", sector: "Financials" },
  { symbol: "PFC.NS", name: "Power Finance Corp", sector: "Financials" },
  { symbol: "RECLTD.NS", name: "REC Limited", sector: "Financials" },
  { symbol: "IRFC.NS", name: "Indian Railway Finance Corp", sector: "Financials" },
  { symbol: "HDFCAMC.NS", name: "HDFC Asset Management", sector: "Financials" },
  { symbol: "BSE.NS", name: "BSE Limited", sector: "Financials" },
  // Insurance
  { symbol: "LICI.NS", name: "Life Insurance Corp of India", sector: "Insurance" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance" },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance" },
  { symbol: "ICICIGI.NS", name: "ICICI Lombard General Insurance", sector: "Insurance" },
  { symbol: "ICICIPRULI.NS", name: "ICICI Prudential Life", sector: "Insurance" },
  // IT
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT" },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", sector: "IT" },
  { symbol: "TECHM.NS", name: "Tech Mahindra", sector: "IT" },
  { symbol: "LTIM.NS", name: "LTIMindtree", sector: "IT" },
  { symbol: "PERSISTENT.NS", name: "Persistent Systems", sector: "IT" },
  { symbol: "COFORGE.NS", name: "Coforge", sector: "IT" },
  { symbol: "MPHASIS.NS", name: "Mphasis", sector: "IT" },
  { symbol: "OFSS.NS", name: "Oracle Financial Services", sector: "IT" },
  // Energy & Oil
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { symbol: "ONGC.NS", name: "Oil & Natural Gas Corp", sector: "Energy" },
  { symbol: "COALINDIA.NS", name: "Coal India", sector: "Energy" },
  { symbol: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy" },
  { symbol: "IOC.NS", name: "Indian Oil Corporation", sector: "Energy" },
  { symbol: "HINDPETRO.NS", name: "Hindustan Petroleum", sector: "Energy" },
  { symbol: "GAIL.NS", name: "GAIL India", sector: "Energy" },
  { symbol: "OIL.NS", name: "Oil India", sector: "Energy" },
  { symbol: "PETRONET.NS", name: "Petronet LNG", sector: "Energy" },
  // Power & Utilities
  { symbol: "NTPC.NS", name: "NTPC", sector: "Power" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp", sector: "Power" },
  { symbol: "ADANIPOWER.NS", name: "Adani Power", sector: "Power" },
  { symbol: "ADANIGREEN.NS", name: "Adani Green Energy", sector: "Power" },
  { symbol: "TATAPOWER.NS", name: "Tata Power", sector: "Power" },
  { symbol: "JSWENERGY.NS", name: "JSW Energy", sector: "Power" },
  { symbol: "NHPC.NS", name: "NHPC", sector: "Power" },
  { symbol: "SJVN.NS", name: "SJVN", sector: "Power" },
  { symbol: "TORNTPOWER.NS", name: "Torrent Power", sector: "Power" },
  { symbol: "SUZLON.NS", name: "Suzlon Energy", sector: "Power" },
  // Conglomerate
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Conglomerate" },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "Conglomerate" },
  // Infra & Construction
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure" },
  { symbol: "GMRINFRA.NS", name: "GMR Airports", sector: "Infrastructure" },
  { symbol: "IRB.NS", name: "IRB Infrastructure", sector: "Infrastructure" },
  // Auto
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Auto" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Auto" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors", sector: "Auto" },
  { symbol: "TVSMOTOR.NS", name: "TVS Motor", sector: "Auto" },
  { symbol: "ASHOKLEY.NS", name: "Ashok Leyland", sector: "Auto" },
  { symbol: "BOSCHLTD.NS", name: "Bosch", sector: "Auto" },
  { symbol: "MOTHERSON.NS", name: "Samvardhana Motherson", sector: "Auto" },
  { symbol: "BALKRISIND.NS", name: "Balkrishna Industries", sector: "Auto" },
  { symbol: "MRF.NS", name: "MRF", sector: "Auto" },
  // FMCG
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG" },
  { symbol: "DABUR.NS", name: "Dabur India", sector: "FMCG" },
  { symbol: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "FMCG" },
  { symbol: "MARICO.NS", name: "Marico", sector: "FMCG" },
  { symbol: "COLPAL.NS", name: "Colgate-Palmolive India", sector: "FMCG" },
  { symbol: "UBL.NS", name: "United Breweries", sector: "FMCG" },
  { symbol: "MCDOWELL-N.NS", name: "United Spirits", sector: "FMCG" },
  { symbol: "VBL.NS", name: "Varun Beverages", sector: "FMCG" },
  // Pharma & Healthcare
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Laboratories", sector: "Pharma" },
  { symbol: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "LUPIN.NS", name: "Lupin", sector: "Pharma" },
  { symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharma" },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharmaceuticals", sector: "Pharma" },
  { symbol: "ZYDUSLIFE.NS", name: "Zydus Lifesciences", sector: "Pharma" },
  { symbol: "ALKEM.NS", name: "Alkem Laboratories", sector: "Pharma" },
  { symbol: "BIOCON.NS", name: "Biocon", sector: "Pharma" },
  { symbol: "GLENMARK.NS", name: "Glenmark Pharmaceuticals", sector: "Pharma" },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals", sector: "Healthcare" },
  { symbol: "MAXHEALTH.NS", name: "Max Healthcare", sector: "Healthcare" },
  { symbol: "FORTIS.NS", name: "Fortis Healthcare", sector: "Healthcare" },
  // Metals & Mining
  { symbol: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "VEDL.NS", name: "Vedanta", sector: "Metals" },
  { symbol: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { symbol: "JINDALSTEL.NS", name: "Jindal Steel & Power", sector: "Metals" },
  { symbol: "NMDC.NS", name: "NMDC", sector: "Metals" },
  { symbol: "NATIONALUM.NS", name: "National Aluminium", sector: "Metals" },
  { symbol: "HINDZINC.NS", name: "Hindustan Zinc", sector: "Metals" },
  // Cement
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Cement" },
  { symbol: "AMBUJACEM.NS", name: "Ambuja Cements", sector: "Cement" },
  { symbol: "ACC.NS", name: "ACC", sector: "Cement" },
  { symbol: "SHREECEM.NS", name: "Shree Cement", sector: "Cement" },
  { symbol: "DALBHARAT.NS", name: "Dalmia Bharat", sector: "Cement" },
  // Paints & Chemicals
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", sector: "Paints" },
  { symbol: "BERGEPAINT.NS", name: "Berger Paints", sector: "Paints" },
  { symbol: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Chemicals" },
  { symbol: "SRF.NS", name: "SRF", sector: "Chemicals" },
  { symbol: "UPL.NS", name: "UPL", sector: "Chemicals" },
  { symbol: "DEEPAKNTR.NS", name: "Deepak Nitrite", sector: "Chemicals" },
  { symbol: "TATACHEM.NS", name: "Tata Chemicals", sector: "Chemicals" },
  // Telecom & Media
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "IDEA.NS", name: "Vodafone Idea", sector: "Telecom" },
  { symbol: "INDUSTOWER.NS", name: "Indus Towers", sector: "Telecom" },
  { symbol: "TATACOMM.NS", name: "Tata Communications", sector: "Telecom" },
  { symbol: "ZEEL.NS", name: "Zee Entertainment", sector: "Media" },
  { symbol: "PVRINOX.NS", name: "PVR Inox", sector: "Media" },
  // Consumer & Retail
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Retail" },
  { symbol: "DMART.NS", name: "Avenue Supermarts (DMart)", sector: "Retail" },
  { symbol: "TRENT.NS", name: "Trent", sector: "Retail" },
  { symbol: "NYKAA.NS", name: "Nykaa", sector: "Retail" },
  { symbol: "ABFRL.NS", name: "Aditya Birla Fashion & Retail", sector: "Retail" },
  { symbol: "PAGEIND.NS", name: "Page Industries", sector: "Retail" },
  { symbol: "VOLTAS.NS", name: "Voltas", sector: "Consumer Durables" },
  { symbol: "HAVELLS.NS", name: "Havells India", sector: "Consumer Durables" },
  { symbol: "CROMPTON.NS", name: "Crompton Greaves Consumer", sector: "Consumer Durables" },
  { symbol: "DIXON.NS", name: "Dixon Technologies", sector: "Consumer Durables" },
  // Tech / Fintech / New Age
  { symbol: "ZOMATO.NS", name: "Zomato (Eternal)", sector: "Tech" },
  { symbol: "PAYTM.NS", name: "Paytm", sector: "Fintech" },
  { symbol: "POLICYBZR.NS", name: "PB Fintech (Policybazaar)", sector: "Fintech" },
  { symbol: "NAUKRI.NS", name: "Info Edge (Naukri)", sector: "Tech" },
  { symbol: "IRCTC.NS", name: "IRCTC", sector: "Tech" },
  // Defence & Capital Goods
  { symbol: "HAL.NS", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "BEL.NS", name: "Bharat Electronics", sector: "Defence" },
  { symbol: "MAZDOCK.NS", name: "Mazagon Dock Shipbuilders", sector: "Defence" },
  { symbol: "BHEL.NS", name: "Bharat Heavy Electricals", sector: "Capital Goods" },
  { symbol: "SIEMENS.NS", name: "Siemens India", sector: "Capital Goods" },
  { symbol: "ABB.NS", name: "ABB India", sector: "Capital Goods" },
  { symbol: "CUMMINSIND.NS", name: "Cummins India", sector: "Capital Goods" },
  // Real Estate
  { symbol: "DLF.NS", name: "DLF", sector: "Real Estate" },
  { symbol: "GODREJPROP.NS", name: "Godrej Properties", sector: "Real Estate" },
  { symbol: "OBEROIRLTY.NS", name: "Oberoi Realty", sector: "Real Estate" },
  { symbol: "PRESTIGE.NS", name: "Prestige Estates", sector: "Real Estate" },
  { symbol: "LODHA.NS", name: "Macrotech Developers (Lodha)", sector: "Real Estate" },
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

async function fetchOne(symbol: string, name: string, sector: string): Promise<StockQuote | null> {
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
      sector,
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
  const results = await Promise.all(DEFAULT_TICKERS.map((t) => fetchOne(t.symbol, t.name, t.sector)));
  const quotes = results.filter((q): q is StockQuote => q !== null);
  return { quotes, fetchedAt: Date.now() };
});

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/<[^>]+>/g, "")
    .trim();
}

export const getStockNews = createServerFn({ method: "GET" })
  .inputValidator((data: { symbol: string; name: string }) => data)
  .handler(async ({ data }): Promise<{ news: NewsItem[] }> => {
    try {
      // Strip parenthetical aliases, e.g. "Zomato (Eternal)" -> "Zomato"
      const cleanName = data.name.replace(/\s*\(.*?\)\s*/g, "").trim();
      // Use the company name + share/stock + India to keep results on-topic.
      const query = `"${cleanName}" (share OR stock OR shares OR NSE OR BSE)`;
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LovableStocks/1.0)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      if (!res.ok) return { news: [] };
      const xml = await res.text();
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
      const lowerName = cleanName.toLowerCase();
      const nameTokens = lowerName.split(/\s+/).filter((t) => t.length > 2);

      const news: NewsItem[] = items
        .map((block) => {
          const pick = (tag: string) => {
            const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
            if (!m) return "";
            return decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, ""));
          };
          const title = pick("title");
          const link = pick("link");
          const pubDate = pick("pubDate");
          const source = pick("source") || "Google News";
          return {
            title,
            link,
            publisher: source,
            publishedAt: pubDate ? new Date(pubDate).getTime() : 0,
          };
        })
        .filter((n) => {
          if (!n.title || !n.link) return false;
          const t = n.title.toLowerCase();
          // Require the company name (or one of its meaningful tokens) to appear
          // in the title — drops unrelated market-wide headlines.
          if (t.includes(lowerName)) return true;
          return nameTokens.some((tok) => t.includes(tok));
        })
        .slice(0, 10);

      return { news };
    } catch (e) {
      console.error("getStockNews failed", data.symbol, e);
      return { news: [] };
    }
  });


