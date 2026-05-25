import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  getIndianStocks,
  getStockNews,
  type Signal,
  type StockQuote,
} from "@/lib/stocks.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stox Buddy — Indian Stocks Technical Analysis & Buy/Sell Signals" },
      {
        name: "description",
        content:
          "Stox Buddy: deep technical analysis on 200+ NSE stocks across every Indian sector. SMA, MACD, RSI, ADX, MFI, Bollinger, Fibonacci & Pivot levels with clear buy/sell/hold signals.",
      },
    ],
  }),
  component: Index,
});

function StoxBuddyLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.17_255)] via-[oklch(0.78_0.18_150)] to-[oklch(0.82_0.16_85)] shadow-lg shadow-[oklch(0.72_0.17_255)]/30 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 text-background" fill="none">
        <rect x="5"  y="14" width="3" height="10" rx="1" fill="currentColor" className="sb-logo-bar" style={{ animationDelay: "0s" }} />
        <rect x="11" y="9"  width="3" height="15" rx="1" fill="currentColor" className="sb-logo-bar" style={{ animationDelay: "0.3s" }} />
        <rect x="17" y="5"  width="3" height="19" rx="1" fill="currentColor" className="sb-logo-bar" style={{ animationDelay: "0.6s" }} />
        <path d="M24 8 L28 4 M28 4 L28 8 M28 4 L24 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.18_150)] sb-pulse-ring" />
    </span>
  );
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

function timeAgo(ts: number) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const signalStyles: Record<Signal, string> = {
  BUY: "bg-[oklch(0.72_0.18_150)]/15 text-[oklch(0.78_0.18_150)] border-[oklch(0.72_0.18_150)]/40",
  SELL: "bg-[oklch(0.65_0.22_25)]/15 text-[oklch(0.75_0.22_25)] border-[oklch(0.65_0.22_25)]/40",
  HOLD: "bg-[oklch(0.75_0.16_85)]/15 text-[oklch(0.82_0.16_85)] border-[oklch(0.75_0.16_85)]/40",
};

function SignalPill({ signal }: { signal: Signal }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wider ${signalStyles[signal]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {signal}
    </span>
  );
}

const WATCHLIST_KEY = "arjun-signal-watchlist";

function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const persist = (next: string[]) => {
    setWatchlist(next);
    try {
      window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (symbol: string) => {
    persist(
      watchlist.includes(symbol) ? watchlist.filter((s) => s !== symbol) : [...watchlist, symbol],
    );
  };

  return { watchlist, toggle, isWatched: (s: string) => watchlist.includes(s) };
}

function Index() {
  const fetchStocks = useServerFn(getIndianStocks);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["indian-stocks"],
    queryFn: () => fetchStocks(),
    // Daily refresh — signals are computed on end-of-day data
    refetchInterval: 24 * 60 * 60 * 1000,
    staleTime: 12 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [filter, setFilter] = useState<"ALL" | Signal>("ALL");
  const [sector, setSector] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"ALL" | "WATCHLIST">("ALL");
  const { watchlist, toggle, isWatched } = useWatchlist();

  const quotes = data?.quotes ?? [];

  const sectors = useMemo(() => {
    const s = new Set<string>();
    quotes.forEach((q) => s.add(q.sector));
    return ["ALL", ...Array.from(s).sort()];
  }, [quotes]);

  const filtered = useMemo(() => {
    return quotes
      .filter((q) => (view === "WATCHLIST" ? watchlist.includes(q.symbol) : true))
      .filter((q) => (filter === "ALL" ? true : q.signal === filter))
      .filter((q) => (sector === "ALL" ? true : q.sector === sector))
      .filter((q) =>
        query
          ? q.name.toLowerCase().includes(query.toLowerCase()) ||
            q.symbol.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [quotes, filter, sector, query, view, watchlist]);

  const counts = useMemo(() => {
    return quotes.reduce(
      (acc, q) => {
        acc[q.signal]++;
        return acc;
      },
      { BUY: 0, SELL: 0, HOLD: 0 } as Record<Signal, number>,
    );
  }, [quotes]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 sb-fade-up">
          <div className="flex items-start gap-4">
            <StoxBuddyLogo className="mt-1" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                NSE India · All Sectors · Technical Analysis
              </div>
              <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="sb-gradient-text">Stox Buddy</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Your friendly stock companion. Daily signals on{" "}
                <span className="text-foreground font-semibold">{quotes.length || "200+"}</span>{" "}
                Indian equities — from Tata Motors PV &amp; CV plays to IT, pharma, defence and EV
                ecosystem. Tap any row for full technical analysis: SMA, MACD, RSI, ADX, MFI,
                Bollinger Bands, Fibonacci &amp; Pivot levels, plus live news. Educational
                prototype — not investment advice.
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent sb-hover-lift disabled:opacity-50"
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Tracked"
            value={quotes.length}
            active={view === "ALL" && filter === "ALL"}
            onClick={() => {
              setView("ALL");
              setFilter("ALL");
            }}
          />
          <StatCard
            label="Buy signals"
            value={counts.BUY}
            tone="buy"
            active={filter === "BUY"}
            onClick={() => {
              setView("ALL");
              setFilter("BUY");
            }}
          />
          <StatCard
            label="Sell signals"
            value={counts.SELL}
            tone="sell"
            active={filter === "SELL"}
            onClick={() => {
              setView("ALL");
              setFilter("SELL");
            }}
          />
          <StatCard
            label="Hold"
            value={counts.HOLD}
            tone="hold"
            active={filter === "HOLD"}
            onClick={() => {
              setView("ALL");
              setFilter("HOLD");
            }}
          />
        </section>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex rounded-md border border-border bg-card p-1">
            {(["ALL", "WATCHLIST"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 text-xs font-semibold tracking-wider transition ${
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "WATCHLIST" ? `★ Watchlist (${watchlist.length})` : "All stocks"}
              </button>
            ))}
          </div>
          <div className="flex rounded-md border border-border bg-card p-1">
            {(["ALL", "BUY", "HOLD", "SELL"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1.5 text-xs font-semibold tracking-wider transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock…"
            className="flex-1 min-w-[200px] rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                sector === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm">
            Failed to load stocks. {(error as Error).message}
          </div>
        ) : isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <div className="col-span-3">Stock</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Change</div>
              <div className="col-span-2 text-right">Buy / Sell zone</div>
              <div className="col-span-1 text-right">RSI</div>
              <div className="col-span-2 text-right">Signal</div>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((q) => (
                <StockRow
                  key={q.symbol}
                  q={q}
                  expanded={expanded === q.symbol}
                  onToggle={() => setExpanded(expanded === q.symbol ? null : q.symbol)}
                  watched={isWatched(q.symbol)}
                  onToggleWatch={() => toggle(q.symbol)}
                />
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  {view === "WATCHLIST"
                    ? "Your watchlist is empty — tap the ★ on any stock to add it."
                    : "No matches."}
                </li>
              )}
            </ul>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Quotes: Yahoo Finance (end-of-day). Signals computed daily from 8 technical indicators.
          {data?.fetchedAt && (
            <>
              {" "}
              · Last update{" "}
              {new Date(data.fetchedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </>
          )}
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  tone?: "buy" | "sell" | "hold";
  active?: boolean;
  onClick?: () => void;
}) {
  const toneColor =
    tone === "buy"
      ? "text-[oklch(0.78_0.18_150)]"
      : tone === "sell"
        ? "text-[oklch(0.75_0.22_25)]"
        : tone === "hold"
          ? "text-[oklch(0.82_0.16_85)]"
          : "text-foreground";
  const ringColor =
    tone === "buy"
      ? "ring-[oklch(0.72_0.18_150)]/60"
      : tone === "sell"
        ? "ring-[oklch(0.65_0.22_25)]/60"
        : tone === "hold"
          ? "ring-[oklch(0.75_0.16_85)]/60"
          : "ring-primary/60";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-border bg-card p-4 text-left transition hover:bg-accent/30 ${
        active ? `ring-2 ${ringColor}` : ""
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${toneColor}`}>{value}</div>
    </button>
  );
}

function StockRow({
  q,
  expanded,
  onToggle,
  watched,
  onToggleWatch,
}: {
  q: StockQuote;
  expanded: boolean;
  onToggle: () => void;
  watched: boolean;
  onToggleWatch: () => void;
}) {
  const up = q.change >= 0;
  return (
    <li>
      <div className="grid w-full grid-cols-12 items-center gap-4 px-5 py-4 transition hover:bg-accent/30">
        <div className="col-span-12 md:col-span-3 flex items-start gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatch();
            }}
            aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
            className={`mt-0.5 text-lg transition ${
              watched ? "text-[oklch(0.82_0.16_85)]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {watched ? "★" : "☆"}
          </button>
          <button onClick={onToggle} className="text-left">
            <div className="font-semibold">{q.name}</div>
            <div className="text-xs text-muted-foreground">
              {q.symbol.replace(".NS", "")} · {q.sector}
            </div>
          </button>
        </div>
        <button onClick={onToggle} className="col-span-4 text-right md:col-span-2">
          <div className="font-mono text-base font-semibold">{formatINR(q.price)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            prev {formatINR(q.previousClose)}
          </div>
        </button>
        <button
          onClick={onToggle}
          className={`col-span-4 text-right md:col-span-2 font-mono text-sm font-semibold ${
            up ? "text-[oklch(0.78_0.18_150)]" : "text-[oklch(0.75_0.22_25)]"
          }`}
        >
          {up ? "▲" : "▼"} {formatINR(Math.abs(q.change))}
          <div className="text-xs">
            {up ? "+" : ""}
            {q.changePercent.toFixed(2)}%
          </div>
        </button>
        <button onClick={onToggle} className="col-span-4 text-right md:col-span-2">
          <div className="font-mono text-xs text-[oklch(0.78_0.18_150)]">
            B {formatINR(q.suggestedBuyPrice)}
          </div>
          <div className="font-mono text-xs text-[oklch(0.75_0.22_25)]">
            S {formatINR(q.suggestedSellPrice)}
          </div>
        </button>
        <button
          onClick={onToggle}
          className="col-span-6 text-right md:col-span-1 font-mono text-sm"
        >
          {q.rsi.toFixed(0)}
        </button>
        <button
          onClick={onToggle}
          className="col-span-6 md:col-span-2 flex flex-col items-end gap-1"
        >
          <div className="flex items-center gap-1.5">
            {q.confidenceTier === "HIGH" && (
              <span
                className="inline-block h-2 w-2 rounded-full bg-[oklch(0.78_0.18_150)] animate-pulse"
                title="High Confidence Crossover"
              />
            )}
            <SignalPill signal={q.signal} />
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>{q.confidence}% confidence</span>
            {q.confidenceTier === "HIGH" && <span className="text-[oklch(0.82_0.16_85)]">★</span>}
          </div>
        </button>
      </div>
      {expanded && (
        <>
          <IndicatorPanel q={q} />
          <NewsPanel symbol={q.symbol} name={q.name} />
        </>
      )}
    </li>
  );
}

function IndicatorPanel({ q }: { q: StockQuote }) {
  const indicatorsGrid = [
    {
      name: "SMA Trend",
      value: q.price > q.sma200 ? "Bullish (Price > SMA200)" : "Bearish (Price < SMA200)",
      status: q.price > q.sma200 ? "bullish" : "bearish",
      details: `SMA200: ${formatINR(q.sma200)}`,
    },
    {
      name: "MACD Cross",
      value:
        q.macdCross === "BULLISH"
          ? "Bullish Crossover"
          : q.macdCross === "BEARISH"
            ? "Bearish Crossover"
            : q.macdHist > 0
              ? "Bullish Hist"
              : "Bearish Hist",
      status:
        q.macdCross === "BULLISH" || (q.macdCross === "NONE" && q.macdHist > 0)
          ? "bullish"
          : "bearish",
      details: `MACD Line vs Signal`,
    },
    {
      name: "RSI (14)",
      value: `${q.rsi.toFixed(1)} (${q.rsi < 30 ? "Oversold" : q.rsi > 70 ? "Overbought" : "Neutral"})`,
      status: q.rsi < 40 ? "bullish" : q.rsi > 65 ? "bearish" : "neutral",
      details: "Momentum oscillator",
    },
    {
      name: "Money Flow (MFI)",
      value: `${q.mfi.toFixed(1)} (${q.mfi < 20 ? "Oversold" : q.mfi > 80 ? "Overbought" : "Neutral"})`,
      status: q.mfi < 30 ? "bullish" : q.mfi > 70 ? "bearish" : "neutral",
      details: "Volume-weighted RSI",
    },
    {
      name: "Trend Strength (ADX)",
      value: `${q.adx.toFixed(1)} (${q.adxTrend})`,
      status: q.adxTrend === "STRONG" ? "bullish" : "neutral",
      details: "Average Directional Index",
    },
    {
      name: "Bollinger Bands",
      value: `${(q.bbPct * 100).toFixed(0)}% position`,
      status: q.bbPct < 0.2 ? "bullish" : q.bbPct > 0.8 ? "bearish" : "neutral",
      details: `Range: ${formatINR(q.bbLower)} - ${formatINR(q.bbUpper)}`,
    },
    {
      name: "Volume Surge",
      value: `${q.volumeRatio.toFixed(2)}x`,
      status: q.volumeRatio > 1.3 ? "bullish" : "neutral",
      details: "5d average vs 20d average",
    },
  ];

  const fibLevels = [
    { label: "0.0% (52w High)", value: q.week52High },
    { label: "23.6%", value: q.fib236 },
    { label: "38.2%", value: q.fib382 },
    { label: "50.0% (Halfway)", value: q.fib500 },
    { label: "61.8% (Golden Support)", value: q.fib618 },
    { label: "78.6%", value: q.fib786 },
    { label: "100.0% (52w Low)", value: q.week52Low },
  ];

  const pivotLevels = [
    { label: "Resistance R2", value: q.pivotR2, color: "text-[oklch(0.75_0.22_25)]" },
    { label: "Resistance R1", value: q.pivotR1, color: "text-[oklch(0.75_0.22_25)]/80" },
    { label: "Pivot PP", value: q.pivotPP, color: "text-muted-foreground" },
    { label: "Support S1", value: q.pivotS1, color: "text-[oklch(0.78_0.18_150)]/80" },
    { label: "Support S2", value: q.pivotS2, color: "text-[oklch(0.78_0.18_150)]" },
  ];

  const tierColors = {
    HIGH: "bg-[oklch(0.72_0.18_150)]/15 text-[oklch(0.78_0.18_150)] border-[oklch(0.72_0.18_150)]/30",
    MEDIUM:
      "bg-[oklch(0.75_0.16_85)]/15 text-[oklch(0.82_0.16_85)] border-[oklch(0.75_0.16_85)]/30",
    LOW: "bg-muted/40 text-muted-foreground border-border",
  };

  return (
    <div className="border-t border-border bg-background/50 px-5 py-6">
      {/* Top Banner: Confidence & Meta */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span
            className={`rounded border px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${tierColors[q.confidenceTier]}`}
          >
            {q.confidenceTier} CONFIDENCE
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Score: {q.score > 0 ? `+${q.score.toFixed(2)}` : q.score.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">Calculated on 250+ days end-of-day data</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Trade Action Plan (glassmorphism dashboard card) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl border border-border/80 bg-gradient-to-br from-card/80 to-card/30 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              🎯 Trade Action Plan & Levels
            </h3>

            <div className="grid gap-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="text-[10px] uppercase font-semibold text-primary tracking-wide">
                  Accumulation Zone (Buy Entry Range)
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-foreground">
                  {formatINR(q.accumulationZoneMin)} - {formatINR(q.accumulationZoneMax)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Suggested range for gradual buying
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[oklch(0.72_0.18_150)]/20 bg-[oklch(0.72_0.18_150)]/5 p-3">
                  <div className="text-[10px] uppercase font-semibold text-[oklch(0.78_0.18_150)] tracking-wide">
                    Target 1 (R1)
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-[oklch(0.78_0.18_150)]">
                    {formatINR(q.target1)}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">
                    Est. Profit: +{(((q.target1 - q.price) / q.price) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="rounded-lg border border-[oklch(0.72_0.18_150)]/20 bg-[oklch(0.72_0.18_150)]/5 p-3">
                  <div className="text-[10px] uppercase font-semibold text-[oklch(0.78_0.18_150)] tracking-wide">
                    Target 2 (R2)
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-[oklch(0.78_0.18_150)]">
                    {formatINR(q.target2)}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">
                    Est. Profit: +{(((q.target2 - q.price) / q.price) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[oklch(0.65_0.22_25)]/20 bg-[oklch(0.65_0.22_25)]/5 p-3">
                <div className="text-[10px] uppercase font-semibold text-[oklch(0.75_0.22_25)] tracking-wide">
                  Invalidation Trigger (Stop Loss)
                </div>
                <div className="mt-1 font-mono text-base font-bold text-[oklch(0.75_0.22_25)]">
                  {formatINR(q.stopLoss)}
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">
                  Exit setup if price closes below. Risk:{" "}
                  {(((q.price - q.stopLoss) / q.price) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Technical Alignment Log */}
          <div className="rounded-xl border border-border/50 bg-card/40 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              📝 Confluence Insights
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {q.confluenceReasons && q.confluenceReasons.length > 0
                ? q.confluenceReasons.map((reason, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="text-[oklch(0.78_0.18_150)] font-bold">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))
                : null}
              {q.reasons.map((r, i) => {
                if (q.confluenceReasons?.some((cr) => cr.includes(r.split(" (")[0]))) return null;
                return (
                  <li key={`basic-${i}`} className="flex gap-2 items-start">
                    <span className="text-muted-foreground font-semibold">·</span>
                    <span>{r}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Column: Indicators Grid & Pivot/Fib scales */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Indicators grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              📊 Multi-Indicator Crossover & Oscillation
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {indicatorsGrid.map((it) => (
                <div
                  key={it.name}
                  className="flex items-center justify-between border border-border/50 bg-card/60 px-3.5 py-2.5 rounded-lg"
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground">{it.name}</div>
                    <div className="text-[10px] text-muted-foreground">{it.details}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-mono font-bold ${
                        it.status === "bullish"
                          ? "text-[oklch(0.78_0.18_150)]"
                          : it.status === "bearish"
                            ? "text-[oklch(0.75_0.22_25)]"
                            : "text-foreground"
                      }`}
                    >
                      {it.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pivot Points & Fibonacci Scales */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Standard Pivot Points */}
            <div className="border border-border/50 bg-card/30 rounded-xl p-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                🔑 Standard Pivot Support/Resistance
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {pivotLevels.map((lvl) => {
                  const isPriceAbove = q.price >= lvl.value;
                  return (
                    <div
                      key={lvl.label}
                      className="flex justify-between items-center py-0.5 border-b border-border/10"
                    >
                      <span className={`${lvl.color} font-medium`}>{lvl.label}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-foreground font-bold">{formatINR(lvl.value)}</span>
                        <span
                          className={`text-[9px] px-1 rounded ${isPriceAbove ? "bg-[oklch(0.72_0.18_150)]/10 text-[oklch(0.78_0.18_150)]" : "bg-[oklch(0.65_0.22_25)]/10 text-[oklch(0.75_0.22_25)]"}`}
                        >
                          {lvl.label === "Pivot PP" ? "PP" : isPriceAbove ? "ABOVE" : "BELOW"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fibonacci Retracements */}
            <div className="border border-border/50 bg-card/30 rounded-xl p-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                📏 52-Week Fibonacci Retracements
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {fibLevels.map((lvl) => {
                  const isPriceAbove = q.price >= lvl.value;
                  const isKeyGolden = lvl.label.includes("61.8%");
                  return (
                    <div
                      key={lvl.label}
                      className={`flex justify-between items-center py-0.5 border-b border-border/10 ${isKeyGolden ? "bg-[oklch(0.75_0.16_85)]/5 px-1 rounded border border-[oklch(0.75_0.16_85)]/25" : ""}`}
                    >
                      <span
                        className={`${isKeyGolden ? "text-[oklch(0.82_0.16_85)] font-bold" : "text-muted-foreground"}`}
                      >
                        {lvl.label}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-foreground font-bold">{formatINR(lvl.value)}</span>
                        <span
                          className={`text-[9px] px-1 rounded ${isPriceAbove ? "bg-[oklch(0.72_0.18_150)]/10 text-[oklch(0.78_0.18_150)]" : "bg-[oklch(0.65_0.22_25)]/10 text-[oklch(0.75_0.22_25)]"}`}
                        >
                          {isPriceAbove ? "ABOVE" : "BELOW"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsPanel({ symbol, name }: { symbol: string; name: string }) {
  const fetchNews = useServerFn(getStockNews);
  const { data, isLoading, error } = useQuery({
    queryKey: ["news", symbol],
    queryFn: () => fetchNews({ data: { symbol, name } }),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="border-t border-border bg-background/40 px-5 py-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Latest news
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted/40" />
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-muted-foreground">Couldn't load news.</div>
      ) : !data?.news.length ? (
        <div className="text-sm text-muted-foreground">No recent headlines.</div>
      ) : (
        <ul className="space-y-2">
          {data.news.map((n, i) => (
            <li key={i}>
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 rounded-md p-2 transition hover:bg-accent/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium group-hover:text-primary">{n.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {n.publisher} · {timeAgo(n.publishedAt)}
                  </div>
                </div>
                <span className="text-muted-foreground group-hover:text-primary">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
