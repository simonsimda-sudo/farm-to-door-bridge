-- Drop the restrictive INSERT policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Create permissive INSERT policies for public order placement
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can create order items" 
ON public.order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also add SELECT policy so customers can view their order by token
CREATE POLICY "Customers can view orders by token" 
ON public.orders 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can view order items" 
ON public.order_items 
FOR SELECT 
TO anon, authenticated
USING (true);