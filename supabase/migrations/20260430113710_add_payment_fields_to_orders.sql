/*
  # Add payment fields to orders table

  ## Summary
  Adds Payfast-specific payment tracking columns to the orders table.

  ## Modified Tables

  ### orders
  - `payment_status` (text, default 'unpaid') — tracks Payfast payment state: unpaid / paid / failed / cancelled
  - `payfast_payment_id` (text, default '') — the pf_payment_id returned by Payfast ITN
  - `delivery_address` (jsonb, default '{}') — stores the checkout delivery details

  ## Notes
  - Uses IF NOT EXISTS guards so migration is safe to re-run
  - No destructive operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payfast_payment_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN payfast_payment_id text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_address jsonb NOT NULL DEFAULT '{}';
  END IF;
END $$;
