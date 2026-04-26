const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const defaultDbPath = path.join(__dirname, "mtg_decks.db");
const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : defaultDbPath;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

console.log(`[database] SQLite path: ${dbPath}`);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    format TEXT DEFAULT 'Casual',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS deck_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    UNIQUE(deck_id, card_id)
  );

  CREATE TABLE IF NOT EXISTS mana_images (
    symbol TEXT PRIMARY KEY,
    image_url TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS card_customization (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Add art_style column if it doesn't exist (migration for existing DBs)
try {
  db.prepare("SELECT art_style FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN art_style TEXT DEFAULT 'standard'");
}

try {
  db.prepare("SELECT image_pos_x FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN image_pos_x INTEGER DEFAULT 50");
  db.exec("ALTER TABLE cards ADD COLUMN image_pos_y INTEGER DEFAULT 50");
}

try {
  db.prepare("SELECT composed_image_url FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN composed_image_url TEXT DEFAULT ''");
}

// Per-card styling columns
try {
  db.prepare("SELECT border_image_url FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN border_image_url TEXT DEFAULT ''");
  db.exec("ALTER TABLE cards ADD COLUMN text_color TEXT DEFAULT '#000000'");
  db.exec("ALTER TABLE cards ADD COLUMN title_offset_x INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN title_offset_y INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN type_offset_x INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN type_offset_y INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN textbox_offset_x INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN textbox_offset_y INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN info_offset_x INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN info_offset_y INTEGER DEFAULT 0");
}

// Per-text-type color, font size, title gap
try {
  db.prepare("SELECT title_color FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN title_color TEXT DEFAULT ''");
  db.exec("ALTER TABLE cards ADD COLUMN type_color TEXT DEFAULT ''");
  db.exec("ALTER TABLE cards ADD COLUMN textbox_color TEXT DEFAULT ''");
  db.exec("ALTER TABLE cards ADD COLUMN info_color TEXT DEFAULT ''");
  db.exec("ALTER TABLE cards ADD COLUMN title_font_size REAL DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN type_font_size REAL DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN textbox_font_size REAL DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN info_font_size REAL DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN title_gap INTEGER DEFAULT 0");
}

// Separate mana cost displacement
try {
  db.prepare("SELECT mana_offset_x FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN mana_offset_x INTEGER DEFAULT 0");
  db.exec("ALTER TABLE cards ADD COLUMN mana_offset_y INTEGER DEFAULT 0");
}

// Direct image flag
try {
  db.prepare("SELECT is_direct_image FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN is_direct_image INTEGER DEFAULT 0");
}

// Events JSON column
try {
  db.prepare("SELECT events FROM cards LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE cards ADD COLUMN events TEXT DEFAULT '[]'");
}

module.exports = db;
