-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Create new permissive policies for anonymous order creation
CREATE POLICY "Enable insert for anonymous users"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous order items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);