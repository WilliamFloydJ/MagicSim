import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const MANA_COLORS = {
  W: { bg: "rgba(249,250,244,0.85)", border: "#c8c4a0", label: "White" },
  U: { bg: "rgba(14,104,171,0.85)", border: "#0e68ab", label: "Blue" },
  B: { bg: "rgba(60,50,50,0.85)", border: "#5a4e4e", label: "Black" },
  R: { bg: "rgba(211,32,42,0.85)", border: "#d3202a", label: "Red" },
  G: { bg: "rgba(0,115,62,0.85)", border: "#00733e", label: "Green" },
  C: { bg: "rgba(158,161,160,0.85)", border: "#9ea1a0", label: "Colorless" },
};

const TYPE_COLORS = [
  "#c9a94e",
  "#0e68ab",
  "#d3202a",
  "#00733e",
  "#9ea1a0",
  "#8b5cf6",
  "#d97706",
  "#ec4899",
];

export default function DeckAnalytics({ cards }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="analytics-empty">
        <p>Add cards to your deck to see analytics</p>
      </div>
    );
  }

  // Parse all cards
  const parsed = cards.map((c) => {
    let colors = c.colors;
    if (typeof colors === "string") {
      try {
        colors = JSON.parse(colors);
      } catch {
        colors = [];
      }
    }
    return { ...c, colors, cmc: c.cmc || 0, qty: c.quantity || 1 };
  });

  const totalCards = parsed.reduce((s, c) => s + c.qty, 0);
  const uniqueCards = parsed.length;

  // Mana curve data
  const cmcBuckets = {};
  parsed.forEach((c) => {
    const bucket = Math.min(c.cmc, 7);
    const label = bucket >= 7 ? "7+" : String(bucket);
    cmcBuckets[label] = (cmcBuckets[label] || 0) + c.qty;
  });
  const cmcLabels = ["0", "1", "2", "3", "4", "5", "6", "7+"];
  const cmcData = cmcLabels.map((l) => cmcBuckets[l] || 0);
  const avgCMC =
    totalCards > 0
      ? (parsed.reduce((s, c) => s + c.cmc * c.qty, 0) / totalCards).toFixed(2)
      : "0";

  // Color distribution
  const colorCounts = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };
  parsed.forEach((c) => {
    if (!c.colors || c.colors.length === 0) {
      colorCounts.C += c.qty;
    } else {
      c.colors.forEach((col) => {
        if (colorCounts[col] !== undefined) colorCounts[col] += c.qty;
      });
    }
  });
  const activeColors = Object.entries(colorCounts).filter(([_, v]) => v > 0);

  // Type distribution
  const typeCounts = {};
  parsed.forEach((c) => {
    typeCounts[c.card_type] = (typeCounts[c.card_type] || 0) + c.qty;
  });
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  // Rarity distribution
  const rarityCounts = {};
  parsed.forEach((c) => {
    const r = c.rarity || "Common";
    rarityCounts[r] = (rarityCounts[r] || 0) + c.qty;
  });

  const rarityColors = {
    Common: "#888",
    Uncommon: "#8ac",
    Rare: "#c9a94e",
    "Mythic Rare": "#d35c2a",
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#d0d0d0", font: { family: "Inter" } } },
    },
    scales: {
      x: {
        ticks: { color: "#a0a0b0" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#a0a0b0", stepSize: 1 },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#d0d0d0", font: { family: "Inter" }, padding: 12 },
      },
    },
  };

  return (
    <div className="analytics-container">
      {/* Summary stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCards}</div>
          <div className="stat-label">Total Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{uniqueCards}</div>
          <div className="stat-label">Unique Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgCMC}</div>
          <div className="stat-label">Avg. Mana Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{typeEntries[0]?.[0] || "—"}</div>
          <div className="stat-label">Most Common Type</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Mana Curve */}
        <div className="chart-card">
          <h3>Mana Curve</h3>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: cmcLabels,
                datasets: [
                  {
                    label: "Cards",
                    data: cmcData,
                    backgroundColor: "rgba(201, 169, 78, 0.7)",
                    borderColor: "#c9a94e",
                    borderWidth: 1,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>

        {/* Color Distribution */}
        <div className="chart-card">
          <h3>Color Distribution</h3>
          <div className="chart-wrap chart-wrap-sm">
            <Doughnut
              data={{
                labels: activeColors.map(([k]) => MANA_COLORS[k].label),
                datasets: [
                  {
                    data: activeColors.map(([_, v]) => v),
                    backgroundColor: activeColors.map(
                      ([k]) => MANA_COLORS[k].bg,
                    ),
                    borderColor: activeColors.map(
                      ([k]) => MANA_COLORS[k].border,
                    ),
                    borderWidth: 2,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Type Distribution */}
        <div className="chart-card">
          <h3>Card Types</h3>
          <div className="chart-wrap chart-wrap-sm">
            <Doughnut
              data={{
                labels: typeEntries.map(([k]) => k),
                datasets: [
                  {
                    data: typeEntries.map(([_, v]) => v),
                    backgroundColor: typeEntries.map(
                      (_, i) => TYPE_COLORS[i % TYPE_COLORS.length],
                    ),
                    borderColor: "#1a1a2e",
                    borderWidth: 2,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Rarity Distribution */}
        <div className="chart-card">
          <h3>Rarity Breakdown</h3>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: Object.keys(rarityCounts),
                datasets: [
                  {
                    label: "Cards",
                    data: Object.values(rarityCounts),
                    backgroundColor: Object.keys(rarityCounts).map(
                      (r) => rarityColors[r] || "#888",
                    ),
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                indexAxis: "y",
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
