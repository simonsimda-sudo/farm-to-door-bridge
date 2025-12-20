-- Update the validation trigger function to cover all order fields
CREATE OR REPLACE FUNCTION public.validate_order_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Customer first name: 1-100 characters, letters/spaces/hyphens/apostrophes only
  IF LENGTH(NEW.customer_first_name) < 1 OR LENGTH(NEW.customer_first_name) > 100 THEN
    RAISE EXCEPTION 'First name must be 1-100 characters';
  END IF;
  IF NEW.customer_first_name !~ '^[A-Za-zÀ-ÿ\s\-'']+$' THEN
    RAISE EXCEPTION 'First name contains invalid characters';
  END IF;
  
  -- Customer last name: 1-100 characters, letters/spaces/hyphens/apostrophes only
  IF LENGTH(NEW.customer_last_name) < 1 OR LENGTH(NEW.customer_last_name) > 100 THEN
    RAISE EXCEPTION 'Last name must be 1-100 characters';
  END IF;
  IF NEW.customer_last_name !~ '^[A-Za-zÀ-ÿ\s\-'']+$' THEN
    RAISE EXCEPTION 'Last name contains invalid characters';
  END IF;
  
  -- Email format check (RFC 5322 basic pattern)
  IF NEW.customer_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF LENGTH(NEW.customer_email) > 255 THEN
    RAISE EXCEPTION 'Email must be 255 characters or less';
  END IF;
  
  -- Phone format (international format, allows +, digits, spaces, hyphens, parentheses)
  IF NEW.customer_phone !~ '^\+?[0-9\s\-\(\)]{5,50}$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;
  
  -- Delivery street: 1-200 characters
  IF LENGTH(NEW.delivery_street) < 1 OR LENGTH(NEW.delivery_street) > 200 THEN
    RAISE EXCEPTION 'Street address must be 1-200 characters';
  END IF;
  
  -- Delivery city: 1-100 characters, letters/spaces/hyphens only
  IF LENGTH(NEW.delivery_city) < 1 OR LENGTH(NEW.delivery_city) > 100 THEN
    RAISE EXCEPTION 'City must be 1-100 characters';
  END IF;
  IF NEW.delivery_city !~ '^[A-Za-zÀ-ÿ\s\-'']+$' THEN
    RAISE EXCEPTION 'City contains invalid characters';
  END IF;
  
  -- Postal code format (alphanumeric with spaces/hyphens, 2-20 chars)
  IF NEW.delivery_postal_code !~ '^[A-Za-z0-9\s\-]{2,20}$' THEN
    RAISE EXCEPTION 'Invalid postal code format';
  END IF;
  
  -- Delivery country: 1-100 characters, letters/spaces only
  IF LENGTH(NEW.delivery_country) < 1 OR LENGTH(NEW.delivery_country) > 100 THEN
    RAISE EXCEPTION 'Country must be 1-100 characters';
  END IF;
  IF NEW.delivery_country !~ '^[A-Za-zÀ-ÿ\s]+$' THEN
    RAISE EXCEPTION 'Country contains invalid characters';
  END IF;
  
  -- Future delivery date (must be at least 2 days from now)
  IF NEW.delivery_date < CURRENT_DATE + INTERVAL '2 days' THEN
    RAISE EXCEPTION 'Delivery date must be at least 2 days from now';
  END IF;
  
  -- Delivery time slot: optional, but if provided must be 1-50 characters
  IF NEW.delivery_time_slot IS NOT NULL AND LENGTH(NEW.delivery_time_slot) > 50 THEN
    RAISE EXCEPTION 'Delivery time slot must be 50 characters or less';
  END IF;
  
  -- Delivery notes: optional, but if provided must be 1-500 characters
  IF NEW.delivery_notes IS NOT NULL AND LENGTH(NEW.delivery_notes) > 500 THEN
    RAISE EXCEPTION 'Delivery notes must be 500 characters or less';
  END IF;
  
  -- Total amount: must be positive and reasonable (max 100,000)
  IF NEW.total_amount <= 0 THEN
    RAISE EXCEPTION 'Total amount must be greater than zero';
  END IF;
  IF NEW.total_amount > 100000 THEN
    RAISE EXCEPTION 'Total amount exceeds maximum allowed';
  END IF;
  
  RETURN NEW;
END;
$$;