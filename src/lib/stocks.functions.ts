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
  // New indicators
  adx: number;
  adxTrend: "STRONG" | "WEAK" | "SIDEWAYS";
  mfi: number;
  macdCross: "BULLISH" | "BEARISH" | "NONE";
  fib236: number;
  fib382: number;
  fib500: number;
  fib618: number;
  fib786: number;
  pivotPP: number;
  pivotS1: number;
  pivotS2: number;
  pivotR1: number;
  pivotR2: number;
  accumulationZoneMin: number;
  accumulationZoneMax: number;
  target1: number;
  target2: number;
  stopLoss: number;
  confluenceReasons: string[];
  confidenceTier: "HIGH" | "MEDIUM" | "LOW";
  ema9: number;
  ema21: number;
  ema55: number;
  bbWidth: number;
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
  { symbol: "IDBI.NS", name: "IDBI Bank", sector: "Banking" },
  { symbol: "BOI.NS", name: "Bank of India", sector: "Banking" },
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
  { symbol: "M&MFIN.NS", name: "M&M Financial Services", sector: "Financials" },
  { symbol: "HUDCO.NS", name: "Housing & Urban Development Corp", sector: "Financials" },
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
  { symbol: "TATAELXSI.NS", name: "Tata Elxsi", sector: "IT" },
  { symbol: "KPITTECH.NS", name: "KPIT Technologies", sector: "IT" },
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
  { symbol: "MRPL.NS", name: "Mangalore Refinery", sector: "Energy" },
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
  { symbol: "IREDA.NS", name: "IREDA (Renewable Energy)", sector: "Power" },
  // Conglomerate
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Conglomerate" },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "Conglomerate" },
  { symbol: "TATAINVEST.NS", name: "Tata Investment Corporation", sector: "Conglomerate" },
  // Infra & Construction
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure" },
  { symbol: "GMRINFRA.NS", name: "GMR Airports", sector: "Infrastructure" },
  { symbol: "IRB.NS", name: "IRB Infrastructure", sector: "Infrastructure" },
  { symbol: "RVNL.NS", name: "Rail Vikas Nigam (RVNL)", sector: "Infrastructure" },
  { symbol: "IRCON.NS", name: "Ircon International", sector: "Infrastructure" },
  { symbol: "RAILTEL.NS", name: "RailTel Corporation", sector: "Infrastructure" },
  { symbol: "CONCOR.NS", name: "Container Corp (CONCOR)", sector: "Infrastructure" },
  { symbol: "NBCC.NS", name: "NBCC India", sector: "Infrastructure" },
  // Auto
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "TATAMTRDVR.NS", name: "Tata Motors DVR", sector: "Auto" },
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
  { symbol: "APOLLOTYRE.NS", name: "Apollo Tyres", sector: "Auto" },
  { symbol: "EXIDEIND.NS", name: "Exide Industries", sector: "Auto" },
  { symbol: "ARE&M.NS", name: "Amara Raja Energy", sector: "Auto" },
  { symbol: "SONACOMS.NS", name: "Sona BLW Precision", sector: "Auto" },
  { symbol: "UNOINDA.NS", name: "Uno Minda", sector: "Auto" },
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
  { symbol: "MANKIND.NS", name: "Mankind Pharma", sector: "Pharma" },
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
  { symbol: "HINDCOPPER.NS", name: "Hindustan Copper", sector: "Metals" },
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
  { symbol: "KALYANKJIL.NS", name: "Kalyan Jewellers", sector: "Retail" },
  { symbol: "VOLTAS.NS", name: "Voltas", sector: "Consumer Durables" },
  { symbol: "HAVELLS.NS", name: "Havells India", sector: "Consumer Durables" },
  { symbol: "CROMPTON.NS", name: "Crompton Greaves Consumer", sector: "Consumer Durables" },
  { symbol: "DIXON.NS", name: "Dixon Technologies", sector: "Consumer Durables" },
  // Tech / Fintech / New Age
  { symbol: "ZOMATO.NS", name: "Zomato", sector: "Tech" },
  { symbol: "PAYTM.NS", name: "Paytm", sector: "Fintech" },
  { symbol: "POLICYBZR.NS", name: "PB Fintech (Policybazaar)", sector: "Fintech" },
  { symbol: "NAUKRI.NS", name: "Info Edge (Naukri)", sector: "Tech" },
  { symbol: "IRCTC.NS", name: "IRCTC", sector: "Tech" },
  // Defence & Capital Goods
  { symbol: "HAL.NS", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "BEL.NS", name: "Bharat Electronics", sector: "Defence" },
  { symbol: "MAZDOCK.NS", name: "Mazagon Dock Shipbuilders", sector: "Defence" },
  { symbol: "COCHINSHIP.NS", name: "Cochin Shipyard", sector: "Defence" },
  { symbol: "BDL.NS", name: "Bharat Dynamics (BDL)", sector: "Defence" },
  { symbol: "GRSE.NS", name: "Garden Reach Shipbuilders", sector: "Defence" },
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

function emaSeries(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  // seed with SMA of first `period` (or first value if too short)
  const seedCount = Math.min(period, values.length);
  let seed = 0;
  for (let i = 0; i < seedCount; i++) seed += values[i];
  seed /= seedCount;
  out.push(seed);
  for (let i = 1; i < values.length; i++) {
    const prev = out[out.length - 1];
    out.push(values[i] * k + prev * (1 - k));
  }
  return out;
}

function ema(values: number[], period: number): number {
  const series = emaSeries(values, period);
  return series.length ? series[series.length - 1] : 0;
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateADX(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14,
): { adx: number; trend: "STRONG" | "WEAK" | "SIDEWAYS" } {
  if (closes.length < period * 2) {
    return { adx: 20, trend: "SIDEWAYS" };
  }
  const tr: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const hDiff = highs[i] - highs[i - 1];
    const lDiff = lows[i - 1] - lows[i];

    const trVal = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1]),
    );
    tr.push(trVal);

    const pDM = hDiff > lDiff && hDiff > 0 ? hDiff : 0;
    const mDM = lDiff > hDiff && lDiff > 0 ? lDiff : 0;
    plusDM.push(pDM);
    minusDM.push(mDM);
  }

  // Wilder's Smoothing for initial period
  let trSmoothed = tr.slice(0, period).reduce((a, b) => a + b, 0);
  let plusDMSmoothed = plusDM.slice(0, period).reduce((a, b) => a + b, 0);
  let minusDMSmoothed = minusDM.slice(0, period).reduce((a, b) => a + b, 0);

  const dxValues: number[] = [];
  const initialPlusDI = trSmoothed > 0 ? (plusDMSmoothed / trSmoothed) * 100 : 0;
  const initialMinusDI = trSmoothed > 0 ? (minusDMSmoothed / trSmoothed) * 100 : 0;
  const initialDX =
    (Math.abs(initialPlusDI - initialMinusDI) / (initialPlusDI + initialMinusDI || 1)) * 100;
  dxValues.push(initialDX);

  for (let i = period; i < tr.length; i++) {
    trSmoothed = trSmoothed - trSmoothed / period + tr[i];
    plusDMSmoothed = plusDMSmoothed - plusDMSmoothed / period + plusDM[i];
    minusDMSmoothed = minusDMSmoothed - minusDMSmoothed / period + minusDM[i];

    const plusDI = trSmoothed > 0 ? (plusDMSmoothed / trSmoothed) * 100 : 0;
    const minusDI = trSmoothed > 0 ? (minusDMSmoothed / trSmoothed) * 100 : 0;
    const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI || 1)) * 100;
    dxValues.push(dx);
  }

  if (dxValues.length < period) {
    return { adx: 20, trend: "SIDEWAYS" };
  }

  let adx = dxValues.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < dxValues.length; i++) {
    adx = (adx * (period - 1) + dxValues[i]) / period;
  }

  let trend: "STRONG" | "WEAK" | "SIDEWAYS" = "SIDEWAYS";
  if (adx > 25) trend = "STRONG";
  else if (adx < 20) trend = "WEAK";

  return { adx, trend };
}

function calculateMFI(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period = 14,
): number {
  if (closes.length < period + 1) return 50;
  const typicalPrices: number[] = [];
  const rawMoneyFlows: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    typicalPrices.push(tp);
    rawMoneyFlows.push(tp * (volumes[i] || 0));
  }

  let positiveFlow = 0;
  let negativeFlow = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    if (i <= 0) continue;
    if (typicalPrices[i] > typicalPrices[i - 1]) {
      positiveFlow += rawMoneyFlows[i];
    } else if (typicalPrices[i] < typicalPrices[i - 1]) {
      negativeFlow += rawMoneyFlows[i];
    }
  }

  if (negativeFlow === 0) return 100;
  const mr = positiveFlow / negativeFlow;
  return 100 - 100 / (1 + mr);
}

function detectMACDCrossover(
  macdLine: number[],
  macdSignal: number[],
): "BULLISH" | "BEARISH" | "NONE" {
  const len = macdLine.length;
  if (len < 3) return "NONE";
  const todayMacd = macdLine[len - 1];
  const todaySig = macdSignal[len - 1];
  const yesterdayMacd = macdLine[len - 2];
  const yesterdaySig = macdSignal[len - 2];

  if (yesterdayMacd <= yesterdaySig && todayMacd > todaySig) {
    return "BULLISH";
  }
  if (yesterdayMacd >= yesterdaySig && todayMacd < todaySig) {
    return "BEARISH";
  }
  return "NONE";
}

interface Indicators {
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
  bbPct: number;
  week52High: number;
  week52Low: number;
  pctFrom52High: number;
  pctFrom52Low: number;
  momentum1m: number;
  momentum3m: number;
  avgVolume20: number;
  volumeRatio: number;
  adx: number;
  adxTrend: "STRONG" | "WEAK" | "SIDEWAYS";
  mfi: number;
  macdCross: "BULLISH" | "BEARISH" | "NONE";
  fib236: number;
  fib382: number;
  fib500: number;
  fib618: number;
  fib786: number;
  pivotPP: number;
  pivotS1: number;
  pivotS2: number;
  pivotR1: number;
  pivotR2: number;
  ema9: number;
  ema21: number;
  ema55: number;
  bbWidth: number;
}

function deriveSignal(
  price: number,
  ind: Indicators,
): {
  signal: Signal;
  reasons: string[];
  score: number;
  confidence: number;
  confluenceReasons: string[];
  confidenceTier: "HIGH" | "MEDIUM" | "LOW";
} {
  let score = 0;
  const reasons: string[] = [];
  const confluenceReasons: string[] = [];

  const isTrendStrong = ind.adxTrend === "STRONG";
  const isTrendWeak = ind.adxTrend === "WEAK";

  // Base Indicators calculations:
  // 1. Long-term Trend: price vs SMA200
  if (ind.sma200 && price > ind.sma200) {
    const wt = isTrendStrong ? 1.5 : 1.0;
    score += wt;
    reasons.push("Above 200-day MA (long uptrend)");
  } else if (ind.sma200 && price < ind.sma200) {
    const wt = isTrendStrong ? 1.5 : 1.0;
    score -= wt;
    reasons.push("Below 200-day MA (long downtrend)");
  }

  // 2. Short/Mid trend: SMA20 vs SMA50
  if (ind.sma20 > ind.sma50) {
    const wt = isTrendStrong ? 1.5 : 1.0;
    score += wt;
    reasons.push("SMA20 > SMA50 (bullish cross)");
  } else if (ind.sma20 < ind.sma50) {
    const wt = isTrendStrong ? 1.5 : 1.0;
    score -= wt;
    reasons.push("SMA20 < SMA50 (bearish cross)");
  }

  // 3. MACD histogram momentum
  if (ind.macdHist > 0) {
    score += 1;
    reasons.push(`MACD positive (${ind.macdHist.toFixed(2)})`);
  } else if (ind.macdHist < 0) {
    score -= 1;
    reasons.push(`MACD negative (${ind.macdHist.toFixed(2)})`);
  }

  // 4. MACD Crossover
  if (ind.macdCross === "BULLISH") {
    score += 1.5;
    reasons.push("Bullish MACD crossover");
  } else if (ind.macdCross === "BEARISH") {
    score -= 1.5;
    reasons.push("Bearish MACD crossover");
  }

  // 5. RSI extremes
  const rsiWeight = isTrendWeak ? 2.5 : 2.0;
  if (ind.rsi < 30) {
    score += rsiWeight;
    reasons.push(`Oversold RSI ${ind.rsi.toFixed(0)}`);
  } else if (ind.rsi > 70) {
    score -= rsiWeight;
    reasons.push(`Overbought RSI ${ind.rsi.toFixed(0)}`);
  } else if (ind.rsi >= 50 && ind.rsi <= 65) {
    score += 0.5;
    reasons.push(`Healthy RSI ${ind.rsi.toFixed(0)}`);
  } else {
    reasons.push(`Neutral RSI ${ind.rsi.toFixed(0)}`);
  }

  // 6. Money Flow Index (MFI)
  if (ind.mfi < 20) {
    score += 1.5;
    reasons.push(`Oversold MFI ${ind.mfi.toFixed(0)}`);
  } else if (ind.mfi > 80) {
    score -= 1.5;
    reasons.push(`Overbought MFI ${ind.mfi.toFixed(0)}`);
  }

  // 7. Bollinger position
  const bbWeight = isTrendWeak ? 1.5 : 1.0;
  if (ind.bbPct <= 0.1) {
    score += bbWeight;
    reasons.push("Near lower Bollinger band");
  } else if (ind.bbPct >= 0.9) {
    score -= bbWeight;
    reasons.push("Near upper Bollinger band");
  }

  // 8. Fibonacci Retracement Support/Resistance
  const isNearFib618 = Math.abs(price - ind.fib618) / ind.fib618 <= 0.02;
  const isNearFib500 = Math.abs(price - ind.fib500) / ind.fib500 <= 0.02;
  if (isNearFib618) {
    if (price >= ind.fib618) {
      score += 1.0;
      reasons.push("Holding 61.8% Fibonacci support");
    } else {
      score -= 0.5;
      reasons.push("Broke 61.8% Fibonacci support");
    }
  } else if (isNearFib500) {
    if (price >= ind.fib500) {
      score += 0.8;
      reasons.push("Holding 50% Fibonacci support");
    } else {
      score -= 0.4;
      reasons.push("Broke 50% Fibonacci support");
    }
  }

  // 9. Pivot Point Proximity
  const isNearS1 = Math.abs(price - ind.pivotS1) / ind.pivotS1 <= 0.015;
  const isNearS2 = Math.abs(price - ind.pivotS2) / ind.pivotS2 <= 0.015;
  if (isNearS1 && price >= ind.pivotS1) {
    score += 0.5;
    reasons.push("Holding Pivot Support S1");
  } else if (isNearS2 && price >= ind.pivotS2) {
    score += 1.0;
    reasons.push("Holding Pivot Support S2");
  }

  // 10. 52-week position
  if (ind.pctFrom52Low < 15 && ind.pctFrom52Low > 0) {
    score += 1;
    reasons.push(`Only ${ind.pctFrom52Low.toFixed(1)}% above 52w low`);
  }
  if (ind.pctFrom52High > -5 && ind.pctFrom52High <= 0) {
    score -= 1;
    reasons.push(`Within ${Math.abs(ind.pctFrom52High).toFixed(1)}% of 52w high`);
  }

  // 11. Momentum
  if (ind.momentum1m > 8) {
    score += 0.5;
    reasons.push(`1m momentum +${ind.momentum1m.toFixed(1)}%`);
  } else if (ind.momentum1m < -8) {
    score -= 0.5;
    reasons.push(`1m momentum ${ind.momentum1m.toFixed(1)}%`);
  }

  // 12. Volume surge with positive momentum
  if (ind.volumeRatio > 1.3 && ind.momentum1m > 0) {
    score += 1.0;
    reasons.push(`Volume surge ${ind.volumeRatio.toFixed(2)}x`);
  } else if (ind.volumeRatio > 1.3 && ind.momentum1m < 0) {
    score -= 1.0;
    reasons.push(`Heavy selling volume ${ind.volumeRatio.toFixed(2)}x`);
  }

  // ==================== PROVEN TRADING STRATEGIES ====================

  // Strategy 1: Trend Pullback Strategy (Buy-the-Dip in long-term uptrend)
  const isLongTermUptrend = ind.sma200 && price > ind.sma200;
  const isShortTermPullback = ind.rsi < 45 || ind.mfi < 30 || price <= ind.sma20;
  if (isLongTermUptrend && isShortTermPullback) {
    score += 2.5;
    reasons.push("Buy-the-Dip pullback in long-term uptrend");
    confluenceReasons.push("Strategy: Trend Pullback (Price > SMA200 + Oversold pullback)");
  }

  // Strategy 2: High-Volume Momentum Breakout (EMA Ribbon Continuation)
  const isEMABullishAlignment = ind.ema9 > ind.ema21 && ind.ema21 > ind.ema55;
  const isVolumeSupported = ind.volumeRatio > 1.3;
  if (isEMABullishAlignment && isVolumeSupported && price > ind.sma50) {
    score += 2.0;
    reasons.push("High-volume EMA ribbon momentum breakout");
    confluenceReasons.push("Strategy: Volume Breakout (EMA 9/21/55 aligned + Volume Surge)");
  }

  // Strategy 3: Mean Reversion / Extreme Band Reversal
  const isExtremeOversold = ind.rsi < 32 && ind.mfi < 25;
  const isLowerBandTouch = ind.bbPct <= 0.08;
  if (isExtremeOversold && isLowerBandTouch) {
    score += 3.0;
    reasons.push("Extreme oversold Bollinger Lower Band mean-reversion buy");
    confluenceReasons.push(
      "Strategy: Extreme Mean Reversion (RSI/MFI oversold + Lower Band touch)",
    );
  }

  // Strategy 4: Volatility Squeeze Breakout (John Carter Squeeze)
  const isBBSqueeze = ind.bbWidth < 0.08;
  if (isBBSqueeze) {
    if (ind.macdCross === "BULLISH" || (ind.macdHist > 0 && ind.momentum1m > 2)) {
      score += 2.0;
      reasons.push("Bullish squeeze breakout");
      confluenceReasons.push(
        "Strategy: Volatility Squeeze Bullish Breakout (BB Width < 8% + MACD Bullish)",
      );
    } else if (ind.macdCross === "BEARISH" || (ind.macdHist < 0 && ind.momentum1m < -2)) {
      score -= 2.0;
      reasons.push("Bearish squeeze breakdown");
      confluenceReasons.push(
        "Strategy: Volatility Squeeze Bearish Breakdown (BB Width < 8% + MACD Bearish)",
      );
    }
  }

  // Strategy 5: Bearish Trend Retracement (Sell-the-Rip in downtrends)
  const isLongTermDowntrend = ind.sma200 && price < ind.sma200;
  const isShortTermOverboughtRip = ind.rsi > 58 || ind.mfi > 70 || price >= ind.sma20;
  if (isLongTermDowntrend && isShortTermOverboughtRip) {
    score -= 2.5;
    reasons.push("Short-term overbought rip in long-term downtrend");
    confluenceReasons.push(
      "Strategy: Bearish Trend Retracement (Price < SMA200 + Overbought pullback)",
    );
  }

  let signal: Signal = "HOLD";
  if (score >= 2.5) signal = "BUY";
  else if (score <= -2.5) signal = "SELL";

  // Confidence scaled to a maximum expected strategy confluence score of ~10
  const confidence = Math.max(20, Math.min(100, Math.round((Math.abs(score) / 10) * 100)));

  let confidenceTier: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (confidence >= 75) confidenceTier = "HIGH";
  else if (confidence >= 45) confidenceTier = "MEDIUM";

  return { signal, reasons, score, confidence, confluenceReasons, confidenceTier };
}

async function fetchOne(symbol: string, name: string, sector: string): Promise<StockQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LovableStocks/1.0)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (await res.json()) as any;
    const result = json?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    const rawCloses: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
    const rawHighs: (number | null)[] = result.indicators?.quote?.[0]?.high ?? [];
    const rawLows: (number | null)[] = result.indicators?.quote?.[0]?.low ?? [];
    const rawVols: (number | null)[] = result.indicators?.quote?.[0]?.volume ?? [];

    const closes: number[] = rawCloses.filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v),
    );
    const highs: number[] = rawHighs.filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v),
    );
    const lows: number[] = rawLows.filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v),
    );
    const volumes: number[] = rawVols.filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v),
    );

    if (closes.length < 20) return null;

    const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
    const prev =
      meta.chartPreviousClose ?? meta.previousClose ?? closes[closes.length - 2] ?? price;
    const change = price - prev;
    const changePercent = prev ? (change / prev) * 100 : 0;

    const sma20Val = sma(closes, 20);
    const sma50Val = sma(closes, 50);
    const sma200Val = sma(closes, 200);
    const ema9Val = ema(closes, 9);
    const ema21Val = ema(closes, 21);
    const ema55Val = ema(closes, 55);
    const ema12Val = ema(closes, 12);
    const ema26Val = ema(closes, 26);

    const ema12Series = emaSeries(closes, 12);
    const ema26Series = emaSeries(closes, 26);
    const macdLineSeries: number[] = [];
    const len = Math.min(ema12Series.length, ema26Series.length);
    for (let i = 0; i < len; i++) macdLineSeries.push(ema12Series[i] - ema26Series[i]);
    const macdSignalVal = ema(macdLineSeries, 9);
    const macdVal = macdLineSeries[macdLineSeries.length - 1] ?? 0;
    const macdHist = macdVal - macdSignalVal;

    const rsiVal = rsi(closes, 14);

    const last20 = closes.slice(-20);
    const bbMid = sma20Val;
    const sd = stddev(last20);
    const bbUpper = bbMid + 2 * sd;
    const bbLower = bbMid - 2 * sd;
    const bbRange = bbUpper - bbLower;
    const bbPct = bbRange > 0 ? Math.max(0, Math.min(1, (price - bbLower) / bbRange)) : 0.5;
    const bbWidth = bbMid > 0 ? bbRange / bbMid : 0.1;

    const week52High = Math.max(...highs, price);
    const week52Low = Math.min(...lows, price);
    const pctFrom52High = ((price - week52High) / week52High) * 100;
    const pctFrom52Low = ((price - week52Low) / week52Low) * 100;

    const ago21 = closes[closes.length - 22] ?? closes[0];
    const ago63 = closes[closes.length - 64] ?? closes[0];
    const momentum1m = ago21 ? ((price - ago21) / ago21) * 100 : 0;
    const momentum3m = ago63 ? ((price - ago63) / ago63) * 100 : 0;

    const recent5 = volumes.slice(-5);
    const recent20 = volumes.slice(-20);
    const avgVol5 = recent5.length ? recent5.reduce((a, b) => a + b, 0) / recent5.length : 0;
    const avgVolume20 = recent20.length ? recent20.reduce((a, b) => a + b, 0) / recent20.length : 0;
    const volumeRatio = avgVolume20 ? avgVol5 / avgVolume20 : 1;

    // Advanced technical calculations
    const { adx: adxVal, trend: adxTrend } = calculateADX(highs, lows, closes);
    const mfiVal = calculateMFI(highs, lows, closes, volumes);

    const macdSignalSeries = emaSeries(macdLineSeries, 9);
    const macdCross = detectMACDCrossover(macdLineSeries, macdSignalSeries);

    const range = week52High - week52Low;
    const fib236 = week52High - 0.236 * range;
    const fib382 = week52High - 0.382 * range;
    const fib500 = week52High - 0.5 * range;
    const fib618 = week52High - 0.618 * range;
    const fib786 = week52High - 0.786 * range;

    const prevCloseVal = closes[closes.length - 1] ?? price;
    const prevHighVal = highs[highs.length - 1] ?? price;
    const prevLowVal = lows[lows.length - 1] ?? price;
    const pivotPP = (prevHighVal + prevLowVal + prevCloseVal) / 3;
    const pivotS1 = 2 * pivotPP - prevHighVal;
    const pivotS2 = pivotPP - (prevHighVal - prevLowVal);
    const pivotR1 = 2 * pivotPP - prevLowVal;
    const pivotR2 = pivotPP + (prevHighVal - prevLowVal);

    const indicators: Indicators = {
      sma20: sma20Val,
      sma50: sma50Val,
      sma200: sma200Val,
      ema12: ema12Val,
      ema26: ema26Val,
      macd: macdVal,
      macdSignal: macdSignalVal,
      macdHist,
      rsi: rsiVal,
      bbUpper,
      bbLower,
      bbMid,
      bbPct,
      week52High,
      week52Low,
      pctFrom52High,
      pctFrom52Low,
      momentum1m,
      momentum3m,
      avgVolume20,
      volumeRatio,
      adx: adxVal,
      adxTrend,
      mfi: mfiVal,
      macdCross,
      fib236,
      fib382,
      fib500,
      fib618,
      fib786,
      pivotPP,
      pivotS1,
      pivotS2,
      pivotR1,
      pivotR2,
      ema9: ema9Val,
      ema21: ema21Val,
      ema55: ema55Val,
      bbWidth,
    };

    const { signal, reasons, score, confidence, confluenceReasons, confidenceTier } = deriveSignal(
      price,
      indicators,
    );

    // Trade Plan bounds
    const accumulationZoneMax = price;
    const accumulationZoneMin = Math.max(price * 0.95, Math.min(price * 0.98, pivotS1, fib618));
    const stopLoss = Math.min(pivotS2, fib786, week52Low * 0.98, price * 0.94);
    const target1 = Math.max(price * 1.05, pivotR1, fib382);
    const target2 = Math.max(target1 * 1.05, pivotR2, week52High);

    return {
      symbol,
      name,
      sector,
      price,
      previousClose: prev,
      change,
      changePercent,
      currency: meta.currency ?? "INR",
      ...indicators,
      signal,
      confidence,
      score,
      reasons,
      reason: reasons.join(" · "),
      suggestedBuyPrice: accumulationZoneMin,
      suggestedSellPrice: target1,
      updatedAt: Date.now(),
      confluenceReasons,
      confidenceTier,
      accumulationZoneMin,
      accumulationZoneMax,
      target1,
      target2,
      stopLoss,
    };
  } catch (e) {
    console.error("fetchOne failed", symbol, e);
    return null;
  }
}

export const getIndianStocks = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.all(
    DEFAULT_TICKERS.map((t) => fetchOne(t.symbol, t.name, t.sector)),
  );
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
