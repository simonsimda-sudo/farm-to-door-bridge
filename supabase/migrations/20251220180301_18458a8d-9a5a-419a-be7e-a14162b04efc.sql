-- Drop the overly permissive RLS policies that expose all orders
DROP POLICY IF EXISTS "Anyone can view orders with valid token" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items for accessible orders" ON public.order_items;

-- Create a secure RPC function to get order by token (validates both order_id AND confirmation_token)
CREATE OR REPLACE FUNCTION public.get_order_by_token(
  _order_id UUID,
  _confirmation_token UUID
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  delivery_street TEXT,
  delivery_city TEXT,
  delivery_postal_code TEXT,
  delivery_country TEXT,
  delivery_date DATE,
  delivery_time_slot TEXT,
  delivery_notes TEXT,
  total_amount NUMERIC,
  order_status order_status
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT o.id, o.created_at, o.customer_first_name, o.customer_last_name, 
         o.customer_email, o.customer_phone, o.delivery_street, o.delivery_city, 
         o.delivery_postal_code, o.delivery_country, o.delivery_date,
         o.delivery_time_slot, o.delivery_notes, o.total_amount, o.order_status
  FROM public.orders o
  WHERE o.id = _order_id 
    AND o.confirmation_token = _confirmation_token;
$$;

-- Create a secure RPC function to get order items by token
CREATE OR REPLACE FUNCTION public.get_order_items_by_token(
  _order_id UUID,
  _confirmation_token UUID
)
RETURNS TABLE (
  id UUID,
  product_name TEXT,
  farm_name TEXT,
  quantity NUMERIC,
  unit TEXT,
  unit_price NUMERIC,
  line_total NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT oi.id, oi.product_name, oi.farm_name, oi.quantity, 
         oi.unit, oi.unit_price, oi.line_total
  FROM public.order_items oi
  INNER JOIN public.orders o ON o.id = oi.order_id
  WHERE o.id = _order_id 
    AND o.confirmation_token = _confirmation_token;
$$;