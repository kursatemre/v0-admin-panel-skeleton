-- Insert default categories
INSERT INTO categories (name, display_order) VALUES
  ('Ana Yemekler', 1),
  ('Başlangıçlar', 2),
  ('İçecekler', 3),
  ('Tatlılar', 4)
ON CONFLICT DO NOTHING;

-- Insert default display settings
INSERT INTO display_settings (setting_key, setting_value) VALUES
  ('background_color', '#ffffff'),
  ('accent_color', '#ef4444')
ON CONFLICT (setting_key) DO UPDATE 
  SET setting_value = EXCLUDED.setting_value;

-- Insert sample products
INSERT INTO products (name, description, price, category_id, is_active)
SELECT 
  'Izgara Köfte',
  'Özel baharatlarla hazırlanmış lezzetli köfte',
  89.90,
  (SELECT id FROM categories WHERE name = 'Ana Yemekler' LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Izgara Köfte');

INSERT INTO products (name, description, price, category_id, is_active)
SELECT 
  'Mercimek Çorbası',
  'Geleneksel Türk mutfağından sıcak çorba',
  25.00,
  (SELECT id FROM categories WHERE name = 'Başlangıçlar' LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mercimek Çorbası');

INSERT INTO products (name, description, price, category_id, is_active)
SELECT 
  'Ayran',
  'Ev yapımı taze ayran',
  15.00,
  (SELECT id FROM categories WHERE name = 'İçecekler' LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ayran');
