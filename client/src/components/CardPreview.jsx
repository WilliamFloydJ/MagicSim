import { ManaCost } from "./ManaSymbol";

const FRAME_COLORS = {
  W: "linear-gradient(135deg, #f8f6d8, #e8e0c0)",
  U: "linear-gradient(135deg, #0a6faa, #064780)",
  B: "linear-gradient(135deg, #393335, #1a1518)",
  R: "linear-gradient(135deg, #d12b28, #a01e1c)",
  G: "linear-gradient(135deg, #1a6b3c, #0e4a28)",
};

function getFrameBackground(colors) {
  if (!colors || colors.length === 0)
    return "linear-gradient(135deg, #9ea1a0, #7a7d7c)";
  if (colors.length === 1) return FRAME_COLORS[colors[0]] || FRAME_COLORS.W;
  return "linear-gradient(135deg, #c9a94e, #a08734)"; // Gold for multicolor
}

export default function CardPreview({ card, compact = false }) {
  // Direct image mode: card frame with image only, no overlays
  if (card.is_direct_image) {
    return (
      <div className="mtg-card mtg-card-direct">
        <div className="card-image-frame">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="card-art"
              style={{
                objectPosition: `${card.image_pos_x ?? 50}% ${card.image_pos_y ?? 50}%`,
              }}
            />
          ) : (
            <div className="card-art-placeholder">
              <span>⚔</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  let colors = card.colors;
  if (typeof colors === "string") {
    try {
      colors = JSON.parse(colors);
    } catch {
      colors = [];
    }
  }

  const textColor = card.text_color || "#000000";
  const borderOverlay = card.border_image_url || null;
  const frameStyle = { background: getFrameBackground(colors) };

  // Per-type color (falls back to card-level text_color)
  const titleColor = card.title_color || textColor;
  const typeColor = card.type_color || textColor;
  const textboxColor = card.textbox_color || textColor;
  const infoColor = card.info_color || textColor;

  // Per-type font size (0 = use CSS default)
  const fs = (val) => (val ? { fontSize: `${val}rem` } : {});

  // Displacement helpers
  const off = (prefix) => ({
    transform: `translate(${card[prefix + "_offset_x"] || 0}px, ${card[prefix + "_offset_y"] || 0}px)`,
  });

  // Title gap (spacing between name and mana cost)
  const titleGap = card.title_gap || 0;

  if (compact) {
    return (
      <div className="mtg-card-compact" style={frameStyle}>
        <div className="compact-title">
          <span className="compact-name" style={{ color: textColor }}>
            {card.name}
          </span>
          <ManaCost cost={card.mana_cost} size={16} />
        </div>
        <div className="compact-type" style={{ color: textColor }}>
          {card.card_type}
          {card.subtype ? ` — ${card.subtype}` : ""}
        </div>
        {card.card_type.includes("Creature") && card.power && (
          <div className="compact-pt" style={{ color: textColor }}>
            {card.power}/{card.toughness}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mtg-card" style={frameStyle}>
      {/* Layer 1: Card art fills entire card */}
      <div className="card-image-frame">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            className="card-art"
            style={{
              objectPosition: `${card.image_pos_x ?? 50}% ${card.image_pos_y ?? 50}%`,
            }}
          />
        ) : (
          <div className="card-art-placeholder">
            <span>⚔</span>
          </div>
        )}
      </div>

      {/* Layer 2: Border overlay image */}
      {borderOverlay && (
        <img src={borderOverlay} alt="" className="card-border-overlay" />
      )}

      {/* Layer 3: Text elements with per-type color, font size, and displacement */}
      <div
        className="card-title-bar"
        style={{
          color: titleColor,
          gap: titleGap + 6,
          ...fs(card.title_font_size),
        }}
      >
        <span
          className="card-name"
          style={{
            transform: `translate(${card.title_offset_x || 0}px, ${card.title_offset_y || 0}px)`,
          }}
        >
          {card.name}
        </span>
        <span
          style={{
            transform: `translate(${card.mana_offset_x || 0}px, ${card.mana_offset_y || 0}px)`,
          }}
        >
          <ManaCost cost={card.mana_cost} size={18} />
        </span>
      </div>

      <div
        className="card-type-bar"
        style={{ color: typeColor, ...fs(card.type_font_size), ...off("type") }}
      >
        <span>
          {card.card_type}
          {card.subtype ? ` — ${card.subtype}` : ""}
        </span>
        <span
          className={`rarity-dot rarity-${(card.rarity || "common").toLowerCase().replace(" ", "-")}`}
          title={card.rarity}
        >
          {card.set_name || "●"}
        </span>
      </div>

      <div
        className="card-text-box"
        style={{
          color: textboxColor,
          ...fs(card.textbox_font_size),
          ...off("textbox"),
        }}
      >
        {card.abilities && <p className="card-rules">{card.abilities}</p>}
        {card.flavor_text && <p className="card-flavor">{card.flavor_text}</p>}
      </div>

      <div
        className="card-info-bar"
        style={{ color: infoColor, ...fs(card.info_font_size), ...off("info") }}
      >
        <span className="card-rarity">{card.rarity}</span>
        {card.card_type.includes("Creature") && card.power && (
          <span className="card-pt-box">
            {card.power}/{card.toughness}
          </span>
        )}
        {card.card_type === "Planeswalker" && card.loyalty && (
          <span className="card-loyalty-box">{card.loyalty}</span>
        )}
      </div>
    </div>
  );
}
