CREATE TABLE IF NOT EXISTS city_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_city_pages_status_updated ON city_pages(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS platform_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT '中',
  platform_type TEXT NOT NULL DEFAULT '',
  languages TEXT NOT NULL DEFAULT '',
  payments TEXT NOT NULL DEFAULT '',
  supports_usdt INTEGER NOT NULL DEFAULT 0,
  payout_speed TEXT NOT NULL DEFAULT '',
  license TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  pros TEXT NOT NULL DEFAULT '',
  cons TEXT NOT NULL DEFAULT '',
  user_feedback TEXT NOT NULL DEFAULT '',
  complaint_summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_reviews_status_updated ON platform_reviews(status, updated_at DESC);
