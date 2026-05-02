/*
  # Create decrement_stock RPC function

  1. New Function
    - `decrement_stock(p_product_id, p_quantity)`
    - Safely decrements the `stock` column on the `products` table
    - Clamps at 0 to prevent negative stock
    - Runs with SECURITY DEFINER so the edge function's service role can call it
*/

CREATE OR REPLACE FUNCTION decrement_stock(p_product_id bigint, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$;
