import { useState, useMemo } from "react";
import {
  TRIGGER_EVENTS,
  CONDITIONS,
  ALL_ACTIONS,
  getCategories,
} from "./mtgEventData";

// ─── Scratch-style block colors ───
const BLOCK_COLORS = {
  trigger: "#c97e13",
  condition: "#5b80a5",
  action: "#4c7a34",
};

const BLOCK_LABELS = {
  trigger: "When",
  condition: "If",
  action: "Then",
};

// A single block pill that lives in the assembled event
function BlockPill({ block, onRemove }) {
  const bg = BLOCK_COLORS[block.blockType] || "#666";
  return (
    <span className="event-block-pill" style={{ background: bg }}>
      <span className="event-block-pill-label">
        {BLOCK_LABELS[block.blockType]}
      </span>
      <span className="event-block-pill-text">{block.label}</span>
      <button
        type="button"
        className="event-block-pill-remove"
        onClick={onRemove}
        title="Remove"
      >
        ×
      </button>
    </span>
  );
}

// Palette panel showing available items grouped by category
function PalettePanel({ title, items, color, onAdd, search }) {
  const [filter, setFilter] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);

  const filtered = useMemo(() => {
    const q = (filter || search || "").toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
    );
  }, [items, filter, search]);

  const categories = useMemo(() => getCategories(filtered), [filtered]);

  const grouped = useMemo(() => {
    const map = {};
    for (const item of filtered) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [filtered]);

  return (
    <div className="event-palette-panel">
      <div className="event-palette-header" style={{ background: color }}>
        {title}
      </div>
      <input
        className="event-palette-search"
        type="text"
        placeholder="Search…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="event-palette-list">
        {categories.map((cat) => (
          <div key={cat} className="event-palette-category">
            <button
              type="button"
              className={`event-palette-cat-header ${expandedCat === cat ? "expanded" : ""}`}
              onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
            >
              <span className="event-cat-arrow">
                {expandedCat === cat ? "▾" : "▸"}
              </span>
              {cat}
              <span className="event-cat-count">{grouped[cat].length}</span>
            </button>
            {expandedCat === cat && (
              <div className="event-palette-items">
                {grouped[cat].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="event-palette-item"
                    style={{ borderLeftColor: color }}
                    onClick={() => onAdd(item)}
                    title={item.label}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="event-palette-empty">No matches</div>
        )}
      </div>
    </div>
  );
}

// ─── Assembled event row ───
function EventRow({
  event,
  index,
  onRemoveBlock,
  onRemoveEvent,
  onMoveUp,
  onMoveDown,
  totalEvents,
}) {
  return (
    <div className="event-row">
      <div className="event-row-header">
        <span className="event-row-number">#{index + 1}</span>
        <div className="event-row-controls">
          <button
            type="button"
            className="event-row-btn"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            className="event-row-btn"
            onClick={onMoveDown}
            disabled={index === totalEvents - 1}
            title="Move down"
          >
            ▼
          </button>
          <button
            type="button"
            className="event-row-btn event-row-btn-delete"
            onClick={onRemoveEvent}
            title="Delete event"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="event-row-blocks">
        {event.blocks.map((block, bi) => (
          <BlockPill
            key={bi}
            block={block}
            onRemove={() => onRemoveBlock(bi)}
          />
        ))}
        {event.blocks.length === 0 && (
          <span className="event-row-placeholder">
            Drag items from the palette →
          </span>
        )}
      </div>
      <div className="event-row-preview">
        {event.blocks.map((b) => b.label).join(", ")}
      </div>
    </div>
  );
}

// ─── Main EventBuilder ───
export default function EventBuilder({ events, onChange }) {
  const [activeTab, setActiveTab] = useState("trigger");
  const [activeEventIdx, setActiveEventIdx] = useState(0);
  const [globalSearch, setGlobalSearch] = useState("");

  // Ensure at least one event exists
  const safeEvents = events && events.length > 0 ? events : [{ blocks: [] }];

  const addBlock = (item, blockType) => {
    const updated = [...safeEvents];
    const idx = Math.min(activeEventIdx, updated.length - 1);
    updated[idx] = {
      ...updated[idx],
      blocks: [...updated[idx].blocks, { ...item, blockType }],
    };
    onChange(updated);
  };

  const removeBlock = (eventIdx, blockIdx) => {
    const updated = [...safeEvents];
    updated[eventIdx] = {
      ...updated[eventIdx],
      blocks: updated[eventIdx].blocks.filter((_, i) => i !== blockIdx),
    };
    onChange(updated);
  };

  const addEvent = () => {
    const updated = [...safeEvents, { blocks: [] }];
    onChange(updated);
    setActiveEventIdx(updated.length - 1);
  };

  const removeEvent = (idx) => {
    if (safeEvents.length <= 1) {
      onChange([{ blocks: [] }]);
      setActiveEventIdx(0);
      return;
    }
    const updated = safeEvents.filter((_, i) => i !== idx);
    onChange(updated);
    if (activeEventIdx >= updated.length) {
      setActiveEventIdx(updated.length - 1);
    }
  };

  const moveEvent = (idx, dir) => {
    const updated = [...safeEvents];
    const target = idx + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    onChange(updated);
    setActiveEventIdx(target);
  };

  const tabs = [
    { key: "trigger", label: "Events", color: BLOCK_COLORS.trigger },
    { key: "condition", label: "Conditions", color: BLOCK_COLORS.condition },
    { key: "action", label: "Actions", color: BLOCK_COLORS.action },
  ];

  const paletteData = {
    trigger: TRIGGER_EVENTS,
    condition: CONDITIONS,
    action: ALL_ACTIONS,
  };

  const paletteLabels = {
    trigger: "Trigger Events",
    condition: "Conditions",
    action: "Actions (Keyword + Non-keyword + Abilities)",
  };

  return (
    <div className="event-builder">
      <div className="event-builder-top">
        <h4 className="event-builder-title">Event Builder</h4>
        <button
          type="button"
          className="btn btn-sm event-add-btn"
          onClick={addEvent}
        >
          + New Event
        </button>
      </div>

      <div className="event-builder-body">
        {/* Left: assembled events */}
        <div className="event-assembly">
          <div className="event-assembly-header">
            <span>Assembled Events</span>
            <input
              className="event-global-search"
              type="text"
              placeholder="Quick search all…"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
          <div className="event-assembly-list">
            {safeEvents.map((evt, i) => (
              <div
                key={i}
                className={`event-assembly-item ${i === activeEventIdx ? "active" : ""}`}
                onClick={() => setActiveEventIdx(i)}
              >
                <EventRow
                  event={evt}
                  index={i}
                  totalEvents={safeEvents.length}
                  onRemoveBlock={(bi) => removeBlock(i, bi)}
                  onRemoveEvent={() => removeEvent(i)}
                  onMoveUp={() => moveEvent(i, -1)}
                  onMoveDown={() => moveEvent(i, 1)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: palette */}
        <div className="event-palette">
          <div className="event-palette-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`event-palette-tab ${activeTab === t.key ? "active" : ""}`}
                style={{
                  borderBottomColor:
                    activeTab === t.key ? t.color : "transparent",
                  color: activeTab === t.key ? t.color : undefined,
                }}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <PalettePanel
            title={paletteLabels[activeTab]}
            items={paletteData[activeTab]}
            color={tabs.find((t) => t.key === activeTab).color}
            onAdd={(item) => addBlock(item, activeTab)}
            search={globalSearch}
          />
        </div>
      </div>

      {/* Text preview of all events */}
      <div className="event-text-preview">
        <label className="event-preview-label">Generated Text</label>
        <div className="event-preview-text">
          {safeEvents
            .filter((e) => e.blocks.length > 0)
            .map((e, i) => (
              <div key={i} className="event-preview-line">
                {e.blocks.map((b) => b.label).join(", ")}
              </div>
            ))}
          {safeEvents.every((e) => e.blocks.length === 0) && (
            <span className="event-preview-empty">
              Add trigger events, conditions, and actions to build abilities
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
