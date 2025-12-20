-- Create validation trigger function for orders
CREATE OR REPLACE FUNCTION public.validate_order_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Email format check (RFC 5322 basic pattern)
  IF NEW.customer_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Phone format (international format, allows +, digits, spaces, hyphens, parentheses)
  IF NEW.customer_phone !~ '^\+?[0-9\s\-\(\)]{5,50}$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;
  
  -- Future delivery date (must be at least 2 days from now)
  IF NEW.delivery_date < CURRENT_DATE + INTERVAL '2 days' THEN
    RAISE EXCEPTION 'Delivery date must be at least 2 days from now';
  END IF;
  
  -- Postal code format (alphanumeric with spaces/hyphens, 2-20 chars)
  IF NEW.delivery_postal_code !~ '^[A-Za-z0-9\s\-]{2,20}$' THEN
    RAISE EXCEPTION 'Invalid postal code format';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate orders before insert
CREATE TRIGGER check_order_validity
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_before_insert();