import { useState, useRef } from "react";
import { detectColors, calcCMC } from "./ManaSymbol";
import { ManaCost } from "./ManaSymbol";

export default function ScryfallSearch({ deckId, onSave, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [quantities, setQuantities] = useState({});
  const debounceRef = useRef(null);

  const search = async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/scryfall/search?q=${encodeURIComponent(q.trim())}`,
      );
      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      console.error("Scryfall search failed:", err);
      setResults([]);
    }
    setLoading(false);
  };

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleAdd = async (card) => {
    setSaving(card.name);
    try {
      // Parse the type line to extract card_type and subtype
      let card_type = "Creature";
      let subtype = "";
      if (card.card_type) {
        const parts = card.card_type.split("—").map((s) => s.trim());
        const mainType = parts[0] || "";
        subtype = parts[1] || "";

        // Match to known types
        const knownTypes = [
          "Legendary Creature",
          "Creature",
          "Legendary Land",
          "Land",
          "Instant",
          "Sorcery",
          "Enchantment",
          "Artifact",
          "Planeswalker",
          "Tribal",
        ];
        card_type =
          knownTypes.find((t) => mainType.includes(t)) ||
          mainType ||
          "Creature";
      }

      // Map rarity
      const rarityMap = {
        Common: "Common",
        common: "Common",
        Uncommon: "Uncommon",
        uncommon: "Uncommon",
        Rare: "Rare",
        rare: "Rare",
        Mythic: "Mythic Rare",
        mythic: "Mythic Rare",
      };
      const rarity = rarityMap[card.rarity] || "Common";

      // Use the full scryfall card image as the composed image
      const qty = quantities[card.name] || 1;

      const payload = {
        name: card.name,
        image_url:
          card.scryfall_image_png ||
          card.scryfall_image ||
          card.image_url ||
          "",
        card_type,
        subtype,
        mana_cost: card.mana_cost || "",
        cmc: card.cmc || calcCMC(card.mana_cost || ""),
        colors: card.colors || detectColors(card.mana_cost || ""),
        power: card.power || "",
        toughness: card.toughness || "",
        loyalty: card.loyalty || "",
        rarity,
        abilities: card.abilities || "",
        flavor_text: card.flavor_text || "",
        set_name: card.set_name || "",
        art_style: "standard",
        image_pos_x: 50,
        image_pos_y: 50,
        composed_image_url: "",
        quantity: qty,
        border_image_url: "",
        text_color: "#000000",
        is_direct_image: 1,
      };

      const res = await fetch(`/api/decks/${deckId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
      }
    } catch (err) {
      console.error("Failed to add card:", err);
    }
    setSaving(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Existing MTG Card</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="scryfall-search">
          <div className="form-group">
            <label>Search Cards</label>
            <input
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Search by name, type, text… (e.g. Lightning Bolt)"
              autoFocus
            />
          </div>

          {loading && (
            <div className="scryfall-loading">
              <div className="spinner" />
              <span>Searching Scryfall…</span>
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="scryfall-empty">No cards found for "{query}"</div>
          )}

          <div className="scryfall-results">
            {results.map((card, i) => (
              <div key={`${card.name}-${i}`} className="scryfall-card">
                <div className="scryfall-card-image">
                  {card.scryfall_image ? (
                    <img src={card.scryfall_image} alt={card.name} />
                  ) : (
                    <div className="scryfall-no-image">No Image</div>
                  )}
                </div>
                <div className="scryfall-card-info">
                  <div className="scryfall-card-header">
                    <span className="scryfall-card-name">{card.name}</span>
                    <ManaCost cost={card.mana_cost} size={18} />
                  </div>
                  <div className="scryfall-card-type">{card.card_type}</div>
                  {card.abilities && (
                    <p className="scryfall-card-text">{card.abilities}</p>
                  )}
                  {card.power && (
                    <div className="scryfall-card-pt">
                      {card.power}/{card.toughness}
                    </div>
                  )}
                  <div className="scryfall-card-meta">
                    <span
                      className={`rarity-badge rarity-${(card.rarity || "common").toLowerCase().replace(" ", "-")}`}
                    >
                      {card.rarity}
                    </span>
                    <span className="scryfall-set">{card.set_name}</span>
                  </div>
                  <div className="scryfall-card-actions">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        type="button"
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [card.name]: Math.max(
                              1,
                              (prev[card.name] || 1) - 1,
                            ),
                          }))
                        }
                        disabled={(quantities[card.name] || 1) <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">
                        {quantities[card.name] || 1}
                      </span>
                      <button
                        className="qty-btn"
                        type="button"
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [card.name]: (prev[card.name] || 1) + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAdd(card)}
                      disabled={saving === card.name}
                    >
                      {saving === card.name ? "Adding…" : "+ Add to Deck"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
