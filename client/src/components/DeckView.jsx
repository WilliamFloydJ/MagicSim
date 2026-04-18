import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "./CardForm";
import CardPreview from "./CardPreview";
import DeckAnalytics from "./DeckAnalytics";
import ScryfallSearch from "./ScryfallSearch";
import EventBuilder from "./EventBuilder";

const FORMATS = [
  "Casual",
  "Standard",
  "Modern",
  "Legacy",
  "Vintage",
  "Commander",
  "Pioneer",
  "Pauper",
  "Draft",
  "Sealed",
];

export default function DeckView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("cards");
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingDeck, setEditingDeck] = useState(false);
  const [deckForm, setDeckForm] = useState({
    name: "",
    description: "",
    format: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showScryfallSearch, setShowScryfallSearch] = useState(false);
  const [eventBuilderCard, setEventBuilderCard] = useState(null);

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/decks/${id}`);
      if (!res.ok) {
        navigate("/");
        return;
      }
      const data = await res.json();
      setDeck(data);
      setDeckForm({
        name: data.name,
        description: data.description,
        format: data.format,
      });
    } catch {
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeck();
  }, [id]);

  const handleCardSaved = () => {
    setShowCardForm(false);
    setEditingCard(null);
    fetchDeck();
  };

  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/decks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deckForm),
      });
      setEditingDeck(false);
      fetchDeck();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (deckCardId, newQty) => {
    if (newQty < 1) return;
    try {
      await fetch(`/api/deck-cards/${deckCardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      fetchDeck();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveCard = async (deckCardId) => {
    try {
      await fetch(`/api/deck-cards/${deckCardId}`, { method: "DELETE" });
      fetchDeck();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading deck…</p>
      </div>
    );
  }

  if (!deck) return null;

  const totalCards = (deck.cards || []).reduce(
    (s, c) => s + (c.quantity || 1),
    0,
  );

  return (
    <div className="deck-view">
      {/* Deck Header */}
      <div className="deck-header">
        <button className="btn btn-ghost" onClick={() => navigate("/")}>
          ← Back to Decks
        </button>

        {editingDeck ? (
          <form onSubmit={handleUpdateDeck} className="deck-edit-form">
            <input
              type="text"
              value={deckForm.name}
              onChange={(e) =>
                setDeckForm((p) => ({ ...p, name: e.target.value }))
              }
              className="deck-name-input"
              maxLength={200}
            />
            <textarea
              value={deckForm.description}
              onChange={(e) =>
                setDeckForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Description…"
              rows={2}
              maxLength={1000}
            />
            <select
              value={deckForm.format}
              onChange={(e) =>
                setDeckForm((p) => ({ ...p, format: e.target.value }))
              }
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div className="deck-edit-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingDeck(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="deck-info">
            <h1>{deck.name}</h1>
            {deck.description && (
              <p className="deck-desc">{deck.description}</p>
            )}
            <div className="deck-meta">
              <span className="meta-badge">{deck.format}</span>
              <span className="meta-stat">
                {totalCards} cards ({(deck.cards || []).length} unique)
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setEditingDeck(true)}
              >
                ✏ Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="deck-tabs">
        <button
          className={`tab ${tab === "cards" ? "active" : ""}`}
          onClick={() => setTab("cards")}
        >
          🃏 Cards
        </button>
        <button
          className={`tab ${tab === "analytics" ? "active" : ""}`}
          onClick={() => setTab("analytics")}
        >
          📊 Analytics
        </button>
        {tab === "cards" && (
          <div className="tab-actions">
            <div className="view-toggles">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                ▦
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                ☰
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingCard(null);
                setShowCardForm(true);
              }}
            >
              + Create Card
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowScryfallSearch(true)}
            >
              🔍 Add Existing Card
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "cards" && (
        <div className="deck-cards-section">
          {!deck.cards || deck.cards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🃏</div>
              <h2>No cards in this deck</h2>
              <p>Add your first card to start building!</p>
              <div className="empty-state-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowCardForm(true)}
                >
                  + Create Custom Card
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => setShowScryfallSearch(true)}
                >
                  🔍 Add Existing Card
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="cards-grid">
              {deck.cards.map((card) => (
                <div key={card.deck_card_id} className="card-grid-item">
                  <CardPreview card={card} />
                  <div className="card-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            card.deck_card_id,
                            card.quantity - 1,
                          )
                        }
                        disabled={card.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">×{card.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            card.deck_card_id,
                            card.quantity + 1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="card-actions">
                      <button
                        className="action-btn"
                        title="Edit"
                        onClick={() => {
                          setEditingCard(card);
                          setShowCardForm(true);
                        }}
                      >
                        ✏
                      </button>
                      <button
                        className="action-btn action-btn-events"
                        title="Events"
                        onClick={() => setEventBuilderCard(card)}
                      >
                        ⚡
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        title="Remove"
                        onClick={() => handleRemoveCard(card.deck_card_id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cards-list">
              <div className="list-header">
                <span className="list-col list-col-name">Name</span>
                <span className="list-col list-col-type">Type</span>
                <span className="list-col list-col-mana">Mana</span>
                <span className="list-col list-col-rarity">Rarity</span>
                <span className="list-col list-col-qty">Qty</span>
                <span className="list-col list-col-actions">Actions</span>
              </div>
              {deck.cards.map((card) => (
                <div key={card.deck_card_id} className="list-row">
                  <span className="list-col list-col-name">{card.name}</span>
                  <span className="list-col list-col-type">
                    {card.card_type}
                  </span>
                  <span className="list-col list-col-mana">
                    {card.mana_cost || "—"}
                  </span>
                  <span className="list-col list-col-rarity">
                    <span
                      className={`rarity-badge rarity-${(card.rarity || "common").toLowerCase().replace(" ", "-")}`}
                    >
                      {card.rarity}
                    </span>
                  </span>
                  <span className="list-col list-col-qty">
                    <div className="qty-control qty-control-sm">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            card.deck_card_id,
                            card.quantity - 1,
                          )
                        }
                        disabled={card.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{card.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            card.deck_card_id,
                            card.quantity + 1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </span>
                  <span className="list-col list-col-actions">
                    <button
                      className="action-btn"
                      onClick={() => {
                        setEditingCard(card);
                        setShowCardForm(true);
                      }}
                    >
                      ✏
                    </button>
                    <button
                      className="action-btn action-btn-events"
                      title="Events"
                      onClick={() => setEventBuilderCard(card)}
                    >
                      ⚡
                    </button>
                    <button
                      className="action-btn action-btn-danger"
                      onClick={() => handleRemoveCard(card.deck_card_id)}
                    >
                      ✕
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "analytics" && <DeckAnalytics cards={deck.cards} />}

      {/* Card Form Modal */}
      {showCardForm && (
        <CardForm
          deckId={id}
          editCard={editingCard}
          onSave={handleCardSaved}
          onClose={() => {
            setShowCardForm(false);
            setEditingCard(null);
          }}
        />
      )}

      {/* Scryfall Search Modal */}
      {showScryfallSearch && (
        <ScryfallSearch
          deckId={id}
          onSave={() => {
            fetchDeck();
          }}
          onClose={() => setShowScryfallSearch(false)}
        />
      )}

      {/* Event Builder Modal */}
      {eventBuilderCard && (
        <EventBuilderModal
          card={eventBuilderCard}
          onClose={() => setEventBuilderCard(null)}
          onSaved={() => {
            setEventBuilderCard(null);
            fetchDeck();
          }}
        />
      )}
    </div>
  );
}

function EventBuilderModal({ card, onClose, onSaved }) {
  const [events, setEvents] = useState(() => {
    let parsed = card.events;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        parsed = [];
      }
    }
    return parsed || [];
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/cards/${card.id}/events`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      onSaved();
    } catch (err) {
      console.error("Failed to save events:", err);
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--wide event-builder-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>⚡ Events — {card.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="event-builder-modal-body">
          <EventBuilder events={events} onChange={setEvents} />
        </div>
        <div className="event-builder-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Events"}
          </button>
        </div>
      </div>
    </div>
  );
}
