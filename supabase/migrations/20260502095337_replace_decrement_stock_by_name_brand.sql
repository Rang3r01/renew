/*
  # Replace decrement_stock with name+brand lookup version

  1. Changes
    - Drop the old decrement_stock(bigint, integer) function
    - Create decrement_stock_by_name(p_name text, p_brand text, p_quantity integer)
      which looks up the product by name+brand and subtracts p_quantity from stock,
      clamped at 0. Returns the product id that was updated (or NULL if not found).

  2. Notes
    - SECURITY DEFINER allows the edge function's service role to call it
    - Orders store items as {name, brand, qty} — no product id — so lookup by name+brand is required
*/

DROP FUNCTION IF EXISTS decrement_stock(bigint, integer);

CREATE OR REPLACE FUNCTION decrement_stock_by_name(
  p_name     text,
  p_brand    text,
  p_quantity integer
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product_id bigint;
BEGIN
  SELECT id INTO v_product_id
  FROM products
  WHERE name = p_name AND brand = p_brand
  LIMIT 1;

  IF v_product_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = v_product_id;

  RETURN v_product_id;
END;
$$;
