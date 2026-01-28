-- Create a SECURITY DEFINER function to securely create orders with validated prices
-- This prevents price manipulation by looking up prices from the products table

CREATE OR REPLACE FUNCTION public.create_order_with_items(
  _customer_first_name text,
  _customer_last_name text,
  _customer_email text,
  _customer_phone text,
  _delivery_street text,
  _delivery_city text,
  _delivery_postal_code text,
  _delivery_country text,
  _delivery_notes text,
  _delivery_date date,
  _delivery_time_slot text,
  _items jsonb  -- Array of {product_id: uuid, quantity: numeric}
)
RETURNS TABLE(order_id uuid, confirmation_token uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order_id uuid := gen_random_uuid();
  _confirmation_token uuid := gen_random_uuid();
  _total_amount numeric := 0;
  _item jsonb;
  _product record;
  _line_total numeric;
BEGIN
  -- Validate items array is not empty
  IF jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Calculate total and validate all products exist and are in stock
  FOR _item IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    -- Get product details from database (server-side price lookup)
    SELECT p.id, p.name, p.price, p.unit, p.in_stock, f.name as farm_name
    INTO _product
    FROM products p
    INNER JOIN farms f ON f.id = p.farm_id
    WHERE p.id = (_item->>'product_id')::uuid;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', _item->>'product_id';
    END IF;
    
    IF NOT _product.in_stock THEN
      RAISE EXCEPTION 'Product is out of stock: %', _product.name;
    END IF;
    
    -- Validate quantity is positive
    IF (_item->>'quantity')::numeric <= 0 THEN
      RAISE EXCEPTION 'Quantity must be positive for product: %', _product.name;
    END IF;
    
    -- Calculate line total using SERVER-SIDE price
    _line_total := _product.price * (_item->>'quantity')::numeric;
    _total_amount := _total_amount + _line_total;
  END LOOP;

  -- Insert the order
  INSERT INTO orders (
    id,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    delivery_street,
    delivery_city,
    delivery_postal_code,
    delivery_country,
    delivery_notes,
    delivery_date,
    delivery_time_slot,
    total_amount,
    confirmation_token,
    order_status
  ) VALUES (
    _order_id,
    _customer_first_name,
    _customer_last_name,
    _customer_email,
    _customer_phone,
    _delivery_street,
    _delivery_city,
    _delivery_postal_code,
    _delivery_country,
    _delivery_notes,
    _delivery_date,
    _delivery_time_slot,
    _total_amount,
    _confirmation_token,
    'new'
  );

  -- Insert order items with SERVER-SIDE prices
  FOR _item IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    SELECT p.id, p.name, p.price, p.unit, f.name as farm_name
    INTO _product
    FROM products p
    INNER JOIN farms f ON f.id = p.farm_id
    WHERE p.id = (_item->>'product_id')::uuid;
    
    _line_total := _product.price * (_item->>'quantity')::numeric;
    
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      farm_name,
      quantity,
      unit,
      unit_price,
      line_total
    ) VALUES (
      _order_id,
      _product.id,
      _product.name,
      _product.farm_name,
      (_item->>'quantity')::numeric,
      _product.unit,
      _product.price,  -- Server-side price
      _line_total       -- Server-side calculated total
    );
  END LOOP;

  RETURN QUERY SELECT _order_id, _confirmation_token;
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO anon;
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO authenticated;