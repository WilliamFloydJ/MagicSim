import { createContext, useContext, useState, useEffect } from "react";

const ManaImageContext = createContext({});

export function ManaImageProvider({ children }) {
  const [manaImages, setManaImages] = useState({});

  const fetchManaImages = async () => {
    try {
      const res = await fetch("/api/mana-images");
      if (res.ok) setManaImages(await res.json());
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchManaImages();
  }, []);

  return (
    <ManaImageContext.Provider
      value={{ manaImages, refetchManaImages: fetchManaImages }}
    >
      {children}
    </ManaImageContext.Provider>
  );
}

export function useManaImages() {
  return useContext(ManaImageContext);
}

export function parseManaSymbols(costStr) {
  if (!costStr) return [];
  const symbols = [];
  const upper = costStr.toUpperCase();
  let i = 0;
  while (i < upper.length) {
    const ch = upper[i];
    if ("WUBRG".includes(ch)) {
      symbols.push(ch);
      i++;
    } else if (ch === "X") {
      symbols.push("X");
      i++;
    } else if (ch >= "0" && ch <= "9") {
      let num = "";
      while (i < upper.length && upper[i] >= "0" && upper[i] <= "9") {
        num += upper[i];
        i++;
      }
      symbols.push(num);
    } else {
      i++;
    }
  }
  return symbols;
}

export function calcCMC(costStr) {
  if (!costStr) return 0;
  const symbols = parseManaSymbols(costStr);
  return symbols.reduce((sum, s) => {
    if ("WUBRG".includes(s)) return sum + 1;
    if (s === "X") return sum;
    const n = parseInt(s);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
}

export function detectColors(costStr) {
  if (!costStr) return [];
  const colors = new Set();
  costStr
    .toUpperCase()
    .split("")
    .forEach((ch) => {
      if ("WUBRG".includes(ch)) colors.add(ch);
    });
  return Array.from(colors);
}

const COLOR_MAP = {
  W: { bg: "#f9faf4", label: "White", symbol: "☀" },
  U: { bg: "#0e68ab", label: "Blue", symbol: "💧" },
  B: { bg: "#150b00", label: "Black", symbol: "💀" },
  R: { bg: "#d3202a", label: "Red", symbol: "🔥" },
  G: { bg: "#00733e", label: "Green", symbol: "🌲" },
};

export default function ManaSymbol({ symbol, size = 24 }) {
  const s = String(symbol).toUpperCase();
  const info = COLOR_MAP[s];
  const { manaImages } = useManaImages();
  const customImg = manaImages[s];

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "50%",
    fontSize: size * 0.5,
    fontWeight: 700,
    border: customImg ? "none" : "1.5px solid #888",
    flexShrink: 0,
    overflow: "hidden",
    padding: 0,
  };

  if (customImg) {
    return (
      <span
        className={`mana-pip mana-${s}`}
        style={baseStyle}
        title={info?.label || `${s} mana`}
      >
        <img
          src={customImg}
          alt={s}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </span>
    );
  }

  if (info) {
    return (
      <span
        className={`mana-pip mana-${s}`}
        style={{
          ...baseStyle,
          background: info.bg,
          color: s === "W" ? "#333" : s === "B" ? "#aaa" : "#fff",
        }}
        title={info.label}
      >
        {s}
      </span>
    );
  }

  // Generic / number / X
  return (
    <span
      className="mana-pip mana-generic"
      style={{
        ...baseStyle,
        background: "#beb9b2",
        color: "#333",
      }}
      title={`${s} generic mana`}
    >
      {s}
    </span>
  );
}

export function ManaCost({ cost, size = 22 }) {
  const symbols = parseManaSymbols(cost);
  if (!symbols.length) return null;
  return (
    <span className="mana-cost-row" style={{ display: "inline-flex", gap: 2 }}>
      {symbols.map((s, i) => (
        <ManaSymbol key={i} symbol={s} size={size} />
      ))}
    </span>
  );
}
