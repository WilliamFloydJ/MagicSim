const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool, initDb } = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- File upload setup ---
const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, "uploads");
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

app.get("/api/decks", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*,
        COUNT(dc.id)::int AS card_count,
        COALESCE(SUM(dc.quantity), 0)::int AS total_cards
      FROM decks d
      LEFT JOIN deck_cards dc ON d.id = dc.deck_id
      GROUP BY d.id
      ORDER BY d.updated_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/decks", async (req, res) => {
  try {
    const { name, description, format } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Deck name is required" });
    }
    const result = await pool.query(
      "INSERT INTO decks (name, description, format) VALUES ($1, $2, $3) RETURNING *",
      [name.trim(), description || "", format || "Casual"],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/decks/:id", async (req, res) => {
  try {
    const deckResult = await pool.query("SELECT * FROM decks WHERE id = $1", [
      req.params.id,
    ]);
    if (!deckResult.rows[0]) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const cardsResult = await pool.query(
      `SELECT c.*, dc.quantity, dc.id AS deck_card_id
       FROM cards c
       JOIN deck_cards dc ON c.id = dc.card_id
       WHERE dc.deck_id = $1
       ORDER BY c.cmc ASC, c.name ASC`,
      [req.params.id],
    );

    res.json({ ...deckResult.rows[0], cards: cardsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/decks/:id", async (req, res) => {
  try {
    const { name, description, format } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Deck name is required" });
    }
    const result = await pool.query(
      "UPDATE decks SET name=$1, description=$2, format=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
      [name.trim(), description || "", format || "Casual", req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/decks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM decks WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== CARD ROUTES =====================

app.post("/api/decks/:id/cards", async (req, res) => {
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

    const cardResult = await pool.query(
      `INSERT INTO cards (
        name, image_url, card_type, subtype, mana_cost, cmc, colors,
        power, toughness, loyalty, rarity, abilities, flavor_text, set_name, art_style,
        image_pos_x, image_pos_y, composed_image_url,
        border_image_url, text_color,
        title_offset_x, title_offset_y, type_offset_x, type_offset_y,
        textbox_offset_x, textbox_offset_y, info_offset_x, info_offset_y,
        title_color, type_color, textbox_color, info_color,
        title_font_size, type_font_size, textbox_font_size, info_font_size,
        title_gap, mana_offset_x, mana_offset_y, is_direct_image, events
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,
        $35,$36,$37,$38,$39,$40,$41
      ) RETURNING *`,
      [
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
      ],
    );

    const card = cardResult.rows[0];

    const dcResult = await pool.query(
      "INSERT INTO deck_cards (deck_id, card_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, card.id, quantity || 1],
    );

    await pool.query("UPDATE decks SET updated_at = NOW() WHERE id = $1", [
      req.params.id,
    ]);

    res.status(201).json({
      ...card,
      quantity: quantity || 1,
      deck_card_id: dcResult.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/cards/:id", async (req, res) => {
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

    const result = await pool.query(
      `UPDATE cards SET
        name=$1, image_url=$2, card_type=$3, subtype=$4, mana_cost=$5,
        cmc=$6, colors=$7, power=$8, toughness=$9, loyalty=$10, rarity=$11,
        abilities=$12, flavor_text=$13, set_name=$14, art_style=$15,
        image_pos_x=$16, image_pos_y=$17, composed_image_url=$18,
        border_image_url=$19, text_color=$20,
        title_offset_x=$21, title_offset_y=$22, type_offset_x=$23, type_offset_y=$24,
        textbox_offset_x=$25, textbox_offset_y=$26, info_offset_x=$27, info_offset_y=$28,
        title_color=$29, type_color=$30, textbox_color=$31, info_color=$32,
        title_font_size=$33, type_font_size=$34, textbox_font_size=$35, info_font_size=$36,
        title_gap=$37, mana_offset_x=$38, mana_offset_y=$39, is_direct_image=$40, events=$41
      WHERE id = $42
      RETURNING *`,
      [
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
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update only events for a card
app.put("/api/cards/:id/events", async (req, res) => {
  try {
    const { events } = req.body;
    const result = await pool.query(
      "UPDATE cards SET events = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(events || []), req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/deck-cards/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    await pool.query("UPDATE deck_cards SET quantity = $1 WHERE id = $2", [
      quantity,
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/deck-cards/:id", async (req, res) => {
  try {
    const dcResult = await pool.query(
      "SELECT deck_id FROM deck_cards WHERE id = $1",
      [req.params.id],
    );
    await pool.query("DELETE FROM deck_cards WHERE id = $1", [req.params.id]);
    if (dcResult.rows[0]) {
      await pool.query("UPDATE decks SET updated_at = NOW() WHERE id = $1", [
        dcResult.rows[0].deck_id,
      ]);
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

app.get("/api/decks/:id/colors", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.colors, dc.quantity
       FROM cards c JOIN deck_cards dc ON c.id = dc.card_id
       WHERE dc.deck_id = $1`,
      [req.params.id],
    );

    const colorCount = { W: 0, U: 0, B: 0, R: 0, G: 0 };
    result.rows.forEach((c) => {
      const cols = JSON.parse(c.colors || "[]");
      cols.forEach((col) => {
        if (colorCount[col] !== undefined)
          colorCount[col] += parseInt(c.quantity, 10);
      });
    });
    res.json(colorCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== MANA SYMBOL IMAGES =====================

app.get("/api/mana-images", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT symbol, image_url FROM mana_images",
    );
    const map = {};
    result.rows.forEach((r) => {
      map[r.symbol] = r.image_url;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/mana-images/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }
    await pool.query(
      "INSERT INTO mana_images (symbol, image_url) VALUES ($1, $2) ON CONFLICT(symbol) DO UPDATE SET image_url = EXCLUDED.image_url",
      [symbol, image_url],
    );
    res.json({ symbol, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/mana-images/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    await pool.query("DELETE FROM mana_images WHERE symbol = $1", [symbol]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== CARD CUSTOMIZATION =====================

app.get("/api/card-customization", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT key, value FROM card_customization",
    );
    const map = {};
    result.rows.forEach((r) => {
      map[r.key] = r.value;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/card-customization/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const { value } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ error: "value is required" });
    }
    await pool.query(
      "INSERT INTO card_customization (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value",
      [key, value],
    );
    res.json({ key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/card-customization/:key", async (req, res) => {
  try {
    await pool.query("DELETE FROM card_customization WHERE key = $1", [
      req.params.key,
    ]);
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

// Always return JSON for unknown API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// --- Catch-all: serve React app for any non-API route ---
if (fs.existsSync(clientBuildPath)) {
  app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MTG Creator API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
