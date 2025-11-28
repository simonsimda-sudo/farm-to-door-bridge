-- Grant insert privileges on orders and order_items to web roles
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;