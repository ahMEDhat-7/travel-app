-- Create enum types
DO $$ BEGIN
  CREATE TYPE role AS ENUM ('USER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image TEXT,
  role role NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights JSONB NOT NULL,
  included JSONB NOT NULL,
  not_included JSONB NOT NULL,
  itinerary JSONB,
  translations JSONB NOT NULL,
  price REAL NOT NULL,
  child_price REAL,
  discount_price REAL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  images JSONB NOT NULL,
  max_capacity INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  has_free_cancellation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert sample tours (use proper JSON syntax)
INSERT INTO tours (slug, title, short_desc, description, highlights, included, not_included, translations, price, duration, location, category, images, max_capacity, is_featured, is_bestseller) VALUES
('pyramids-luxor-tour', 'Pyramids & Luxor Adventure', 'Visit the Great Pyramids of Giza and explore the ancient temples of Luxor', 
 'A 5-day journey through ancient Egypt visiting the pyramids of Giza and the temples of Luxor.',
 '["Guided tour of Giza Pyramids", "Luxor Temple visit", "Valley of the Kings", "Hotels & breakfast included"]',
 '["Personal expenses", "Gratuities", "Travel insurance"]',
 '{"en": {"title": "Pyramids & Luxor Adventure", "shortDesc": "Visit the Great Pyramids of Giza and explore the ancient temples of Luxor"}, "ru": {"title": "Пирамиды и Люксор", "shortDesc": "Посетите великие пирамиды Гизы и исследуйте древние храмы Люксора"}}',
 299.00, '5 days', 'Cairo & Luxor', 'Historical',
 '["https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800"]', 20, true, true),

('nile-cruise', 'Luxury Nile Cruise', 'Sail the Nile River on a private yacht with guided temple visits',
 'A 4-day luxury cruise from Luxor to Aswan visiting ancient temples.',
 '["Private yacht cruise", "Guided temple visits", "All meals included", "Professional guide"]',
 '["Alcoholic drinks", "Gratuities", "Personal expenses"]',
 '{"en": {"title": "Luxury Nile Cruise", "shortDesc": "Sail the Nile River on a private yacht with guided temple visits"}, "ru": {"title": "Роскошный круиз по Нилу", "shortDesc": "Плывите по Нилу на частной яхте с экскурсиями к храмам"}}',
 549.00, '4 days', 'Luxor to Aswan', 'Cruise',
 '["https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800"]', 12, true, false),

('desert-safari', 'White Desert Adventure', 'Explore the white desert formations and camp under the stars',
 'A 2-day adventure in the white desert with overnight camping.',
 '["4x4 desert tour", "Camping equipment", "Meals included", "Professional guide"]',
 '["Personal expenses", "Gratuities"]',
 '{"en": {"title": "White Desert Adventure", "shortDesc": "Explore the white desert formations and camp under the stars"}, "ru": {"title": "Приключение в Белой пустыне", "shortDesc": "Исследуйте белые пустынные образования и ночуйте под звездами"}}',
 199.00, '2 days', 'Bahariya Oasis', 'Adventure',
 '["https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800"]', 10, false, true),

('alexander-tour', 'Alexandria Day Trip', 'Explore the historic Bibliotheca and Qaitbay Fort',
 'A day trip to Alexandria visiting major historical sites.',
 '["Guided city tour", "Bibliotheca visit", "Qaitbay Fort", "Lunch included"]',
 '["Personal expenses", "Gratuities"]',
 '{"en": {"title": "Alexandria Day Trip", "shortDesc": "Explore the historic Bibliotheca and Qaitbay Fort"}, "ru": {"title": "Однодневная поездка в Александрию", "shortDesc": "Исследуйте историческую Библиотеку и форт Кайтбей"}}',
 89.00, '1 day', 'Alexandria', 'Historical',
 '["https://images.unsplash.com/photo-1566375538368-8e8ffbd5e774?w=800"]', 15, false, false);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tour_id UUID REFERENCES tours(id),
  tour_date TIMESTAMP NOT NULL,
  people INTEGER NOT NULL,
  total_price REAL NOT NULL,
  status booking_status NOT NULL DEFAULT 'PENDING',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tour_id UUID REFERENCES tours(id),
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'PENDING',
  admin_reply TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tour_id UUID REFERENCES tours(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tour_id)
);

-- Insert admin user
INSERT INTO users (id, email, name, role) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@sharmcloudtours.com', 'Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert test user
INSERT INTO users (id, email, name, role) VALUES 
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'test@example.com', 'Test User', 'USER')
ON CONFLICT (email) DO NOTHING;