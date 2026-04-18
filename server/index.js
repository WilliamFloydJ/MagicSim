const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- File upload setup ---
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const imageAllowed = /jpeg|jpg|png|gif|webp/;
    const fontAllowed = /ttf|otf|woff|woff2/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const isImage = imageAllowed.test(ext) && imageAllowed.test(file.mimetype);
    const isFont =
      fontAllowed.test(ext) ||
      file.mimetype.includes("font") ||
      file.mimetype === "application/octet-stream";
    if (isImage || isFont) {
      cb(null, true);
    } else {
      cb(new Error("Only image and font files are allowed"), false);
    }
  },
});

app.use("/uploads", express.static(uploadsDir));

// --- Serve React frontend in production ---
const clientBuildPath = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

// ===================== DECK ROUTES =====================

app.get("/api/decks", (_req, res) => {
  try {
    const decks = db
      .prepare(
        `
      SELECT d.*,
        COUNT(dc.id) as card_count,
        COALESCE(SUM(dc.quantity), 0) as total_cards
      FROM decks d
      LEFT JOIN deck_cards dc ON d.id = dc.deck_id
      GROUP BY d.id
      ORDER BY d.updated_at DESC
    `,
      )
      .all();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/decks", (req, res) => {
  try {
    const { name, description, format } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Deck name is required" });
    }
    const result = db
      .prepare("INSERT INTO decks (name, description, format) VALUES (?, ?, ?)")
      .run(name.trim(), description || "", format || "Casual");
    const deck = db
      .prepare("SELECT * FROM decks WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/decks/:id", (req, res) => {
  try {
    const deck = db
      .prepare("SELECT * FROM decks WHERE id = ?")
      .get(req.params.id);
    if (!deck) return res.status(404).json({ error: "Deck not found" });

    const cards = db
      .prepare(
        `
      SELECT c.*, dc.quantity, dc.id as deck_card_id
      FROM cards c
      JOIN deck_cards dc ON c.id = dc.card_id
      WHERE dc.deck_id = ?
      ORDER BY c.cmc ASC, c.name ASC
    `,
      )
      .all(req.params.id);

    res.json({ ...deck, cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/decks/:id", (req, res) => {
  try {
    const { name, description, format } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Deck name is required" });
    }
    db.prepare(
      `
      UPDATE decks SET name = ?, description = ?, format = ?, updated_at = datetime('now')
      WHERE id = ?
    `,
    ).run(name.trim(), description || "", format || "Casual", req.params.id);
    const deck = db
      .prepare("SELECT * FROM decks WHERE id = ?")
      .get(req.params.id);
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/decks/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM decks WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== CARD ROUTES =====================

app.post("/api/decks/:id/cards", (req, res) => {
  try {
    const {
      name,
      image_url,
      card_type,
      subtype,
      mana_cost,
      cmc,
      colors,
      power,
      toughness,
      loyalty,
      rarity,
      abilities,
      flavor_text,
      set_name,
      art_style,
      image_pos_x,
      image_pos_y,
      composed_image_url,
      quantity,
      border_image_url,
      text_color,
      title_offset_x,
      title_offset_y,
      type_offset_x,
      type_offset_y,
      textbox_offset_x,
      textbox_offset_y,
      info_offset_x,
      info_offset_y,
      title_color,
      type_color,
      textbox_color,
      info_color,
      title_font_size,
      type_font_size,
      textbox_font_size,
      info_font_size,
      title_gap,
      mana_offset_x,
      mana_offset_y,
      is_direct_image,
      events,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Card name is required" });
    }

    const cardResult = db
      .prepare(
        `
      INSERT INTO cards (name, image_url, card_type, subtype, mana_cost, cmc, colors,
        power, toughness, loyalty, rarity, abilities, flavor_text, set_name, art_style,
        image_pos_x, image_pos_y, composed_image_url,
        border_image_url, text_color,
        title_offset_x, title_offset_y, type_offset_x, type_offset_y,
        textbox_offset_x, textbox_offset_y, info_offset_x, info_offset_y,
        title_color, type_color, textbox_color, info_color,
        title_font_size, type_font_size, textbox_font_size, info_font_size,
        title_gap, mana_offset_x, mana_offset_y, is_direct_image, events)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        name.trim(),
        image_url || "",
        card_type || "Creature",
        subtype || "",
        mana_cost || "",
        cmc || 0,
        JSON.stringify(colors || []),
        power || "",
        toughness || "",
        loyalty || "",
        rarity || "Common",
        abilities || "",
        flavor_text || "",
        set_name || "",
        art_style || "standard",
        image_pos_x ?? 50,
        image_pos_y ?? 50,
        composed_image_url || "",
        border_image_url || "",
        text_color || "#000000",
        title_offset_x ?? 0,
        title_offset_y ?? 0,
        type_offset_x ?? 0,
        type_offset_y ?? 0,
        textbox_offset_x ?? 0,
        textbox_offset_y ?? 0,
        info_offset_x ?? 0,
        info_offset_y ?? 0,
        title_color || "",
        type_color || "",
        textbox_color || "",
        info_color || "",
        title_font_size ?? 0,
        type_font_size ?? 0,
        textbox_font_size ?? 0,
        info_font_size ?? 0,
        title_gap ?? 0,
        mana_offset_x ?? 0,
        mana_offset_y ?? 0,
        is_direct_image ? 1 : 0,
        JSON.stringify(events || []),
      );

    const dcResult = db
      .prepare(
        "INSERT INTO deck_cards (deck_id, card_id, quantity) VALUES (?, ?, ?)",
      )
      .run(req.params.id, cardResult.lastInsertRowid, quantity || 1);

    db.prepare(
      "UPDATE decks SET updated_at = datetime('now') WHERE id = ?",
    ).run(req.params.id);

    const card = db
      .prepare("SELECT * FROM cards WHERE id = ?")
      .get(cardResult.lastInsertRowid);
    res.status(201).json({
      ...card,
      quantity: quantity || 1,
      deck_card_id: dcResult.lastInsertRowid,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/cards/:id", (req, res) => {
  try {
    const {
      name,
      image_url,
      card_type,
      subtype,
      mana_cost,
      cmc,
      colors,
      power,
      toughness,
      loyalty,
      rarity,
      abilities,
      flavor_text,
      set_name,
      art_style,
      image_pos_x,
      image_pos_y,
      composed_image_url,
      border_image_url,
      text_color,
      title_offset_x,
      title_offset_y,
      type_offset_x,
      type_offset_y,
      textbox_offset_x,
      textbox_offset_y,
      info_offset_x,
      info_offset_y,
      title_color,
      type_color,
      textbox_color,
      info_color,
      title_font_size,
      type_font_size,
      textbox_font_size,
      info_font_size,
      title_gap,
      mana_offset_x,
      mana_offset_y,
      is_direct_image,
      events,
    } = req.body;

    db.prepare(
      `
      UPDATE cards SET name=?, image_url=?, card_type=?, subtype=?, mana_cost=?,
        cmc=?, colors=?, power=?, toughness=?, loyalty=?, rarity=?, abilities=?,
        flavor_text=?, set_name=?, art_style=?, image_pos_x=?, image_pos_y=?,
        composed_image_url=?,
        border_image_url=?, text_color=?,
        title_offset_x=?, title_offset_y=?, type_offset_x=?, type_offset_y=?,
        textbox_offset_x=?, textbox_offset_y=?, info_offset_x=?, info_offset_y=?,
        title_color=?, type_color=?, textbox_color=?, info_color=?,
        title_font_size=?, type_font_size=?, textbox_font_size=?, info_font_size=?,
        title_gap=?, mana_offset_x=?, mana_offset_y=?, is_direct_image=?, events=?
      WHERE id = ?
    `,
    ).run(
      name,
      image_url || "",
      card_type,
      subtype || "",
      mana_cost || "",
      cmc || 0,
      JSON.stringify(colors || []),
      power || "",
      toughness || "",
      loyalty || "",
      rarity || "Common",
      abilities || "",
      flavor_text || "",
      set_name || "",
      art_style || "standard",
      image_pos_x ?? 50,
      image_pos_y ?? 50,
      composed_image_url || "",
      border_image_url || "",
      text_color || "#000000",
      title_offset_x ?? 0,
      title_offset_y ?? 0,
      type_offset_x ?? 0,
      type_offset_y ?? 0,
      textbox_offset_x ?? 0,
      textbox_offset_y ?? 0,
      info_offset_x ?? 0,
      info_offset_y ?? 0,
      title_color || "",
      type_color || "",
      textbox_color || "",
      info_color || "",
      title_font_size ?? 0,
      type_font_size ?? 0,
      textbox_font_size ?? 0,
      info_font_size ?? 0,
      title_gap ?? 0,
      mana_offset_x ?? 0,
      mana_offset_y ?? 0,
      is_direct_image ? 1 : 0,
      JSON.stringify(events || []),
      req.params.id,
    );
    const card = db
      .prepare("SELECT * FROM cards WHERE id = ?")
      .get(req.params.id);
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update only events for a card
app.put("/api/cards/:id/events", (req, res) => {
  try {
    const { events } = req.body;
    db.prepare("UPDATE cards SET events = ? WHERE id = ?").run(
      JSON.stringify(events || []),
      req.params.id,
    );
    const card = db
      .prepare("SELECT * FROM cards WHERE id = ?")
      .get(req.params.id);
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/deck-cards/:id", (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    db.prepare("UPDATE deck_cards SET quantity = ? WHERE id = ?").run(
      quantity,
      req.params.id,
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/deck-cards/:id", (req, res) => {
  try {
    const dc = db
      .prepare("SELECT deck_id FROM deck_cards WHERE id = ?")
      .get(req.params.id);
    db.prepare("DELETE FROM deck_cards WHERE id = ?").run(req.params.id);
    if (dc) {
      db.prepare(
        "UPDATE decks SET updated_at = datetime('now') WHERE id = ?",
      ).run(dc.deck_id);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== IMAGE UPLOAD =====================

app.post("/api/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

// ===================== DECK COLOR SUMMARY =====================

app.get("/api/decks/:id/colors", (req, res) => {
  try {
    const cards = db
      .prepare(
        `
      SELECT c.colors, dc.quantity
      FROM cards c JOIN deck_cards dc ON c.id = dc.card_id
      WHERE dc.deck_id = ?
    `,
      )
      .all(req.params.id);

    const colorCount = { W: 0, U: 0, B: 0, R: 0, G: 0 };
    cards.forEach((c) => {
      const cols = JSON.parse(c.colors || "[]");
      cols.forEach((col) => {
        if (colorCount[col] !== undefined) colorCount[col] += c.quantity;
      });
    });
    res.json(colorCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== MANA SYMBOL IMAGES =====================

app.get("/api/mana-images", (_req, res) => {
  try {
    const rows = db.prepare("SELECT symbol, image_url FROM mana_images").all();
    const map = {};
    rows.forEach((r) => {
      map[r.symbol] = r.image_url;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/mana-images/:symbol", (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }
    db.prepare(
      "INSERT INTO mana_images (symbol, image_url) VALUES (?, ?) ON CONFLICT(symbol) DO UPDATE SET image_url = ?",
    ).run(symbol, image_url, image_url);
    res.json({ symbol, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/mana-images/:symbol", (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    db.prepare("DELETE FROM mana_images WHERE symbol = ?").run(symbol);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== CARD CUSTOMIZATION =====================

app.get("/api/card-customization", (_req, res) => {
  try {
    const rows = db.prepare("SELECT key, value FROM card_customization").all();
    const map = {};
    rows.forEach((r) => {
      map[r.key] = r.value;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/card-customization/:key", (req, res) => {
  try {
    const key = req.params.key;
    const { value } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ error: "value is required" });
    }
    db.prepare(
      "INSERT INTO card_customization (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
    ).run(key, value, value);
    res.json({ key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/card-customization/:key", (req, res) => {
  try {
    db.prepare("DELETE FROM card_customization WHERE key = ?").run(
      req.params.key,
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== SCRYFALL PROXY =====================

app.get("/api/scryfall/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q.trim())}&order=name&unique=cards`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.object === "error") {
      return res.json({ data: [] });
    }
    const cards = (data.data || []).slice(0, 20).map((c) => ({
      name: c.name,
      mana_cost: (c.mana_cost || "").replace(/[{}]/g, ""),
      cmc: c.cmc || 0,
      card_type: c.type_line || "",
      colors: c.colors || [],
      power: c.power || "",
      toughness: c.toughness || "",
      loyalty: c.loyalty || "",
      rarity:
        (c.rarity || "common").charAt(0).toUpperCase() +
        (c.rarity || "common").slice(1),
      abilities: c.oracle_text || "",
      flavor_text: c.flavor_text || "",
      set_name: (c.set || "").toUpperCase(),
      image_url: c.image_uris?.art_crop || c.image_uris?.normal || "",
      scryfall_image: c.image_uris?.normal || c.image_uris?.large || "",
      scryfall_image_png: c.image_uris?.png || "",
    }));
    res.json({ data: cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Catch-all: serve React app for any non-API route ---
if (fs.existsSync(clientBuildPath)) {
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`MTG Creator API running on http://localhost:${PORT}`);
});
