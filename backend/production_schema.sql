-- PIGGYPATH PRODUCTION SCHEMA SETUP
-- Run this script in the Supabase SQL Editor to initialize your tables.

-- 1. Profiles (sync with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_uid UUID UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  balance DOUBLE PRECISION DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stocks
CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  symbol TEXT UNIQUE NOT NULL,
  current_price DOUBLE PRECISION NOT NULL,
  sector TEXT DEFAULT 'General',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TYPE order_type AS ENUM ('BUY', 'SELL');
CREATE TYPE order_status AS ENUM ('OPEN', 'PARTIALLY_FILLED', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  type order_type NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  quantity INTEGER NOT NULL,
  filled INTEGER DEFAULT 0,
  status order_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  price DOUBLE PRECISION NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Holdings
CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  quantity INTEGER DEFAULT 0,
  avg_price DOUBLE PRECISION DEFAULT 0,
  UNIQUE(user_id, stock_id)
);

-- 6. Price History
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  price DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Posts (Social)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  stock_id UUID REFERENCES public.stocks(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  post_id UUID NOT NULL REFERENCES public.posts(id),
  UNIQUE(user_id, post_id)
);

-- 9. Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  post_id UUID NOT NULL REFERENCES public.posts(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. IPO Orders
CREATE TABLE IF NOT EXISTS public.ipo_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  amount DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'SUBMITTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA (Optional)
INSERT INTO public.stocks (name, symbol, current_price, sector) VALUES 
('Megasoft', 'MSFT', 420.69, 'Technology'),
('Bapplee', 'AAPL', 185.32, 'Electronics'),
('Goggles', 'GOOGL', 142.10, 'Internet');

-- INDEXES for Performance
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_stock ON public.orders(stock_id);
CREATE INDEX idx_price_history_stock ON public.price_history(stock_id, timestamp);
