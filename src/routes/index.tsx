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
      { title: "Arjun Signal — Indian Stocks Buy/Sell/Hold + Live News" },
      {
        name: "description",
        content:
          "Live NSE stock prices across every Indian sector with technical buy/sell/hold signals from SMA & RSI, plus the latest news headlines for every stock.",
      },
    ],
  }),
  component: Index,
});

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
    persist(watchlist.includes(symbol) ? watchlist.filter((s) => s !== symbol) : [...watchlist, symbol]);
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
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Arjun Signal · NSE India · All Sectors
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Aim. Act. Profit.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Daily signals on {quotes.length || "150+"} Indian equities. Buy/Sell/Hold computed from 8 indicators — SMA 20/50/200, MACD, RSI-14, Bollinger Bands, 52-week range, momentum & volume trend. Tap a row for the full breakdown and news. Educational prototype — not investment advice.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Tracked" value={quotes.length} active={view === "ALL" && filter === "ALL"} onClick={() => { setView("ALL"); setFilter("ALL"); }} />
          <StatCard label="Buy signals" value={counts.BUY} tone="buy" active={filter === "BUY"} onClick={() => { setView("ALL"); setFilter("BUY"); }} />
          <StatCard label="Sell signals" value={counts.SELL} tone="sell" active={filter === "SELL"} onClick={() => { setView("ALL"); setFilter("SELL"); }} />
          <StatCard label="Hold" value={counts.HOLD} tone="hold" active={filter === "HOLD"} onClick={() => { setView("ALL"); setFilter("HOLD"); }} />
        </section>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex rounded-md border border-border bg-card p-1">
            {(["ALL", "WATCHLIST"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 text-xs font-semibold tracking-wider transition ${
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                  {view === "WATCHLIST" ? "Your watchlist is empty — tap the ★ on any stock to add it." : "No matches."}
                </li>
              )}
            </ul>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Quotes: Yahoo Finance (end-of-day). Signals computed daily from 8 technical indicators.
          {data?.fetchedAt && (
            <> · Last update {new Date(data.fetchedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</>
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
              watched
                ? "text-[oklch(0.82_0.16_85)]"
                : "text-muted-foreground hover:text-foreground"
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
        <button onClick={onToggle} className="col-span-6 text-right md:col-span-1 font-mono text-sm">
          {q.rsi.toFixed(0)}
        </button>
        <button onClick={onToggle} className="col-span-6 md:col-span-2 flex flex-col items-end gap-1">
          <SignalPill signal={q.signal} />
          <div className="text-[10px] text-muted-foreground">
            {q.confidence}% confidence
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
  const items: { label: string; value: string; tone?: "buy" | "sell" | "neutral" }[] = [
    { label: "SMA 20", value: formatINR(q.sma20), tone: q.price > q.sma20 ? "buy" : "sell" },
    { label: "SMA 50", value: formatINR(q.sma50), tone: q.price > q.sma50 ? "buy" : "sell" },
    { label: "SMA 200", value: formatINR(q.sma200), tone: q.price > q.sma200 ? "buy" : "sell" },
    { label: "MACD hist", value: q.macdHist.toFixed(2), tone: q.macdHist > 0 ? "buy" : "sell" },
    { label: "RSI 14", value: q.rsi.toFixed(1), tone: q.rsi < 30 ? "buy" : q.rsi > 70 ? "sell" : "neutral" },
    { label: "Bollinger %", value: `${(q.bbPct * 100).toFixed(0)}%`, tone: q.bbPct < 0.2 ? "buy" : q.bbPct > 0.8 ? "sell" : "neutral" },
    { label: "52w High", value: formatINR(q.week52High), tone: "neutral" },
    { label: "52w Low", value: formatINR(q.week52Low), tone: "neutral" },
    { label: "From 52w High", value: `${q.pctFrom52High.toFixed(1)}%`, tone: q.pctFrom52High > -5 ? "sell" : "neutral" },
    { label: "From 52w Low", value: `+${q.pctFrom52Low.toFixed(1)}%`, tone: q.pctFrom52Low < 15 ? "buy" : "neutral" },
    { label: "1m momentum", value: `${q.momentum1m >= 0 ? "+" : ""}${q.momentum1m.toFixed(1)}%`, tone: q.momentum1m > 0 ? "buy" : "sell" },
    { label: "3m momentum", value: `${q.momentum3m >= 0 ? "+" : ""}${q.momentum3m.toFixed(1)}%`, tone: q.momentum3m > 0 ? "buy" : "sell" },
    { label: "Volume vs 20d", value: `${q.volumeRatio.toFixed(2)}x`, tone: q.volumeRatio > 1.3 ? "buy" : "neutral" },
    { label: "Composite score", value: q.score.toFixed(2), tone: q.score > 0 ? "buy" : q.score < 0 ? "sell" : "neutral" },
  ];

  return (
    <div className="border-t border-border bg-background/40 px-5 py-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Why this signal · {q.confidence}% confidence
        </div>
        <div className="text-[10px] text-muted-foreground">8-factor composite</div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {items.map((it) => (
          <div key={it.label} className="rounded-md border border-border bg-card/60 px-2.5 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.label}</div>
            <div
              className={`mt-0.5 font-mono text-sm font-semibold ${
                it.tone === "buy"
                  ? "text-[oklch(0.78_0.18_150)]"
                  : it.tone === "sell"
                    ? "text-[oklch(0.75_0.22_25)]"
                    : "text-foreground"
              }`}
            >
              {it.value}
            </div>
          </div>
        ))}
      </div>
      {q.reasons.length > 0 && (
        <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          {q.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-foreground/40">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
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
                  <div className="text-sm font-medium group-hover:text-primary">
                    {n.title}
                  </div>
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
