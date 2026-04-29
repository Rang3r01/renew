/*
  # Create products and orders tables

  ## Summary
  Sets up the core data tables for the Renew Health Supplies store.

  ## New Tables

  ### products
  - `id` (bigint, primary key, auto-increment)
  - `name` (text, required) — product name
  - `brand` (text) — brand name
  - `category` (text) — product category
  - `price` (numeric) — price in ZAR
  - `stock` (integer) — units available
  - `description` (text) — full description
  - `features` (text[]) — bullet-point feature list
  - `active` (boolean) — whether shown in store
  - `image_url` (text) — public URL of uploaded product image
  - `created_at` (timestamptz)

  ### orders
  - `id` (text, primary key) — e.g. "RNW-10021"
  - `customer` (text) — customer full name
  - `email` (text)
  - `phone` (text)
  - `item_count` (integer)
  - `total` (numeric)
  - `date` (text) — human-readable date string
  - `status` (text) — pending / confirmed / delivered / cancelled
  - `items` (jsonb) — array of { name, brand, qty, price }
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Products: anyone authenticated can read; only service_role can write
    (admin mutations go through the app via service-role edge function or anon with admin policy)
  - For now: authenticated users can read products, admin writes handled via anon insert
    with a policy that checks request source — simplified: allow all authenticated for read,
    allow all authenticated for write on products (admin gate is in the UI)
  - Orders: authenticated users can insert their own order; read is open to authenticated

  ## Seed Data
  Inserts the 12 initial products.
*/

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id         bigserial PRIMARY KEY,
  name       text        NOT NULL DEFAULT '',
  brand      text        NOT NULL DEFAULT '',
  category   text        NOT NULL DEFAULT 'Supplements',
  price      numeric     NOT NULL DEFAULT 0,
  stock      integer     NOT NULL DEFAULT 0,
  description text       NOT NULL DEFAULT '',
  features   text[]      NOT NULL DEFAULT '{}',
  active     boolean     NOT NULL DEFAULT true,
  image_url  text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id          text        PRIMARY KEY,
  customer    text        NOT NULL DEFAULT '',
  email       text        NOT NULL DEFAULT '',
  phone       text        NOT NULL DEFAULT '',
  item_count  integer     NOT NULL DEFAULT 0,
  total       numeric     NOT NULL DEFAULT 0,
  date        text        NOT NULL DEFAULT '',
  status      text        NOT NULL DEFAULT 'pending',
  items       jsonb       NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── SEED PRODUCTS ───────────────────────────────────────────────────────────

INSERT INTO products (name, brand, category, price, stock, description, features, active, image_url) VALUES
  ('Oxygen Concentrator 5L', 'OxygenPro', 'Oxygen Products', 4999, 8,
   'Medical-grade 5 litre per minute oxygen concentrator suitable for home and clinical use.',
   ARRAY['5L/min continuous flow','Medical-grade purity (93±3%)','Low noise — 42dB','Built-in alarm system','2-year warranty'],
   true, ''),
  ('CPAP Auto Machine', 'SleepWell', 'Oxygen Products', 8500, 4,
   'Auto-adjusting CPAP machine for sleep apnoea therapy.',
   ARRAY['Auto pressure 4–20 cmH₂O','Integrated humidifier','Data recording & app sync','Travel-ready compact design','5-year warranty'],
   true, ''),
  ('Nebulizer Compressor Kit', 'MedAir', 'Oxygen Products', 1299, 15,
   'Professional compressor nebulizer for effective inhalation therapy.',
   ARRAY['0.5 ml/min nebulization rate','MMAD ≤ 5 μm particle size','Complete mask & tubing kit','Child and adult masks included'],
   true, ''),
  ('Fingertip Pulse Oximeter', 'VitalCheck', 'Oxygen Products', 599, 22,
   'Accurate fingertip pulse oximeter for measuring blood oxygen saturation (SpO2) and pulse rate.',
   ARRAY['SpO2 accuracy ±2%','Pulse rate 30–250 bpm','Auto power-off','Includes carry pouch & lanyard'],
   true, ''),
  ('Whey Protein Isolate 1kg', 'NutriForce', 'Supplements', 599, 30,
   'Premium whey protein isolate providing 27g of protein per serving.',
   ARRAY['27g protein per 30g serving','Less than 1g fat','Instantised for easy mixing','Available in Chocolate & Vanilla'],
   true, ''),
  ('Immune Boost Complex', 'VitaShield', 'Supplements', 279, 45,
   'Advanced immune support formula combining Vitamin C, Zinc, Elderberry and Echinacea.',
   ARRAY['1000mg Vitamin C per serving','15mg Zinc','Elderberry & Echinacea extract','60 capsules per bottle'],
   true, ''),
  ('Marine Collagen Peptides', 'RenewSkin', 'Wellness', 449, 18,
   'Hydrolysed marine collagen peptides for skin elasticity, joint health and gut lining support.',
   ARRAY['10g collagen per serving','Type I & III collagen','Unflavoured — mixes clear','Sustainably sourced'],
   true, ''),
  ('Omega-3 Fish Oil 90 Caps', 'DeepSea', 'Supplements', 199, 60,
   'High-potency omega-3 fatty acids (EPA & DHA) sourced from wild-caught deep-sea fish.',
   ARRAY['1000mg fish oil per capsule','180mg EPA / 120mg DHA','Enteric-coated (no fishy aftertaste)','Third-party tested'],
   true, ''),
  ('Magnesium Glycinate 120 Caps', 'CalmoMag', 'Supplements', 249, 3,
   'Highly bioavailable magnesium glycinate for muscle relaxation and improved sleep.',
   ARRAY['400mg magnesium per serving','Glycinate form — superior absorption','Supports deep sleep','Non-laxative formula'],
   true, ''),
  ('Foam Roller Pro 60cm', 'ActiveBody', 'Recovery', 349, 12,
   'High-density EVA foam roller for myofascial release and muscle recovery.',
   ARRAY['High-density EVA foam','60cm length, 15cm diameter','Grid texture for targeted relief','Supports up to 120kg'],
   true, ''),
  ('Joint Support Formula', 'FlexHealth', 'Supplements', 329, 0,
   'Comprehensive joint health supplement combining glucosamine, chondroitin and MSM.',
   ARRAY['1500mg Glucosamine','1200mg Chondroitin','500mg MSM','90 tablets per bottle'],
   true, ''),
  ('Vitamin D3 + K2 Drops', 'SunVita', 'Wellness', 189, 35,
   'Liquid vitamin D3 combined with K2 (MK-7) for optimal calcium absorption.',
   ARRAY['2000 IU Vitamin D3 per drop','100mcg Vitamin K2 (MK-7)','MCT oil base for absorption','30ml — approx 900 drops'],
   true, '')
ON CONFLICT DO NOTHING;

-- ─── SEED ORDERS ─────────────────────────────────────────────────────────────

INSERT INTO orders (id, customer, email, phone, item_count, total, date, status, items) VALUES
  ('RNW-10021','Sarah van der Merwe','sarah@email.com','082 411 2233',3,1847,'27 Apr 2026','delivered',
   '[{"name":"Immune Boost Complex","brand":"VitaShield","qty":2,"price":279},{"name":"Omega-3 Fish Oil 90 Caps","brand":"DeepSea","qty":1,"price":199},{"name":"Magnesium Glycinate 120 Caps","brand":"CalmoMag","qty":3,"price":249}]'),
  ('RNW-10022','Pieter Botha','pieter@email.com','073 552 8810',1,4999,'26 Apr 2026','confirmed',
   '[{"name":"Oxygen Concentrator 5L","brand":"OxygenPro","qty":1,"price":4999}]'),
  ('RNW-10023','Nomsa Dlamini','nomsa@email.com','060 123 9988',4,1316,'26 Apr 2026','pending',
   '[{"name":"Vitamin D3 + K2 Drops","brand":"SunVita","qty":2,"price":189},{"name":"Marine Collagen Peptides","brand":"RenewSkin","qty":1,"price":449},{"name":"Immune Boost Complex","brand":"VitaShield","qty":1,"price":279}]'),
  ('RNW-10024','Jan Erasmus','jan@email.com','082 776 3341',2,8699,'25 Apr 2026','confirmed',
   '[{"name":"CPAP Auto Machine","brand":"SleepWell","qty":1,"price":8500},{"name":"Fingertip Pulse Oximeter","brand":"VitalCheck","qty":1,"price":199}]'),
  ('RNW-10025','Lerato Motsepe','lerato@email.com','071 908 5544',1,599,'24 Apr 2026','delivered',
   '[{"name":"Whey Protein Isolate 1kg","brand":"NutriForce","qty":1,"price":599}]'),
  ('RNW-10026','Kobus Nel','kobus@email.com','083 441 7762',1,8500,'23 Apr 2026','delivered',
   '[{"name":"CPAP Auto Machine","brand":"SleepWell","qty":1,"price":8500}]')
ON CONFLICT DO NOTHING;
