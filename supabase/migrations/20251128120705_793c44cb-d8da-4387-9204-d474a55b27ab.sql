-- Drop and recreate the insert policies with explicit PUBLIC role access
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for anonymous order items" ON public.order_items;

-- Create policies that explicitly allow PUBLIC role (includes anon and authenticated)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Anyone can create order items"
  ON public.order_items
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);