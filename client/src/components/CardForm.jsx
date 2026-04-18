import { useState, useEffect, useRef, useCallback } from "react";
import { calcCMC, detectColors } from "./ManaSymbol";
import { ManaCost } from "./ManaSymbol";
import { toPng } from "html-to-image";
import CardPreview from "./CardPreview";

const CARD_TYPES = [
  "Creature",
  "Legendary Creature",
  "Instant",
  "Sorcery",
  "Enchantment",
  "Artifact",
  "Land",
  "Legendary Land",
  "Planeswalker",
  "Tribal",
];
const RARITIES = ["Common", "Uncommon", "Rare", "Mythic Rare"];
const ART_STYLES = [
  { value: "standard", label: "Standard" },
  { value: "full-art", label: "Full Art" },
  { value: "borderless", label: "Borderless" },
  { value: "extended-art", label: "Extended Art" },
];
const COLOR_OPTIONS = [
  { value: "W", label: "White", symbol: "☀" },
  { value: "U", label: "Blue", symbol: "💧" },
  { value: "B", label: "Black", symbol: "💀" },
  { value: "R", label: "Red", symbol: "🔥" },
  { value: "G", label: "Green", symbol: "🌲" },
];

const EMPTY_CARD = {
  name: "",
  image_url: "",
  card_type: "Creature",
  subtype: "",
  mana_cost: "",
  colors: [],
  power: "",
  toughness: "",
  loyalty: "",
  rarity: "Common",
  art_style: "standard",
  image_pos_x: 50,
  image_pos_y: 50,
  abilities: "",
  flavor_text: "",
  set_name: "",
  quantity: 1,
  border_image_url: "",
  text_color: "#000000",
  title_color: "",
  type_color: "",
  textbox_color: "",
  info_color: "",
  title_font_size: 0,
  type_font_size: 0,
  textbox_font_size: 0,
  info_font_size: 0,
  title_gap: 0,
  title_offset_x: 0,
  title_offset_y: 0,
  mana_offset_x: 0,
  mana_offset_y: 0,
  type_offset_x: 0,
  type_offset_y: 0,
  textbox_offset_x: 0,
  textbox_offset_y: 0,
  info_offset_x: 0,
  info_offset_y: 0,
  events: [],
};

export default function CardForm({ deckId, onSave, onClose, editCard = null }) {
  const [card, setCard] = useState(EMPTY_CARD);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [useDirectImage, setUseDirectImage] = useState(false);
  const dragRef = useRef(null);
  const previewRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  useEffect(() => {
    if (editCard) {
      let colors = editCard.colors;
      if (typeof colors === "string") {
        try {
          colors = JSON.parse(colors);
        } catch {
          colors = [];
        }
      }
      let events = editCard.events;
      if (typeof events === "string") {
        try {
          events = JSON.parse(events);
        } catch {
          events = [];
        }
      }
      setCard({
        ...EMPTY_CARD,
        ...editCard,
        colors,
        events: events || [],
        quantity: editCard.quantity || 1,
      });
      if (editCard.is_direct_image) {
        setUseDirectImage(true);
      }
    }
  }, [editCard]);

  const handleChange = (field, value) => {
    setCard((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "mana_cost") {
        next.colors = detectColors(value);
      }
      return next;
    });
  };

  const toggleColor = (color) => {
    setCard((prev) => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) handleChange("image_url", data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const handleBorderUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) handleChange("border_image_url", data.url);
    } catch (err) {
      console.error("Border upload failed:", err);
    }
  };

  const onDragStart = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStart.current = {
        x: clientX,
        y: clientY,
        posX: card.image_pos_x ?? 50,
        posY: card.image_pos_y ?? 50,
      };
    },
    [card.image_pos_x, card.image_pos_y],
  );

  const onDragMove = useCallback(
    (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const el = dragRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = ((clientX - dragStart.current.x) / rect.width) * -100;
      const dy = ((clientY - dragStart.current.y) / rect.height) * -100;
      const newX = Math.max(0, Math.min(100, dragStart.current.posX + dx));
      const newY = Math.max(0, Math.min(100, dragStart.current.posY + dy));
      setCard((prev) => ({
        ...prev,
        image_pos_x: Math.round(newX),
        image_pos_y: Math.round(newY),
      }));
    },
    [dragging],
  );

  const onDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", onDragMove);
      window.addEventListener("touchend", onDragEnd);
      return () => {
        window.removeEventListener("mousemove", onDragMove);
        window.removeEventListener("mouseup", onDragEnd);
        window.removeEventListener("touchmove", onDragMove);
        window.removeEventListener("touchend", onDragEnd);
      };
    }
  }, [dragging, onDragMove, onDragEnd]);

  const captureCardImage = async () => {
    const node = previewRef.current;
    if (!node) return null;
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const form = new FormData();
      form.append("image", blob, "card-composed.png");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await uploadRes.json();
      return data.url || null;
    } catch (err) {
      console.error("Card capture failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card.name.trim()) return;
    setSaving(true);
    try {
      const cmc = calcCMC(card.mana_cost);
      const composedUrl = await captureCardImage();
      const payload = {
        ...card,
        cmc,
        composed_image_url: composedUrl || "",
        is_direct_image: useDirectImage ? 1 : 0,
      };

      let res;
      if (editCard?.id) {
        res = await fetch(`/api/cards/${editCard.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/decks/${deckId}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
        if (!editCard) setCard(EMPTY_CARD);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  };

  const cmc = calcCMC(card.mana_cost);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editCard ? "Edit Card" : "Add New Card"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="card-editor-layout">
          {/* Left side: form */}
          <form onSubmit={handleSubmit} className="card-form card-editor-form">
            <div className="form-columns">
              {/* Left column - main fields */}
              <div className="form-col">
                <div className="form-group">
                  <label>Card Name *</label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Lightning Bolt"
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Card Type</label>
                    <select
                      value={card.card_type}
                      onChange={(e) =>
                        handleChange("card_type", e.target.value)
                      }
                    >
                      {CARD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Subtype</label>
                    <input
                      type="text"
                      value={card.subtype}
                      onChange={(e) => handleChange("subtype", e.target.value)}
                      placeholder="Elf Warrior"
                      maxLength={200}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Mana Cost</label>
                    <div className="mana-input-wrap">
                      <input
                        type="text"
                        value={card.mana_cost}
                        onChange={(e) =>
                          handleChange("mana_cost", e.target.value)
                        }
                        placeholder="2RR"
                        maxLength={30}
                      />
                      <div className="mana-preview">
                        <ManaCost cost={card.mana_cost} size={20} />
                        {cmc > 0 && (
                          <span className="cmc-badge">CMC: {cmc}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group flex-1">
                    <label>Rarity</label>
                    <select
                      value={card.rarity}
                      onChange={(e) => handleChange("rarity", e.target.value)}
                    >
                      {RARITIES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Colors</label>
                  <div className="color-toggles">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`color-toggle ${card.colors.includes(c.value) ? "active" : ""} color-${c.value}`}
                        onClick={() => toggleColor(c.value)}
                        title={c.label}
                      >
                        {c.symbol} {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {card.card_type.includes("Creature") && (
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Power</label>
                      <input
                        type="text"
                        value={card.power}
                        onChange={(e) => handleChange("power", e.target.value)}
                        placeholder="4"
                        maxLength={10}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Toughness</label>
                      <input
                        type="text"
                        value={card.toughness}
                        onChange={(e) =>
                          handleChange("toughness", e.target.value)
                        }
                        placeholder="4"
                        maxLength={10}
                      />
                    </div>
                  </div>
                )}

                {card.card_type === "Planeswalker" && (
                  <div className="form-group">
                    <label>Starting Loyalty</label>
                    <input
                      type="text"
                      value={card.loyalty}
                      onChange={(e) => handleChange("loyalty", e.target.value)}
                      placeholder="3"
                      maxLength={10}
                    />
                  </div>
                )}
              </div>

              {/* Right column - text and image */}
              <div className="form-col">
                <div className="form-group">
                  <label className="direct-image-toggle">
                    <input
                      type="checkbox"
                      checked={useDirectImage}
                      onChange={(e) => setUseDirectImage(e.target.checked)}
                    />
                    <span>
                      Image only — no overlays (border, text, symbols)
                    </span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Card Image</label>
                  <input
                    type="text"
                    value={card.image_url}
                    onChange={(e) => handleChange("image_url", e.target.value)}
                    placeholder="https://example.com/card-art.jpg"
                  />
                  <div className="upload-row">
                    <label className="upload-btn">
                      {uploading ? "Uploading…" : "📁 Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  </div>
                  {card.image_url && (
                    <div
                      className="image-pos-dragger"
                      ref={dragRef}
                      onMouseDown={onDragStart}
                      onTouchStart={onDragStart}
                    >
                      <img
                        src={card.image_url}
                        alt="preview"
                        style={{
                          objectPosition: `${card.image_pos_x ?? 50}% ${card.image_pos_y ?? 50}%`,
                        }}
                        draggable={false}
                      />
                      <div className="drag-hint">
                        {dragging ? "Release to set" : "Drag to reposition"}
                      </div>
                      <button
                        type="button"
                        className="pos-reset-btn"
                        onClick={() => {
                          handleChange("image_pos_x", 50);
                          handleChange("image_pos_y", 50);
                        }}
                        title="Reset position"
                      >
                        ↺
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Rules / Abilities</label>
                  <textarea
                    value={card.abilities}
                    onChange={(e) => handleChange("abilities", e.target.value)}
                    placeholder="Flying, trample&#10;&#10;When this creature enters the battlefield…"
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                <div className="form-group">
                  <label>Flavor Text</label>
                  <textarea
                    value={card.flavor_text}
                    onChange={(e) =>
                      handleChange("flavor_text", e.target.value)
                    }
                    placeholder='"In the end, it was not steel that saved us…"'
                    rows={2}
                    maxLength={1000}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Set / Expansion</label>
                    <input
                      type="text"
                      value={card.set_name}
                      onChange={(e) => handleChange("set_name", e.target.value)}
                      placeholder="Custom Set"
                      maxLength={100}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Art Style</label>
                    <select
                      value={card.art_style}
                      onChange={(e) =>
                        handleChange("art_style", e.target.value)
                      }
                    >
                      {ART_STYLES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!editCard && (
                    <div className="form-group" style={{ width: 90 }}>
                      <label>Quantity</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={card.quantity}
                        onChange={(e) =>
                          handleChange(
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Style Controls */}
            <div className="card-style-section">
              <h3 className="style-section-title">Card Style</h3>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Default Text Color</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={card.text_color || "#000000"}
                      onChange={(e) =>
                        handleChange("text_color", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={card.text_color || "#000000"}
                      onChange={(e) =>
                        handleChange("text_color", e.target.value)
                      }
                      maxLength={7}
                      style={{ width: 80, fontFamily: "monospace" }}
                    />
                  </div>
                </div>
                <div className="form-group flex-1">
                  <label>Border Overlay Image</label>
                  <div className="upload-row">
                    <label className="upload-btn">
                      {card.border_image_url
                        ? "🔄 Replace"
                        : "📁 Upload Border"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBorderUpload}
                        hidden
                      />
                    </label>
                    {card.border_image_url && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleChange("border_image_url", "")}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  {card.border_image_url && (
                    <img
                      src={card.border_image_url}
                      alt="border"
                      className="border-preview-thumb"
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Title / Mana Spacing: {card.title_gap || 0}px</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={card.title_gap || 0}
                  onChange={(e) =>
                    handleChange("title_gap", parseInt(e.target.value))
                  }
                  style={{ width: "100%" }}
                />
              </div>

              <details className="displacement-section" open>
                <summary>Per-Text Styles &amp; Displacement</summary>
                <div className="text-style-grid">
                  {[
                    { label: "Card Name", prefix: "title" },
                    {
                      label: "Mana Cost",
                      prefix: "mana",
                      disableColor: true,
                      disableFont: true,
                    },
                    { label: "Type Bar", prefix: "type" },
                    { label: "Text Box", prefix: "textbox" },
                    { label: "Info Bar", prefix: "info" },
                  ].map(({ label, prefix, disableColor, disableFont }) => (
                    <div key={prefix} className="text-style-row">
                      <span className="displacement-label">{label}</span>
                      <div className="text-style-controls">
                        {!disableColor && (
                          <div className="style-control-group">
                            <label className="style-mini-label">Color</label>
                            <input
                              type="color"
                              value={
                                card[`${prefix}_color`] ||
                                card.text_color ||
                                "#000000"
                              }
                              onChange={(e) =>
                                handleChange(`${prefix}_color`, e.target.value)
                              }
                              title={`${label} color`}
                            />
                            {card[`${prefix}_color`] && (
                              <button
                                type="button"
                                className="pos-reset-btn"
                                onClick={() =>
                                  handleChange(`${prefix}_color`, "")
                                }
                                title="Use default"
                              >
                                ↺
                              </button>
                            )}
                          </div>
                        )}
                        {!disableFont && (
                          <div className="style-control-group">
                            <label className="style-mini-label">Size</label>
                            <input
                              type="range"
                              min={0}
                              max={2}
                              step={0.05}
                              value={card[`${prefix}_font_size`] || 0}
                              onChange={(e) =>
                                handleChange(
                                  `${prefix}_font_size`,
                                  parseFloat(e.target.value),
                                )
                              }
                              title={`${label} font size`}
                            />
                            <span className="displacement-val">
                              {card[`${prefix}_font_size`]
                                ? `${card[`${prefix}_font_size`]}rem`
                                : "auto"}
                            </span>
                            {card[`${prefix}_font_size`] > 0 && (
                              <button
                                type="button"
                                className="pos-reset-btn"
                                onClick={() =>
                                  handleChange(`${prefix}_font_size`, 0)
                                }
                                title="Reset"
                              >
                                ↺
                              </button>
                            )}
                          </div>
                        )}
                        <div className="style-control-group">
                          <label className="style-mini-label">X</label>
                          <input
                            type="range"
                            min={-50}
                            max={50}
                            value={card[`${prefix}_offset_x`] || 0}
                            onChange={(e) =>
                              handleChange(
                                `${prefix}_offset_x`,
                                parseInt(e.target.value),
                              )
                            }
                          />
                          <span className="displacement-val">
                            {card[`${prefix}_offset_x`] || 0}
                          </span>
                        </div>
                        <div className="style-control-group">
                          <label className="style-mini-label">Y</label>
                          <input
                            type="range"
                            min={-50}
                            max={50}
                            value={card[`${prefix}_offset_y`] || 0}
                            onChange={(e) =>
                              handleChange(
                                `${prefix}_offset_y`,
                                parseInt(e.target.value),
                              )
                            }
                          />
                          <span className="displacement-val">
                            {card[`${prefix}_offset_y`] || 0}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="pos-reset-btn"
                          onClick={() => {
                            handleChange(`${prefix}_offset_x`, 0);
                            handleChange(`${prefix}_offset_y`, 0);
                            handleChange(`${prefix}_font_size`, 0);
                            handleChange(`${prefix}_color`, "");
                          }}
                          title="Reset all"
                        >
                          ↺
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !card.name.trim()}
              >
                {saving ? "Saving…" : editCard ? "Update Card" : "Add to Deck"}
              </button>
            </div>
          </form>

          {/* Right side: live preview */}
          <div className="card-editor-preview">
            <h3 className="preview-heading">Live Preview</h3>
            <div ref={previewRef}>
              <CardPreview card={card} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
