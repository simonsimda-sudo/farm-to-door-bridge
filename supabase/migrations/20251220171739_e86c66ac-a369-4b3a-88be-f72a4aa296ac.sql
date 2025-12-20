-- Add CHECK constraints for reasonable field lengths on orders table
-- This provides server-side validation to prevent excessively long inputs

-- First, add constraints for customer information
ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_first_name_length CHECK (char_length(customer_first_name) <= 100),
  ADD CONSTRAINT orders_customer_last_name_length CHECK (char_length(customer_last_name) <= 100),
  ADD CONSTRAINT orders_customer_email_length CHECK (char_length(customer_email) <= 255),
  ADD CONSTRAINT orders_customer_phone_length CHECK (char_length(customer_phone) <= 50);

-- Add constraints for delivery address fields
ALTER TABLE public.orders
  ADD CONSTRAINT orders_delivery_street_length CHECK (char_length(delivery_street) <= 255),
  ADD CONSTRAINT orders_delivery_city_length CHECK (char_length(delivery_city) <= 100),
  ADD CONSTRAINT orders_delivery_postal_code_length CHECK (char_length(delivery_postal_code) <= 20),
  ADD CONSTRAINT orders_delivery_country_length CHECK (char_length(delivery_country) <= 100),
  ADD CONSTRAINT orders_delivery_notes_length CHECK (delivery_notes IS NULL OR char_length(delivery_notes) <= 1000),
  ADD CONSTRAINT orders_delivery_time_slot_length CHECK (delivery_time_slot IS NULL OR char_length(delivery_time_slot) <= 50);

-- Add constraint for positive total amount
ALTER TABLE public.orders
  ADD CONSTRAINT orders_total_amount_positive CHECK (total_amount > 0);

-- Add constraints for order_items table
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_name_length CHECK (char_length(product_name) <= 255),
  ADD CONSTRAINT order_items_farm_name_length CHECK (char_length(farm_name) <= 255),
  ADD CONSTRAINT order_items_unit_length CHECK (char_length(unit) <= 50),
  ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  ADD CONSTRAINT order_items_unit_price_positive CHECK (unit_price >= 0),
  ADD CONSTRAINT order_items_line_total_positive CHECK (line_total >= 0);