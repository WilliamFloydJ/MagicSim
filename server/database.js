const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS decks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      format TEXT DEFAULT 'Casual',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cards (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image_url TEXT DEFAULT '',
      card_type TEXT NOT NULL DEFAULT 'Creature',
      subtype TEXT DEFAULT '',
      mana_cost TEXT DEFAULT '',
      cmc INTEGER DEFAULT 0,
      colors TEXT DEFAULT '[]',
      power TEXT DEFAULT '',
      toughness TEXT DEFAULT '',
      loyalty TEXT DEFAULT '',
      rarity TEXT DEFAULT 'Common',
      abilities TEXT DEFAULT '',
      flavor_text TEXT DEFAULT '',
      set_name TEXT DEFAULT '',
      art_style TEXT DEFAULT 'standard',
      image_pos_x INTEGER DEFAULT 50,
      image_pos_y INTEGER DEFAULT 50,
      composed_image_url TEXT DEFAULT '',
      border_image_url TEXT DEFAULT '',
      text_color TEXT DEFAULT '#000000',
      title_offset_x INTEGER DEFAULT 0,
      title_offset_y INTEGER DEFAULT 0,
      type_offset_x INTEGER DEFAULT 0,
      type_offset_y INTEGER DEFAULT 0,
      textbox_offset_x INTEGER DEFAULT 0,
      textbox_offset_y INTEGER DEFAULT 0,
      info_offset_x INTEGER DEFAULT 0,
      info_offset_y INTEGER DEFAULT 0,
      title_color TEXT DEFAULT '',
      type_color TEXT DEFAULT '',
      textbox_color TEXT DEFAULT '',
      info_color TEXT DEFAULT '',
      title_font_size REAL DEFAULT 0,
      type_font_size REAL DEFAULT 0,
      textbox_font_size REAL DEFAULT 0,
      info_font_size REAL DEFAULT 0,
      title_gap INTEGER DEFAULT 0,
      mana_offset_x INTEGER DEFAULT 0,
      mana_offset_y INTEGER DEFAULT 0,
      is_direct_image INTEGER DEFAULT 0,
      events TEXT DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deck_cards (
      id SERIAL PRIMARY KEY,
      deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
      card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      quantity INTEGER DEFAULT 1,
      UNIQUE(deck_id, card_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mana_images (
      symbol TEXT PRIMARY KEY,
      image_url TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS card_customization (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  console.log("[database] PostgreSQL tables ready");
}

module.exports = { pool, initDb };
