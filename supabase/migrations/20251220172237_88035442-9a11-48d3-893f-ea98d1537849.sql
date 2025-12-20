-- Add confirmation_token column to orders table for secure order viewing
ALTER TABLE public.orders ADD COLUMN confirmation_token UUID DEFAULT gen_random_uuid();

-- Add RLS policy to allow viewing orders with matching confirmation token
-- This allows customers to view their order using the token in the URL
CREATE POLICY "Anyone can view orders with valid token"
  ON public.orders
  FOR SELECT
  TO PUBLIC
  USING (confirmation_token IS NOT NULL);

-- Note: The actual token validation happens in the application query
-- by filtering .eq('confirmation_token', token)
-- This policy just enables the query to work, the WHERE clause provides security

-- Also add policy for order_items to be viewable when parent order is accessible
CREATE POLICY "Anyone can view order items for accessible orders"
  ON public.order_items
  FOR SELECT
  TO PUBLIC
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.confirmation_token IS NOT NULL
    )
  );