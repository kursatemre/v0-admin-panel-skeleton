-- Add header and footer customization fields to display_settings
-- This allows customizing header title, subtitle, logos and footer text

INSERT INTO display_settings (setting_key, setting_value) VALUES
  ('header_title', 'Menümüz'),
  ('header_subtitle', 'Lezzetli yemeklerimizi keşfedin'),
  ('header_logo_url', ''),
  ('footer_text', 'Afiyet olsun!'),
  ('footer_logo_url', '')
ON CONFLICT (setting_key) DO NOTHING;
