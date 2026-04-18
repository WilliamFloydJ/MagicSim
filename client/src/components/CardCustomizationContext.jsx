import { createContext, useContext, useState, useEffect } from "react";

const CardCustomizationContext = createContext({});

export function CardCustomizationProvider({ children }) {
  const [customization, setCustomization] = useState({});

  const fetchCustomization = async () => {
    try {
      const res = await fetch("/api/card-customization");
      if (res.ok) setCustomization(await res.json());
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchCustomization();
  }, []);

  // Inject custom font @font-face when a font URL is set
  useEffect(() => {
    const existing = document.getElementById("custom-card-font-style");
    if (customization.font_url) {
      const fontName = customization.font_name || "CustomCardFont";
      const css = `@font-face { font-family: '${fontName}'; src: url('${customization.font_url}'); font-display: swap; }`;
      if (existing) {
        existing.textContent = css;
      } else {
        const style = document.createElement("style");
        style.id = "custom-card-font-style";
        style.textContent = css;
        document.head.appendChild(style);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [customization.font_url, customization.font_name]);

  return (
    <CardCustomizationContext.Provider
      value={{ customization, refetchCustomization: fetchCustomization }}
    >
      {children}
    </CardCustomizationContext.Provider>
  );
}

export function useCardCustomization() {
  return useContext(CardCustomizationContext);
}
