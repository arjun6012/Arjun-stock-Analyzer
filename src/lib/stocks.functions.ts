import { createServerFn } from "@tanstack/react-start";

export type Signal = "BUY" | "SELL" | "HOLD";

export interface NewsItem {
  title: string;
  link: string;
  publisher: string;
  publishedAt: number;
}

export interface ROI {
  m1: number;
  m3: number;
  m6: number;
  y1: number;
  y3: number;
  y5: number;
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
  bbPct: number;
  week52High: number;
  week52Low: number;
  pctFrom52High: number;
  pctFrom52Low: number;
  momentum1m: number;
  momentum3m: number;
  avgVolume20: number;
  volumeRatio: number;
  signal: Signal;
  confidence: number;
  score: number;
  reasons: string[];
  reason: string;
  suggestedSellPrice: number;
  suggestedBuyPrice: number;
  updatedAt: number;
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
  atr: number;
  atrPct: number;
  stochK: number;
  stochD: number;
  obvTrend: "RISING" | "FALLING" | "FLAT";
  obvSlope: number;
  vwap20: number;
  roi: ROI;
  history: {
    closes: number[];
    highs: number[];
    lows: number[];
    volumes: number[];
    sma20: number[];
    sma50: number[];
    rsi: number[];
  };
  strategies: TradingStrategy[];
}


export interface TradingStrategy {
  id: string;
  name: string;
  style: "Swing" | "Positional" | "Intraday" | "Momentum" | "Mean Reversion" | "Breakout";
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  triggered: boolean;
  description: string;
  entry: string;
  exit: string;
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
  { symbol: "BRIGADE.NS", name: "Brigade Enterprises", sector: "Real Estate" },
  { symbol: "SOBHA.NS", name: "Sobha Limited", sector: "Real Estate" },
  { symbol: "PHOENIXLTD.NS", name: "Phoenix Mills", sector: "Real Estate" },
  // Auto — passenger & commercial vehicle deep-dive
  { symbol: "TATATECH.NS", name: "Tata Technologies (Auto Tech)", sector: "Auto" },
  { symbol: "FORCEMOT.NS", name: "Force Motors (CV)", sector: "Auto" },
  { symbol: "ESCORTS.NS", name: "Escorts Kubota (CV/Tractors)", sector: "Auto" },
  { symbol: "VSTTILLERS.NS", name: "VST Tillers Tractors", sector: "Auto" },
  { symbol: "OLECTRA.NS", name: "Olectra Greentech (Electric Bus)", sector: "Auto" },
  { symbol: "JBMA.NS", name: "JBM Auto (E-Bus)", sector: "Auto" },
  { symbol: "ENDURANCE.NS", name: "Endurance Technologies", sector: "Auto" },
  { symbol: "BHARATFORG.NS", name: "Bharat Forge", sector: "Auto" },
  { symbol: "SCHAEFFLER.NS", name: "Schaeffler India", sector: "Auto" },
  { symbol: "TIINDIA.NS", name: "Tube Investments of India", sector: "Auto" },
  { symbol: "MINDACORP.NS", name: "Minda Corporation", sector: "Auto" },
  { symbol: "GREAVESCOT.NS", name: "Greaves Cotton (E-Mobility)", sector: "Auto" },
  // Logistics
  { symbol: "DELHIVERY.NS", name: "Delhivery", sector: "Logistics" },
  { symbol: "BLUEDART.NS", name: "Blue Dart Express", sector: "Logistics" },
  { symbol: "TCI.NS", name: "Transport Corp of India", sector: "Logistics" },
  { symbol: "MAHLOG.NS", name: "Mahindra Logistics", sector: "Logistics" },
  { symbol: "GATI.NS", name: "Gati", sector: "Logistics" },
  // Hospitality & Travel
  { symbol: "INDIGO.NS", name: "InterGlobe Aviation (IndiGo)", sector: "Aviation" },
  { symbol: "SPICEJET.NS", name: "SpiceJet", sector: "Aviation" },
  { symbol: "INDHOTEL.NS", name: "Indian Hotels (Taj)", sector: "Hospitality" },
  { symbol: "EIHOTEL.NS", name: "EIH (Oberoi Hotels)", sector: "Hospitality" },
  { symbol: "CHALET.NS", name: "Chalet Hotels", sector: "Hospitality" },
  { symbol: "LEMONTREE.NS", name: "Lemon Tree Hotels", sector: "Hospitality" },
  { symbol: "EASEMYTRIP.NS", name: "Easy Trip Planners", sector: "Travel" },
  // Agri & Sugar
  { symbol: "GODREJAGRO.NS", name: "Godrej Agrovet", sector: "Agri" },
  { symbol: "BALRAMCHIN.NS", name: "Balrampur Chini Mills", sector: "Agri" },
  { symbol: "BAJAJHIND.NS", name: "Bajaj Hindusthan Sugar", sector: "Agri" },
  { symbol: "KAVERISEED.NS", name: "Kaveri Seed Company", sector: "Agri" },
  // Specialty Chemicals
  { symbol: "AARTIIND.NS", name: "Aarti Industries", sector: "Chemicals" },
  { symbol: "NAVINFLUOR.NS", name: "Navin Fluorine International", sector: "Chemicals" },
  { symbol: "PIIND.NS", name: "PI Industries", sector: "Chemicals" },
  { symbol: "CLEAN.NS", name: "Clean Science & Technology", sector: "Chemicals" },
  { symbol: "GUJFLUORO.NS", name: "Gujarat Fluorochemicals", sector: "Chemicals" },
  // Renewable & EV Ecosystem
  { symbol: "WAAREEENER.NS", name: "Waaree Energies (Solar)", sector: "Power" },
  { symbol: "ACMESOLAR.NS", name: "ACME Solar Holdings", sector: "Power" },
  { symbol: "INOXWIND.NS", name: "Inox Wind", sector: "Power" },
  // More IT / SaaS / Tech
  { symbol: "ZENSARTECH.NS", name: "Zensar Technologies", sector: "IT" },
  { symbol: "NEWGEN.NS", name: "Newgen Software", sector: "IT" },
  { symbol: "INTELLECT.NS", name: "Intellect Design Arena", sector: "IT" },
  { symbol: "SONATSOFTW.NS", name: "Sonata Software", sector: "IT" },
  { symbol: "MAPMYINDIA.NS", name: "C.E. Info Systems (MapmyIndia)", sector: "Tech" },
  // Misc Mid-Caps frequently traded
  { symbol: "HONAUT.NS", name: "Honeywell Automation India", sector: "Capital Goods" },
  { symbol: "POLYCAB.NS", name: "Polycab India", sector: "Capital Goods" },
  { symbol: "KEI.NS", name: "KEI Industries", sector: "Capital Goods" },
  { symbol: "ABCAPITAL.NS", name: "Aditya Birla Capital", sector: "Financials" },
  { symbol: "PEL.NS", name: "Piramal Enterprises", sector: "Financials" },
  // ===== Extended NIFTY 500 coverage =====
  // More Banking & Financials
  { symbol: "INDIANB.NS", name: "Indian Bank", sector: "Banking" },
  { symbol: "CENTRALBK.NS", name: "Central Bank of India", sector: "Banking" },
  { symbol: "UCOBANK.NS", name: "UCO Bank", sector: "Banking" },
  { symbol: "MAHABANK.NS", name: "Bank of Maharashtra", sector: "Banking" },
  { symbol: "CSBBANK.NS", name: "CSB Bank", sector: "Banking" },
  { symbol: "DCBBANK.NS", name: "DCB Bank", sector: "Banking" },
  { symbol: "KARURVYSYA.NS", name: "Karur Vysya Bank", sector: "Banking" },
  { symbol: "SOUTHBANK.NS", name: "South Indian Bank", sector: "Banking" },
  { symbol: "TMB.NS", name: "Tamilnad Mercantile Bank", sector: "Banking" },
  { symbol: "MANAPPURAM.NS", name: "Manappuram Finance", sector: "Financials" },
  { symbol: "POONAWALLA.NS", name: "Poonawalla Fincorp", sector: "Financials" },
  { symbol: "L&TFH.NS", name: "L&T Finance Holdings", sector: "Financials" },
  { symbol: "SUNDARMFIN.NS", name: "Sundaram Finance", sector: "Financials" },
  { symbol: "MFSL.NS", name: "Max Financial Services", sector: "Financials" },
  { symbol: "IIFL.NS", name: "IIFL Finance", sector: "Financials" },
  { symbol: "ANGELONE.NS", name: "Angel One", sector: "Financials" },
  { symbol: "CDSL.NS", name: "Central Depository Services", sector: "Financials" },
  { symbol: "MCX.NS", name: "Multi Commodity Exchange", sector: "Financials" },
  { symbol: "KFINTECH.NS", name: "KFin Technologies", sector: "Financials" },
  { symbol: "CAMS.NS", name: "Computer Age Management", sector: "Financials" },
  { symbol: "NUVAMA.NS", name: "Nuvama Wealth Management", sector: "Financials" },
  { symbol: "360ONE.NS", name: "360 ONE WAM", sector: "Financials" },
  { symbol: "FIVESTAR.NS", name: "Five-Star Business Finance", sector: "Financials" },
  { symbol: "AAVAS.NS", name: "Aavas Financiers", sector: "Financials" },
  { symbol: "APTUS.NS", name: "Aptus Value Housing Finance", sector: "Financials" },
  { symbol: "HOMEFIRST.NS", name: "Home First Finance", sector: "Financials" },
  // More Pharma & Healthcare
  { symbol: "ABBOTINDIA.NS", name: "Abbott India", sector: "Pharma" },
  { symbol: "GLAXO.NS", name: "GlaxoSmithKline Pharma", sector: "Pharma" },
  { symbol: "PFIZER.NS", name: "Pfizer India", sector: "Pharma" },
  { symbol: "SANOFI.NS", name: "Sanofi India", sector: "Pharma" },
  { symbol: "IPCALAB.NS", name: "Ipca Laboratories", sector: "Pharma" },
  { symbol: "AJANTPHARM.NS", name: "Ajanta Pharma", sector: "Pharma" },
  { symbol: "NATCOPHARM.NS", name: "Natco Pharma", sector: "Pharma" },
  { symbol: "JBCHEPHARM.NS", name: "JB Chemicals", sector: "Pharma" },
  { symbol: "ERIS.NS", name: "Eris Lifesciences", sector: "Pharma" },
  { symbol: "GRANULES.NS", name: "Granules India", sector: "Pharma" },
  { symbol: "LAURUSLABS.NS", name: "Laurus Labs", sector: "Pharma" },
  { symbol: "SYNGENE.NS", name: "Syngene International", sector: "Pharma" },
  { symbol: "PPLPHARMA.NS", name: "Piramal Pharma", sector: "Pharma" },
  { symbol: "GLAND.NS", name: "Gland Pharma", sector: "Pharma" },
  { symbol: "POLYMED.NS", name: "Poly Medicure", sector: "Healthcare" },
  { symbol: "METROPOLIS.NS", name: "Metropolis Healthcare", sector: "Healthcare" },
  { symbol: "LALPATHLAB.NS", name: "Dr Lal PathLabs", sector: "Healthcare" },
  { symbol: "NH.NS", name: "Narayana Hrudayalaya", sector: "Healthcare" },
  { symbol: "RAINBOW.NS", name: "Rainbow Children's Medicare", sector: "Healthcare" },
  { symbol: "KIMS.NS", name: "Krishna Institute of Medical", sector: "Healthcare" },
  { symbol: "MEDPLUS.NS", name: "Medplus Health Services", sector: "Healthcare" },
  // More Capital Goods & Engineering
  { symbol: "THERMAX.NS", name: "Thermax", sector: "Capital Goods" },
  { symbol: "TIMKEN.NS", name: "Timken India", sector: "Capital Goods" },
  { symbol: "SKFINDIA.NS", name: "SKF India", sector: "Capital Goods" },
  { symbol: "GRINDWELL.NS", name: "Grindwell Norton", sector: "Capital Goods" },
  { symbol: "CGPOWER.NS", name: "CG Power & Industrial", sector: "Capital Goods" },
  { symbol: "TRITURBINE.NS", name: "Triveni Turbine", sector: "Capital Goods" },
  { symbol: "ELGIEQUIP.NS", name: "Elgi Equipments", sector: "Capital Goods" },
  { symbol: "APARINDS.NS", name: "Apar Industries", sector: "Capital Goods" },
  { symbol: "FINCABLES.NS", name: "Finolex Cables", sector: "Capital Goods" },
  { symbol: "RRKABEL.NS", name: "RR Kabel", sector: "Capital Goods" },
  { symbol: "VGUARD.NS", name: "V-Guard Industries", sector: "Capital Goods" },
  { symbol: "SUPREMEIND.NS", name: "Supreme Industries", sector: "Capital Goods" },
  { symbol: "ASTRAL.NS", name: "Astral Limited", sector: "Capital Goods" },
  { symbol: "PRINCEPIPE.NS", name: "Prince Pipes", sector: "Capital Goods" },
  { symbol: "AIAENG.NS", name: "AIA Engineering", sector: "Capital Goods" },
  { symbol: "KIRLOSENG.NS", name: "Kirloskar Oil Engines", sector: "Capital Goods" },
  { symbol: "KIRLOSBROS.NS", name: "Kirloskar Brothers", sector: "Capital Goods" },
  // More Chemicals & Specialty
  { symbol: "ATUL.NS", name: "Atul Ltd", sector: "Chemicals" },
  { symbol: "VINATIORGA.NS", name: "Vinati Organics", sector: "Chemicals" },
  { symbol: "FINEORG.NS", name: "Fine Organic Industries", sector: "Chemicals" },
  { symbol: "GHCL.NS", name: "GHCL", sector: "Chemicals" },
  { symbol: "NOCIL.NS", name: "NOCIL", sector: "Chemicals" },
  { symbol: "ALKYLAMINE.NS", name: "Alkyl Amines Chemicals", sector: "Chemicals" },
  { symbol: "BALAMINES.NS", name: "Balaji Amines", sector: "Chemicals" },
  { symbol: "ROSSARI.NS", name: "Rossari Biotech", sector: "Chemicals" },
  { symbol: "GALAXYSURF.NS", name: "Galaxy Surfactants", sector: "Chemicals" },
  { symbol: "ANURAS.NS", name: "Anupam Rasayan", sector: "Chemicals" },
  { symbol: "CHEMPLASTS.NS", name: "Chemplast Sanmar", sector: "Chemicals" },
  { symbol: "EPL.NS", name: "EPL (Essel Propack)", sector: "Chemicals" },
  // More Consumer & Retail
  { symbol: "JUBLFOOD.NS", name: "Jubilant FoodWorks", sector: "FMCG" },
  { symbol: "DEVYANI.NS", name: "Devyani International (KFC/Pizza Hut)", sector: "FMCG" },
  { symbol: "SAPPHIRE.NS", name: "Sapphire Foods (KFC)", sector: "FMCG" },
  { symbol: "WESTLIFE.NS", name: "Westlife Foodworld (McDonald's)", sector: "FMCG" },
  { symbol: "EMAMILTD.NS", name: "Emami", sector: "FMCG" },
  { symbol: "RADICO.NS", name: "Radico Khaitan", sector: "FMCG" },
  { symbol: "BIKAJI.NS", name: "Bikaji Foods International", sector: "FMCG" },
  { symbol: "BBTC.NS", name: "Bombay Burmah Trading", sector: "FMCG" },
  { symbol: "GODFRYPHLP.NS", name: "Godfrey Phillips", sector: "FMCG" },
  { symbol: "VSTIND.NS", name: "VST Industries", sector: "FMCG" },
  { symbol: "RELAXO.NS", name: "Relaxo Footwears", sector: "Retail" },
  { symbol: "BATAINDIA.NS", name: "Bata India", sector: "Retail" },
  { symbol: "METROBRAND.NS", name: "Metro Brands", sector: "Retail" },
  { symbol: "CAMPUS.NS", name: "Campus Activewear", sector: "Retail" },
  { symbol: "VEDANTFASH.NS", name: "Vedant Fashions (Manyavar)", sector: "Retail" },
  { symbol: "GOCOLORS.NS", name: "Go Fashion (India)", sector: "Retail" },
  { symbol: "SHOPERSTOP.NS", name: "Shoppers Stop", sector: "Retail" },
  { symbol: "ARVINDFASN.NS", name: "Arvind Fashions", sector: "Retail" },
  { symbol: "HONASA.NS", name: "Honasa Consumer (Mamaearth)", sector: "FMCG" },
  // More IT / Tech / New Age
  { symbol: "CYIENT.NS", name: "Cyient", sector: "IT" },
  { symbol: "BIRLASOFT.NS", name: "Birlasoft", sector: "IT" },
  { symbol: "RATEGAIN.NS", name: "RateGain Travel Technologies", sector: "IT" },
  { symbol: "HAPPSTMNDS.NS", name: "Happiest Minds", sector: "IT" },
  { symbol: "TANLA.NS", name: "Tanla Platforms", sector: "IT" },
  { symbol: "ROUTE.NS", name: "Route Mobile", sector: "IT" },
  { symbol: "FSL.NS", name: "Firstsource Solutions", sector: "IT" },
  { symbol: "ECLERX.NS", name: "eClerx Services", sector: "IT" },
  { symbol: "NAZARA.NS", name: "Nazara Technologies (Gaming)", sector: "Tech" },
  { symbol: "ZAGGLE.NS", name: "Zaggle Prepaid Ocean", sector: "Fintech" },
  { symbol: "IXIGO.NS", name: "Le Travenues (ixigo)", sector: "Tech" },
  { symbol: "PROTEAN.NS", name: "Protean eGov Technologies", sector: "Tech" },
  { symbol: "BLACKBUCK.NS", name: "Zinka Logistics (BlackBuck)", sector: "Tech" },
  { symbol: "OLAELEC.NS", name: "Ola Electric Mobility", sector: "Auto" },
  { symbol: "SWIGGY.NS", name: "Swiggy", sector: "Tech" },
  // More Metals, Mining, Materials
  { symbol: "APLAPOLLO.NS", name: "APL Apollo Tubes", sector: "Metals" },
  { symbol: "JINDALSAW.NS", name: "Jindal Saw", sector: "Metals" },
  { symbol: "WELSPUNLIV.NS", name: "Welspun Living", sector: "Metals" },
  { symbol: "RATNAMANI.NS", name: "Ratnamani Metals", sector: "Metals" },
  { symbol: "JSL.NS", name: "Jindal Stainless", sector: "Metals" },
  { symbol: "MOIL.NS", name: "MOIL", sector: "Metals" },
  { symbol: "GRAVITA.NS", name: "Gravita India", sector: "Metals" },
  // More Cement & Building Materials
  { symbol: "JKCEMENT.NS", name: "JK Cement", sector: "Cement" },
  { symbol: "RAMCOCEM.NS", name: "Ramco Cements", sector: "Cement" },
  { symbol: "JKLAKSHMI.NS", name: "JK Lakshmi Cement", sector: "Cement" },
  { symbol: "HEIDELBERG.NS", name: "HeidelbergCement India", sector: "Cement" },
  { symbol: "BIRLACORPN.NS", name: "Birla Corporation", sector: "Cement" },
  { symbol: "KAJARIACER.NS", name: "Kajaria Ceramics", sector: "Cement" },
  { symbol: "CERA.NS", name: "Cera Sanitaryware", sector: "Cement" },
  // Defence & Shipbuilding additional
  { symbol: "DATAPATTNS.NS", name: "Data Patterns India", sector: "Defence" },
  { symbol: "PARAS.NS", name: "Paras Defence and Space", sector: "Defence" },
  { symbol: "MTARTECH.NS", name: "MTAR Technologies", sector: "Defence" },
  { symbol: "ZENTEC.NS", name: "Zen Technologies", sector: "Defence" },
  // Misc liquid mid/large caps
  { symbol: "PGHH.NS", name: "Procter & Gamble Hygiene", sector: "FMCG" },
  { symbol: "GILLETTE.NS", name: "Gillette India", sector: "FMCG" },
  { symbol: "3MINDIA.NS", name: "3M India", sector: "Conglomerate" },
  { symbol: "SUNDARMHLD.NS", name: "Sundaram Finance Holdings", sector: "Financials" },
  { symbol: "JSWINFRA.NS", name: "JSW Infrastructure", sector: "Infrastructure" },
  { symbol: "ENGINERSIN.NS", name: "Engineers India", sector: "Capital Goods" },
  { symbol: "NCC.NS", name: "NCC Limited", sector: "Infrastructure" },
  { symbol: "KEC.NS", name: "KEC International", sector: "Capital Goods" },
  { symbol: "KALPATPOWR.NS", name: "Kalpataru Projects International", sector: "Capital Goods" },
  // Expanded universe — mid/small cap across sectors
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank", sector: "Banking" },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank", sector: "Banking" },
  { symbol: "RBLBANK.NS", name: "RBL Bank", sector: "Banking" },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank", sector: "Banking" },
  { symbol: "KARURVYSYA.NS", name: "Karur Vysya Bank", sector: "Banking" },
  { symbol: "SOUTHBANK.NS", name: "South Indian Bank", sector: "Banking" },
  { symbol: "CSBBANK.NS", name: "CSB Bank", sector: "Banking" },
  { symbol: "DCBBANK.NS", name: "DCB Bank", sector: "Banking" },
  { symbol: "EQUITASBNK.NS", name: "Equitas Small Finance Bank", sector: "Banking" },
  { symbol: "UJJIVANSFB.NS", name: "Ujjivan Small Finance Bank", sector: "Banking" },
  { symbol: "MANAPPURAM.NS", name: "Manappuram Finance", sector: "Financial Services" },
  { symbol: "MUTHOOTFIN.NS", name: "Muthoot Finance", sector: "Financial Services" },
  { symbol: "POONAWALLA.NS", name: "Poonawalla Fincorp", sector: "Financial Services" },
  { symbol: "ABCAPITAL.NS", name: "Aditya Birla Capital", sector: "Financial Services" },
  { symbol: "IIFL.NS", name: "IIFL Finance", sector: "Financial Services" },
  { symbol: "PFC.NS", name: "Power Finance Corp", sector: "Financial Services" },
  { symbol: "RECLTD.NS", name: "REC Limited", sector: "Financial Services" },
  { symbol: "IRFC.NS", name: "Indian Railway Finance", sector: "Financial Services" },
  { symbol: "MAHABANK.NS", name: "Bank of Maharashtra", sector: "Banking" },
  { symbol: "CENTRALBK.NS", name: "Central Bank of India", sector: "Banking" },
  { symbol: "UCOBANK.NS", name: "UCO Bank", sector: "Banking" },
  { symbol: "IOB.NS", name: "Indian Overseas Bank", sector: "Banking" },
  { symbol: "PNBHOUSING.NS", name: "PNB Housing Finance", sector: "Financial Services" },
  { symbol: "LICHSGFIN.NS", name: "LIC Housing Finance", sector: "Financial Services" },
  { symbol: "HUDCO.NS", name: "HUDCO", sector: "Financial Services" },
  { symbol: "CDSL.NS", name: "CDSL", sector: "Financial Services" },
  { symbol: "BSE.NS", name: "BSE Ltd", sector: "Financial Services" },
  { symbol: "MCX.NS", name: "MCX India", sector: "Financial Services" },
  { symbol: "ANGELONE.NS", name: "Angel One", sector: "Financial Services" },
  { symbol: "MOTILALOFS.NS", name: "Motilal Oswal", sector: "Financial Services" },
  { symbol: "NUVAMA.NS", name: "Nuvama Wealth", sector: "Financial Services" },
  { symbol: "BIRLACORPN.NS", name: "Birla Corporation", sector: "Cement" },
  { symbol: "JKLAKSHMI.NS", name: "JK Lakshmi Cement", sector: "Cement" },
  { symbol: "JKCEMENT.NS", name: "JK Cement", sector: "Cement" },
  { symbol: "HEIDELBERG.NS", name: "Heidelberg Cement", sector: "Cement" },
  { symbol: "RAMCOCEM.NS", name: "Ramco Cements", sector: "Cement" },
  { symbol: "STARCEMENT.NS", name: "Star Cement", sector: "Cement" },
  { symbol: "ORIENTCEM.NS", name: "Orient Cement", sector: "Cement" },
  { symbol: "BHARATFORG.NS", name: "Bharat Forge", sector: "Auto Components" },
  { symbol: "MOTHERSON.NS", name: "Samvardhana Motherson", sector: "Auto Components" },
  { symbol: "EXIDEIND.NS", name: "Exide Industries", sector: "Auto Components" },
  { symbol: "AMARAJABAT.NS", name: "Amara Raja Batteries", sector: "Auto Components" },
  { symbol: "BOSCHLTD.NS", name: "Bosch Ltd", sector: "Auto Components" },
  { symbol: "ENDURANCE.NS", name: "Endurance Technologies", sector: "Auto Components" },
  { symbol: "SUNDRMFAST.NS", name: "Sundram Fasteners", sector: "Auto Components" },
  { symbol: "BALKRISIND.NS", name: "Balkrishna Industries", sector: "Auto Components" },
  { symbol: "APOLLOTYRE.NS", name: "Apollo Tyres", sector: "Auto Components" },
  { symbol: "MRF.NS", name: "MRF", sector: "Auto Components" },
  { symbol: "CEATLTD.NS", name: "CEAT", sector: "Auto Components" },
  { symbol: "JKTYRE.NS", name: "JK Tyre", sector: "Auto Components" },
  { symbol: "ESCORTS.NS", name: "Escorts Kubota", sector: "Auto" },
  { symbol: "FORCEMOT.NS", name: "Force Motors", sector: "Auto" },
  { symbol: "TVSMOTOR.NS", name: "TVS Motor", sector: "Auto" },
  { symbol: "ATULAUTO.NS", name: "Atul Auto", sector: "Auto" },
  { symbol: "GLENMARK.NS", name: "Glenmark Pharma", sector: "Pharmaceuticals" },
  { symbol: "ALKEM.NS", name: "Alkem Laboratories", sector: "Pharmaceuticals" },
  { symbol: "ZYDUSLIFE.NS", name: "Zydus Lifesciences", sector: "Pharmaceuticals" },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharma", sector: "Pharmaceuticals" },
  { symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharmaceuticals" },
  { symbol: "LUPIN.NS", name: "Lupin", sector: "Pharmaceuticals" },
  { symbol: "BIOCON.NS", name: "Biocon", sector: "Pharmaceuticals" },
  { symbol: "AJANTPHARM.NS", name: "Ajanta Pharma", sector: "Pharmaceuticals" },
  { symbol: "IPCALAB.NS", name: "IPCA Laboratories", sector: "Pharmaceuticals" },
  { symbol: "NATCOPHARM.NS", name: "Natco Pharma", sector: "Pharmaceuticals" },
  { symbol: "GRANULES.NS", name: "Granules India", sector: "Pharmaceuticals" },
  { symbol: "LAURUSLABS.NS", name: "Laurus Labs", sector: "Pharmaceuticals" },
  { symbol: "MANKIND.NS", name: "Mankind Pharma", sector: "Pharmaceuticals" },
  { symbol: "ERIS.NS", name: "Eris Lifesciences", sector: "Pharmaceuticals" },
  { symbol: "FORTIS.NS", name: "Fortis Healthcare", sector: "Healthcare" },
  { symbol: "MAXHEALTH.NS", name: "Max Healthcare", sector: "Healthcare" },
  { symbol: "NH.NS", name: "Narayana Hrudayalaya", sector: "Healthcare" },
  { symbol: "MEDANTA.NS", name: "Global Health (Medanta)", sector: "Healthcare" },
  { symbol: "KIMS.NS", name: "Krishna Institute of Medical Sciences", sector: "Healthcare" },
  { symbol: "RAINBOW.NS", name: "Rainbow Children's Medicare", sector: "Healthcare" },
  { symbol: "METROPOLIS.NS", name: "Metropolis Healthcare", sector: "Healthcare" },
  { symbol: "DRLAL.NS", name: "Dr Lal PathLabs", sector: "Healthcare" },
  { symbol: "THYROCARE.NS", name: "Thyrocare", sector: "Healthcare" },
  { symbol: "PERSISTENT.NS", name: "Persistent Systems", sector: "IT" },
  { symbol: "COFORGE.NS", name: "Coforge", sector: "IT" },
  { symbol: "MPHASIS.NS", name: "Mphasis", sector: "IT" },
  { symbol: "LTTS.NS", name: "L&T Technology Services", sector: "IT" },
  { symbol: "KPITTECH.NS", name: "KPIT Technologies", sector: "IT" },
  { symbol: "TATAELXSI.NS", name: "Tata Elxsi", sector: "IT" },
  { symbol: "ZENSARTECH.NS", name: "Zensar Technologies", sector: "IT" },
  { symbol: "BIRLASOFT.NS", name: "Birlasoft", sector: "IT" },
  { symbol: "RATEGAIN.NS", name: "Rategain Travel Tech", sector: "IT" },
  { symbol: "MAPMYINDIA.NS", name: "C.E. Info Systems (MapmyIndia)", sector: "IT" },
  { symbol: "NEWGEN.NS", name: "Newgen Software", sector: "IT" },
  { symbol: "ECLERX.NS", name: "eClerx Services", sector: "IT" },
  { symbol: "INTELLECT.NS", name: "Intellect Design Arena", sector: "IT" },
  { symbol: "AFFLE.NS", name: "Affle India", sector: "IT" },
  { symbol: "ROUTE.NS", name: "Route Mobile", sector: "IT" },
  { symbol: "TANLA.NS", name: "Tanla Platforms", sector: "IT" },
  { symbol: "POLICYBZR.NS", name: "PB Fintech (PolicyBazaar)", sector: "New Age Tech" },
  { symbol: "PAYTM.NS", name: "One 97 (Paytm)", sector: "New Age Tech" },
  { symbol: "ZOMATO.NS", name: "Zomato (Eternal)", sector: "New Age Tech" },
  { symbol: "NYKAA.NS", name: "FSN E-Commerce (Nykaa)", sector: "New Age Tech" },
  { symbol: "DELHIVERY.NS", name: "Delhivery", sector: "New Age Tech" },
  { symbol: "EASEMYTRIP.NS", name: "Easy Trip Planners", sector: "New Age Tech" },
  { symbol: "IXIGO.NS", name: "Le Travenues (Ixigo)", sector: "New Age Tech" },
  { symbol: "FIRSTCRY.NS", name: "Brainbees Solutions (FirstCry)", sector: "New Age Tech" },
  { symbol: "HONASA.NS", name: "Honasa Consumer (Mamaearth)", sector: "FMCG" },
  { symbol: "PATANJALI.NS", name: "Patanjali Foods", sector: "FMCG" },
  { symbol: "EMAMILTD.NS", name: "Emami", sector: "FMCG" },
  { symbol: "BAJAJCON.NS", name: "Bajaj Consumer Care", sector: "FMCG" },
  { symbol: "GILLETTE.NS", name: "Gillette India", sector: "FMCG" },
  { symbol: "VBL.NS", name: "Varun Beverages", sector: "FMCG" },
  { symbol: "RADICO.NS", name: "Radico Khaitan", sector: "FMCG" },
  { symbol: "UNITDSPR.NS", name: "United Spirits", sector: "FMCG" },
  { symbol: "UBL.NS", name: "United Breweries", sector: "FMCG" },
  { symbol: "BIKAJI.NS", name: "Bikaji Foods", sector: "FMCG" },
  { symbol: "GODFRYPHLP.NS", name: "Godfrey Phillips", sector: "FMCG" },
  { symbol: "VSTIND.NS", name: "VST Industries", sector: "FMCG" },
  { symbol: "ASTRAL.NS", name: "Astral Ltd", sector: "Building Materials" },
  { symbol: "FINOLEXIND.NS", name: "Finolex Industries", sector: "Building Materials" },
  { symbol: "SUPREMEIND.NS", name: "Supreme Industries", sector: "Building Materials" },
  { symbol: "KAJARIACER.NS", name: "Kajaria Ceramics", sector: "Building Materials" },
  { symbol: "CERA.NS", name: "Cera Sanitaryware", sector: "Building Materials" },
  { symbol: "GREENPLY.NS", name: "Greenply Industries", sector: "Building Materials" },
  { symbol: "CENTURYPLY.NS", name: "Century Plyboards", sector: "Building Materials" },
  { symbol: "GREENPANEL.NS", name: "Greenpanel Industries", sector: "Building Materials" },
  { symbol: "POLYCAB.NS", name: "Polycab India", sector: "Capital Goods" },
  { symbol: "KEI.NS", name: "KEI Industries", sector: "Capital Goods" },
  { symbol: "HAVELLS.NS", name: "Havells India", sector: "Consumer Durables" },
  { symbol: "CROMPTON.NS", name: "Crompton Greaves Consumer", sector: "Consumer Durables" },
  { symbol: "VOLTAS.NS", name: "Voltas", sector: "Consumer Durables" },
  { symbol: "BLUESTARCO.NS", name: "Blue Star", sector: "Consumer Durables" },
  { symbol: "WHIRLPOOL.NS", name: "Whirlpool India", sector: "Consumer Durables" },
  { symbol: "TTKPRESTIG.NS", name: "TTK Prestige", sector: "Consumer Durables" },
  { symbol: "DIXON.NS", name: "Dixon Technologies", sector: "Consumer Durables" },
  { symbol: "AMBER.NS", name: "Amber Enterprises", sector: "Consumer Durables" },
  { symbol: "KAYNES.NS", name: "Kaynes Technology", sector: "Capital Goods" },
  { symbol: "SYRMA.NS", name: "Syrma SGS Technology", sector: "Capital Goods" },
  { symbol: "JYOTICNC.NS", name: "Jyoti CNC Automation", sector: "Capital Goods" },
  { symbol: "TIINDIA.NS", name: "Tube Investments", sector: "Capital Goods" },
  { symbol: "AIAENG.NS", name: "AIA Engineering", sector: "Capital Goods" },
  { symbol: "GRINDWELL.NS", name: "Grindwell Norton", sector: "Capital Goods" },
  { symbol: "TIMKEN.NS", name: "Timken India", sector: "Capital Goods" },
  { symbol: "SKFINDIA.NS", name: "SKF India", sector: "Capital Goods" },
  { symbol: "SCHAEFFLER.NS", name: "Schaeffler India", sector: "Capital Goods" },
  { symbol: "ELECON.NS", name: "Elecon Engineering", sector: "Capital Goods" },
  { symbol: "JINDALSTEL.NS", name: "Jindal Steel & Power", sector: "Metals" },
  { symbol: "WELCORP.NS", name: "Welspun Corp", sector: "Metals" },
  { symbol: "RATNAMANI.NS", name: "Ratnamani Metals", sector: "Metals" },
  { symbol: "APLAPOLLO.NS", name: "APL Apollo Tubes", sector: "Metals" },
  { symbol: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { symbol: "NMDC.NS", name: "NMDC", sector: "Metals" },
  { symbol: "MOIL.NS", name: "MOIL", sector: "Metals" },
  { symbol: "NATIONALUM.NS", name: "National Aluminium", sector: "Metals" },
  { symbol: "HINDCOPPER.NS", name: "Hindustan Copper", sector: "Metals" },
  { symbol: "GMDC.NS", name: "Gujarat Mineral Dev Corp", sector: "Metals" },
  { symbol: "JSL.NS", name: "Jindal Stainless", sector: "Metals" },
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

function calculateATR(highs: number[], lows: number[], closes: number[], period = 14): number {
  if (closes.length < period + 1) return 0;
  const trs: number[] = [];
  const start = Math.max(1, closes.length - period * 3);
  for (let i = start; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1]),
    );
    trs.push(tr);
  }
  const slice = trs.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  kPeriod = 14,
  dPeriod = 3,
): { k: number; d: number } {
  if (closes.length < kPeriod) return { k: 50, d: 50 };
  const ks: number[] = [];
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const hh = Math.max(...highs.slice(i - kPeriod + 1, i + 1));
    const ll = Math.min(...lows.slice(i - kPeriod + 1, i + 1));
    const range = hh - ll;
    ks.push(range > 0 ? ((closes[i] - ll) / range) * 100 : 50);
  }
  const k = ks[ks.length - 1] ?? 50;
  const dSlice = ks.slice(-dPeriod);
  const d = dSlice.length ? dSlice.reduce((a, b) => a + b, 0) / dSlice.length : k;
  return { k, d };
}

function calculateOBV(
  closes: number[],
  volumes: number[],
): { trend: "RISING" | "FALLING" | "FLAT"; slope: number } {
  if (closes.length < 21) return { trend: "FLAT", slope: 0 };
  const obv: number[] = [0];
  for (let i = 1; i < closes.length; i++) {
    const prev = obv[obv.length - 1];
    if (closes[i] > closes[i - 1]) obv.push(prev + volumes[i]);
    else if (closes[i] < closes[i - 1]) obv.push(prev - volumes[i]);
    else obv.push(prev);
  }
  const recent = obv.slice(-20);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const magnitude = Math.max(Math.abs(first), Math.abs(last), 1);
  const slope = ((last - first) / magnitude) * 100;
  let trend: "RISING" | "FALLING" | "FLAT" = "FLAT";
  if (slope > 5) trend = "RISING";
  else if (slope < -5) trend = "FALLING";
  return { trend, slope };
}

function calculateVWAP(highs: number[], lows: number[], closes: number[], volumes: number[], period = 20): number {
  const n = Math.min(period, closes.length);
  if (n === 0) return 0;
  let pv = 0;
  let v = 0;
  for (let i = closes.length - n; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    pv += tp * volumes[i];
    v += volumes[i];
  }
  return v > 0 ? pv / v : closes[closes.length - 1];
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
  atr: number;
  atrPct: number;
  stochK: number;
  stochD: number;
  obvTrend: "RISING" | "FALLING" | "FLAT";
  obvSlope: number;
  vwap20: number;
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
  // 13. Stochastic %K vs %D — momentum reversal cue
  if (ind.stochK < 20 && ind.stochK > ind.stochD) {
    score += 1.2;
    reasons.push(`Stochastic oversold turning up (${ind.stochK.toFixed(0)})`);
    confluenceReasons.push("Stochastic %K crossing up from oversold");
  } else if (ind.stochK > 80 && ind.stochK < ind.stochD) {
    score -= 1.2;
    reasons.push(`Stochastic overbought turning down (${ind.stochK.toFixed(0)})`);
    confluenceReasons.push("Stochastic %K crossing down from overbought");
  }

  // 14. OBV / accumulation-distribution — smart-money trend
  if (ind.obvTrend === "RISING" && price > ind.sma20) {
    score += 1.0;
    reasons.push(`OBV rising (+${ind.obvSlope.toFixed(0)}%) — accumulation`);
    confluenceReasons.push("OBV uptrend confirms price (smart money buying)");
  } else if (ind.obvTrend === "FALLING" && price < ind.sma20) {
    score -= 1.0;
    reasons.push(`OBV falling (${ind.obvSlope.toFixed(0)}%) — distribution`);
    confluenceReasons.push("OBV downtrend confirms weakness (distribution)");
  }

  // 15. VWAP — institutional fair-value reference
  if (ind.vwap20 > 0) {
    const vwapDelta = ((price - ind.vwap20) / ind.vwap20) * 100;
    if (vwapDelta > 0 && vwapDelta < 2 && ind.momentum1m > 0) {
      score += 0.5;
      reasons.push(`Holding above 20D VWAP (+${vwapDelta.toFixed(1)}%)`);
    } else if (vwapDelta < 0 && vwapDelta > -2 && ind.momentum1m < 0) {
      score -= 0.5;
      reasons.push(`Rejected at 20D VWAP (${vwapDelta.toFixed(1)}%)`);
    }
  }

  // 16. ATR-based volatility filter — penalise low-conviction signals in high-vol names
  if (ind.atrPct > 5) {
    reasons.push(`High volatility (ATR ${ind.atrPct.toFixed(1)}%)`);
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
  const confidence = Math.max(20, Math.min(100, Math.round((Math.abs(score) / 13) * 100)));

  let confidenceTier: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (confidence >= 75) confidenceTier = "HIGH";
  else if (confidence >= 45) confidenceTier = "MEDIUM";

  return { signal, reasons, score, confidence, confluenceReasons, confidenceTier };
}

function smaSeries(values: number[], period: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < period) {
      out.push(NaN);
    } else {
      let s = 0;
      for (let j = i + 1 - period; j <= i; j++) s += values[j];
      out.push(s / period);
    }
  }
  return out;
}

function rsiSeries(values: number[], period = 14): number[] {
  const out: number[] = new Array(values.length).fill(NaN);
  if (values.length < period + 1) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  gain /= period;
  loss /= period;
  out[period] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    const g = d > 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    gain = (gain * (period - 1) + g) / period;
    loss = (loss * (period - 1) + l) / period;
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  }
  return out;
}

function buildStrategies(price: number, ind: Indicators): TradingStrategy[] {
  const strategies: TradingStrategy[] = [];

  // Trend Pullback
  const trendPullback = ind.sma200 > 0 && price > ind.sma200 && (ind.rsi < 45 || price <= ind.sma20);
  strategies.push({
    id: "trend-pullback",
    name: "Trend Pullback (Buy the Dip)",
    style: "Swing",
    bias: "BULLISH",
    triggered: trendPullback,
    description: "Long-term uptrend (Price > SMA200) with a short-term oversold dip into SMA20.",
    entry: `Buy near ${ind.sma20.toFixed(2)} (SMA20) on RSI bounce above 50`,
    exit: `Target SMA50 zone; stop below ${ind.sma200.toFixed(2)}`,
  });

  // EMA Ribbon Momentum
  const ribbon = ind.ema9 > ind.ema21 && ind.ema21 > ind.ema55 && ind.volumeRatio > 1.2;
  strategies.push({
    id: "ema-ribbon",
    name: "EMA Ribbon Momentum",
    style: "Momentum",
    bias: "BULLISH",
    triggered: ribbon,
    description: "EMAs 9/21/55 stacked bullishly with volume expansion — classic ride-the-trend setup.",
    entry: `Add on pullbacks to EMA21 (${ind.ema21.toFixed(2)})`,
    exit: "Exit on close below EMA21 or bearish MACD cross",
  });

  // Bollinger Mean Reversion
  const meanReversion = ind.bbPct <= 0.1 && ind.rsi < 35;
  strategies.push({
    id: "bb-mean-reversion",
    name: "Bollinger Mean Reversion",
    style: "Mean Reversion",
    bias: "BULLISH",
    triggered: meanReversion,
    description: "Price tagged the lower Bollinger band while RSI is oversold — high-probability bounce.",
    entry: `Buy near ${ind.bbLower.toFixed(2)} (lower band)`,
    exit: `Target Bollinger mid ${ind.bbMid.toFixed(2)}; stop 2% below band`,
  });

  // Volatility Squeeze Breakout
  const squeeze = ind.bbWidth < 0.08;
  const squeezeBull = squeeze && (ind.macdCross === "BULLISH" || ind.macdHist > 0);
  strategies.push({
    id: "squeeze-breakout",
    name: "Volatility Squeeze Breakout",
    style: "Breakout",
    bias: squeeze ? (ind.macdHist >= 0 ? "BULLISH" : "BEARISH") : "NEUTRAL",
    triggered: squeezeBull || (squeeze && ind.macdHist < 0),
    description: "Bollinger band width compressed — energy building for a directional move.",
    entry: `Buy break above ${ind.bbUpper.toFixed(2)}; short break below ${ind.bbLower.toFixed(2)}`,
    exit: "Trail stop along EMA9; ride breakout until momentum stalls",
  });

  // Golden / Death Cross
  const golden = ind.sma50 > ind.sma200 && Math.abs(ind.sma50 - ind.sma200) / ind.sma200 < 0.02;
  strategies.push({
    id: "golden-cross",
    name: "Golden Cross Setup",
    style: "Positional",
    bias: "BULLISH",
    triggered: golden,
    description: "SMA50 crossing/just above SMA200 — long-term trend reversal signal.",
    entry: `Accumulate near SMA50 (${ind.sma50.toFixed(2)})`,
    exit: `Hold while SMA50 stays above SMA200`,
  });

  // Pivot Intraday
  const pivotBuy = price > ind.pivotPP && price < ind.pivotR1;
  strategies.push({
    id: "pivot-intraday",
    name: "Pivot Intraday Long",
    style: "Intraday",
    bias: "BULLISH",
    triggered: pivotBuy,
    description: "Price holding above daily Pivot Point — bullish intraday bias toward R1.",
    entry: `Buy above PP ${ind.pivotPP.toFixed(2)}`,
    exit: `Target R1 ${ind.pivotR1.toFixed(2)}; stop below S1 ${ind.pivotS1.toFixed(2)}`,
  });

  // Fibonacci Bounce
  const fibBounce =
    Math.abs(price - ind.fib618) / ind.fib618 <= 0.025 && price >= ind.fib618;
  strategies.push({
    id: "fib-bounce",
    name: "Golden Fibonacci Bounce",
    style: "Swing",
    bias: "BULLISH",
    triggered: fibBounce,
    description: "Price holding the 61.8% Fibonacci retracement — high-conviction reversal zone.",
    entry: `Buy near 61.8% Fib ${ind.fib618.toFixed(2)}`,
    exit: `Target 38.2% Fib ${ind.fib382.toFixed(2)}; stop below 78.6%`,
  });

  // Sell the Rip
  const sellRip = ind.sma200 > 0 && price < ind.sma200 && (ind.rsi > 58 || price >= ind.sma20);
  strategies.push({
    id: "sell-rip",
    name: "Sell the Rip (Bearish)",
    style: "Swing",
    bias: "BEARISH",
    triggered: sellRip,
    description: "Long-term downtrend (Price < SMA200) with a short-term overbought bounce.",
    entry: `Short near SMA20 ${ind.sma20.toFixed(2)} on RSI rejection at 60`,
    exit: `Target SMA50; stop above ${ind.sma200.toFixed(2)}`,
  });

  return strategies;
}

async function fetchOne(symbol: string, name: string, sector: string): Promise<StockQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5y`;
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

    // ROI over standard windows (using ~21 trading days/month)
    const roiAt = (daysAgo: number): number => {
      const idx = closes.length - 1 - daysAgo;
      if (idx < 0) return 0;
      const base = closes[idx];
      return base ? ((price - base) / base) * 100 : 0;
    };
    const roi: ROI = {
      m1: roiAt(21),
      m3: roiAt(63),
      m6: roiAt(126),
      y1: roiAt(252),
      y3: roiAt(252 * 3),
      y5: roiAt(252 * 5),
    };

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

    const atrVal = calculateATR(highs, lows, closes, 14);
    const atrPctVal = price > 0 ? (atrVal / price) * 100 : 0;
    const stochVals = calculateStochastic(highs, lows, closes, 14, 3);
    const obvVals = calculateOBV(closes, volumes);
    const vwapVal = calculateVWAP(highs, lows, closes, volumes, 20);

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
      atr: atrVal,
      atrPct: atrPctVal,
      stochK: stochVals.k,
      stochD: stochVals.d,
      obvTrend: obvVals.trend,
      obvSlope: obvVals.slope,
      vwap20: vwapVal,
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

    // Build chart history (last ~120 days for graphs)
    const HISTORY_LEN = 120;
    const sma20Full = smaSeries(closes, 20);
    const sma50Full = smaSeries(closes, 50);
    const rsiFull = rsiSeries(closes, 14);
    const sliceTail = <T,>(arr: T[]) => arr.slice(-HISTORY_LEN);
    const history = {
      closes: sliceTail(closes),
      highs: sliceTail(highs),
      lows: sliceTail(lows),
      volumes: sliceTail(volumes),
      sma20: sliceTail(sma20Full),
      sma50: sliceTail(sma50Full),
      rsi: sliceTail(rsiFull),
    };

    const strategies = buildStrategies(price, indicators);

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
      history,
      strategies,
      roi,
    };
  } catch (e) {
    console.error("fetchOne failed", symbol, e);
    return null;
  }
}

// Concurrency-limited batch runner. Yahoo Finance throttles aggressively
// past ~30 parallel requests — without this, ~30% of rows come back null.
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

export const getIndianStocks = createServerFn({ method: "GET" }).handler(async () => {
  const results = await mapWithConcurrency(DEFAULT_TICKERS, 10, (t) =>
    fetchOne(t.symbol, t.name, t.sector),
  );
  const quotes = results.filter((q): q is StockQuote => q !== null);
  return { quotes, fetchedAt: Date.now() };
});

export interface HistoryPoint {
  t: number; // timestamp (ms)
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export const getStockHistory = createServerFn({ method: "GET" })
  .inputValidator((data: { symbol: string; range: "1mo" | "6mo" | "1y" | "3y" | "5y" | "max" }) => data)
  .handler(async ({ data }): Promise<{ points: HistoryPoint[] }> => {
    try {
      const interval =
        data.range === "1mo" ? "1d" : data.range === "6mo" || data.range === "1y" ? "1d" : "1wk";
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(data.symbol)}?interval=${interval}&range=${data.range}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LovableStocks/1.0)",
          Accept: "application/json",
        },
      });
      if (!res.ok) return { points: [] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json = (await res.json()) as any;
      const result = json?.chart?.result?.[0];
      if (!result) return { points: [] };
      const ts: number[] = result.timestamp ?? [];
      const q = result.indicators?.quote?.[0] ?? {};
      const opens: (number | null)[] = q.open ?? [];
      const highs: (number | null)[] = q.high ?? [];
      const lows: (number | null)[] = q.low ?? [];
      const closes: (number | null)[] = q.close ?? [];
      const vols: (number | null)[] = q.volume ?? [];
      const points: HistoryPoint[] = [];
      for (let i = 0; i < ts.length; i++) {
        const c = closes[i];
        if (typeof c !== "number" || Number.isNaN(c)) continue;
        points.push({
          t: (ts[i] ?? 0) * 1000,
          o: typeof opens[i] === "number" ? (opens[i] as number) : c,
          h: typeof highs[i] === "number" ? (highs[i] as number) : c,
          l: typeof lows[i] === "number" ? (lows[i] as number) : c,
          c,
          v: typeof vols[i] === "number" ? (vols[i] as number) : 0,
        });
      }
      return { points };
    } catch (e) {
      console.error("getStockHistory failed", data.symbol, e);
      return { points: [] };
    }
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
