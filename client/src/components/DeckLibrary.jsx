import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function DeckLibrary() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newDeck, setNewDeck] = useState({
    name: "",
    description: "",
    format: "Casual",
  });
  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      const res = await fetch("/api/decks");
      const data = await res.json();
      setDecks(data);
    } catch (err) {
      console.error("Failed to fetch decks:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDeck.name.trim()) return;
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeck),
      });
      if (res.ok) {
        const deck = await res.json();
        navigate(`/deck/${deck.id}`);
      }
    } catch (err) {
      console.error("Failed to create deck:", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this deck and all its cards?")) return;
    try {
      await fetch(`/api/decks/${id}`, { method: "DELETE" });
      setDecks((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading your decks…</p>
      </div>
    );
  }

  return (
    <div className="deck-library">
      <div className="library-header">
        <div>
          <h1>Your Deck Collection</h1>
          <p className="subtitle">Build, analyze, and manage your MTG decks</p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setShowCreate(true)}
        >
          + New Deck
        </button>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Deck</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreate(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="card-form">
              <div className="form-group">
                <label>Deck Name *</label>
                <input
                  type="text"
                  value={newDeck.name}
                  onChange={(e) =>
                    setNewDeck((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="My Awesome Deck"
                  required
                  autoFocus
                  maxLength={200}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newDeck.description}
                  onChange={(e) =>
                    setNewDeck((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="A brief description of this deck's strategy…"
                  rows={3}
                  maxLength={1000}
                />
              </div>
              <div className="form-group">
                <label>Format</label>
                <select
                  value={newDeck.format}
                  onChange={(e) =>
                    setNewDeck((p) => ({ ...p, format: e.target.value }))
                  }
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🃏</div>
          <h2>No decks yet</h2>
          <p>Create your first deck to start building!</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowCreate(true)}
          >
            + Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="deck-card"
              onClick={() => navigate(`/deck/${deck.id}`)}
            >
              <div className="deck-card-art">
                <div className="deck-card-pattern">
                  <span className="deck-icon">⚔</span>
                </div>
              </div>
              <div className="deck-card-body">
                <h3 className="deck-card-title">{deck.name}</h3>
                {deck.description && (
                  <p className="deck-card-desc">{deck.description}</p>
                )}
                <div className="deck-card-meta">
                  <span className="meta-badge">{deck.format}</span>
                  <span className="meta-stat">{deck.total_cards} cards</span>
                </div>
              </div>
              <button
                className="deck-delete-btn"
                onClick={(e) => handleDelete(deck.id, e)}
                title="Delete deck"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
