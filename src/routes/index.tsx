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

function Index() {
  const fetchStocks = useServerFn(getIndianStocks);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["indian-stocks"],
    queryFn: () => fetchStocks(),
    refetchInterval: 60_000,
  });

  const [filter, setFilter] = useState<"ALL" | Signal>("ALL");
  const [sector, setSector] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const quotes = data?.quotes ?? [];

  const sectors = useMemo(() => {
    const s = new Set<string>();
    quotes.forEach((q) => s.add(q.sector));
    return ["ALL", ...Array.from(s).sort()];
  }, [quotes]);

  const filtered = useMemo(() => {
    return quotes
      .filter((q) => (filter === "ALL" ? true : q.signal === filter))
      .filter((q) => (sector === "ALL" ? true : q.sector === sector))
      .filter((q) =>
        query
          ? q.name.toLowerCase().includes(query.toLowerCase()) ||
            q.symbol.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [quotes, filter, sector, query]);

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
              Dalal Signal · NSE India · Nifty 50+
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Buy. Sell. Hold.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Live prices for {quotes.length || "50+"} Indian equities with technical signals (SMA-20/50 & RSI-14) and the latest news for every stock. Tap a row to see headlines. Educational prototype — not investment advice.
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
          <StatCard label="Tracked" value={quotes.length} />
          <StatCard label="Buy signals" value={counts.BUY} tone="buy" />
          <StatCard label="Sell signals" value={counts.SELL} tone="sell" />
          <StatCard label="Hold" value={counts.HOLD} tone="hold" />
        </section>

        <div className="mb-3 flex flex-wrap items-center gap-3">
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
                />
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">No matches.</li>
              )}
            </ul>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Quotes & news: Yahoo Finance (delayed). Auto-refresh 60s.
          {data?.fetchedAt && (
            <> · Last update {new Date(data.fetchedAt).toLocaleTimeString("en-IN")}</>
          )}
        </footer>
      </div>
    </main>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: "buy" | "sell" | "hold" }) {
  const toneColor =
    tone === "buy"
      ? "text-[oklch(0.78_0.18_150)]"
      : tone === "sell"
        ? "text-[oklch(0.75_0.22_25)]"
        : tone === "hold"
          ? "text-[oklch(0.82_0.16_85)]"
          : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${toneColor}`}>{value}</div>
    </div>
  );
}

function StockRow({
  q,
  expanded,
  onToggle,
}: {
  q: StockQuote;
  expanded: boolean;
  onToggle: () => void;
}) {
  const up = q.change >= 0;
  return (
    <li>
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-12 items-center gap-4 px-5 py-4 text-left transition hover:bg-accent/30"
      >
        <div className="col-span-12 md:col-span-3">
          <div className="font-semibold">{q.name}</div>
          <div className="text-xs text-muted-foreground">
            {q.symbol.replace(".NS", "")} · {q.sector}
          </div>
        </div>
        <div className="col-span-4 text-right md:col-span-2">
          <div className="font-mono text-base font-semibold">{formatINR(q.price)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            prev {formatINR(q.previousClose)}
          </div>
        </div>
        <div
          className={`col-span-4 text-right md:col-span-2 font-mono text-sm font-semibold ${
            up ? "text-[oklch(0.78_0.18_150)]" : "text-[oklch(0.75_0.22_25)]"
          }`}
        >
          {up ? "▲" : "▼"} {formatINR(Math.abs(q.change))}
          <div className="text-xs">
            {up ? "+" : ""}
            {q.changePercent.toFixed(2)}%
          </div>
        </div>
        <div className="col-span-4 text-right md:col-span-2">
          <div className="font-mono text-xs text-[oklch(0.78_0.18_150)]">
            B {formatINR(q.suggestedBuyPrice)}
          </div>
          <div className="font-mono text-xs text-[oklch(0.75_0.22_25)]">
            S {formatINR(q.suggestedSellPrice)}
          </div>
        </div>
        <div className="col-span-6 text-right md:col-span-1 font-mono text-sm">
          {q.rsi.toFixed(0)}
        </div>
        <div className="col-span-6 md:col-span-2 flex flex-col items-end gap-1">
          <SignalPill signal={q.signal} />
          <div className="text-[10px] text-muted-foreground line-clamp-2 text-right">
            {q.reason}
          </div>
        </div>
      </button>
      {expanded && <NewsPanel symbol={q.symbol} name={q.name} />}
    </li>
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
