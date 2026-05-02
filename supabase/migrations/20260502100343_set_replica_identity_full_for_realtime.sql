/*
  # Set REPLICA IDENTITY FULL on orders and products

  1. Changes
    - ALTER TABLE orders REPLICA IDENTITY FULL
    - ALTER TABLE products REPLICA IDENTITY FULL

  2. Notes
    - Required for Supabase Realtime to include the full row (payload.new / payload.old)
      on UPDATE and DELETE events. Without this, UPDATE events only include changed
      columns plus the primary key, causing the frontend to receive incomplete rows
      and break the dbToOrder / dbToProduct mappers.
*/

ALTER TABLE orders  REPLICA IDENTITY FULL;
ALTER TABLE products REPLICA IDENTITY FULL;
