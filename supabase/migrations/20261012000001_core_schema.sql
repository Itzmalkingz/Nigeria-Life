-- ============================================================================
-- LIFE IN AFRICA — MIGRATION 001: CORE SIMULATION SCHEMA
-- Profiles, Player Needs, Transaction Ledger, and Row Level Security (RLS)
-- ============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    age_years INTEGER NOT NULL DEFAULT 18,
    current_location_id TEXT DEFAULT 'home_mushin',
    cash_kobo BIGINT NOT NULL DEFAULT 1000000, -- ₦10,000.00 starting cash
    bank_kobo BIGINT NOT NULL DEFAULT 0,
    housing_unit_id TEXT DEFAULT 'face_me_i_face_you',
    rent_due_date TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
    last_tick_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_incarcerated BOOLEAN NOT NULL DEFAULT false,
    prison_release_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PLAYER NEEDS TABLE
CREATE TABLE IF NOT EXISTS public.player_needs (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    hunger INTEGER NOT NULL DEFAULT 100 CHECK (hunger BETWEEN 0 AND 100),
    energy INTEGER NOT NULL DEFAULT 100 CHECK (energy BETWEEN 0 AND 100),
    hygiene INTEGER NOT NULL DEFAULT 100 CHECK (hygiene BETWEEN 0 AND 100),
    fun INTEGER NOT NULL DEFAULT 50 CHECK (fun BETWEEN 0 AND 100),
    social INTEGER NOT NULL DEFAULT 50 CHECK (social BETWEEN 0 AND 100),
    bladder INTEGER NOT NULL DEFAULT 0 CHECK (bladder BETWEEN 0 AND 100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TRANSACTION LEDGER TABLE (Append-Only Audit Trail)
CREATE TABLE IF NOT EXISTS public.transaction_ledger (
    id BIGSERIAL PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'DEPOSIT', 'WITHDRAW', 'RENT_PAYMENT', 'WAGE_PAYMENT', 'FOOD_PURCHASE'
    amount_kobo BIGINT NOT NULL,
    balance_after_kobo BIGINT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('cash', 'bank')),
    reference_id TEXT,
    description TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transaction_ledger_player_id ON public.transaction_ledger(player_id);
CREATE INDEX IF NOT EXISTS idx_transaction_ledger_created_at ON public.transaction_ledger(created_at DESC);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_ledger ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Player Needs Policies
CREATE POLICY "Users can view own needs"
    ON public.player_needs FOR SELECT
    USING (auth.uid() = player_id);

CREATE POLICY "Users can update own needs"
    ON public.player_needs FOR UPDATE
    USING (auth.uid() = player_id);

-- Transaction Ledger Policies
CREATE POLICY "Users can view own transactions"
    ON public.transaction_ledger FOR SELECT
    USING (auth.uid() = player_id);

-- ============================================================================
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_display_name TEXT;
BEGIN
    v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Player');

    -- Insert Profile
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, v_display_name)
    ON CONFLICT (id) DO NOTHING;

    -- Insert Initial Needs
    INSERT INTO public.player_needs (player_id)
    VALUES (NEW.id)
    ON CONFLICT (player_id) DO NOTHING;

    -- Insert Initial Starting Capital Transaction Ledger Entry
    INSERT INTO public.transaction_ledger (player_id, type, amount_kobo, balance_after_kobo, account_type, description, idempotency_key)
    VALUES (
        NEW.id,
        'STARTING_CASH',
        1000000,
        1000000,
        'cash',
        'Initial starting funds for your new life',
        'init-' || NEW.id
    )
    ON CONFLICT (idempotency_key) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. SERVER-AUTHORITATIVE RPC FUNCTIONS
-- ============================================================================

-- Function to execute a safe monetary transaction with idempotency and audit logging
CREATE OR REPLACE FUNCTION public.execute_transaction(
    p_player_id UUID,
    p_type TEXT,
    p_amount_kobo BIGINT,
    p_account_type TEXT, -- 'cash' or 'bank'
    p_description TEXT,
    p_reference_id TEXT,
    p_idempotency_key TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    new_balance_kobo BIGINT,
    error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_balance BIGINT;
    v_new_balance BIGINT;
    v_existing_id INTEGER;
BEGIN
    -- Check if idempotency key already processed
    SELECT id INTO v_existing_id FROM public.transaction_ledger WHERE idempotency_key = p_idempotency_key;
    IF FOUND THEN
        -- Idempotent return of current balance
        IF p_account_type = 'cash' THEN
            SELECT cash_kobo INTO v_current_balance FROM public.profiles WHERE id = p_player_id;
        ELSE
            SELECT bank_kobo INTO v_current_balance FROM public.profiles WHERE id = p_player_id;
        END IF;
        RETURN QUERY SELECT true, v_current_balance, CAST('Idempotent duplicate request ignored' AS TEXT);
        RETURN;
    END IF;

    -- Validate player and account
    IF p_account_type NOT IN ('cash', 'bank') THEN
        RETURN QUERY SELECT false, CAST(0 AS BIGINT), CAST('Invalid account type' AS TEXT);
        RETURN;
    END IF;

    -- Lock profile row for atomic update
    IF p_account_type = 'cash' THEN
        SELECT cash_kobo INTO v_current_balance FROM public.profiles WHERE id = p_player_id FOR UPDATE;
    ELSE
        SELECT bank_kobo INTO v_current_balance FROM public.profiles WHERE id = p_player_id FOR UPDATE;
    END IF;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, CAST(0 AS BIGINT), CAST('Player profile not found' AS TEXT);
        RETURN;
    END IF;

    -- Calculate new balance
    v_new_balance := v_current_balance + p_amount_kobo;

    -- Check for insufficient funds
    IF v_new_balance < 0 THEN
        RETURN QUERY SELECT false, v_current_balance, CAST('Insufficient funds' AS TEXT);
        RETURN;
    END IF;

    -- Update profile balance
    IF p_account_type = 'cash' THEN
        UPDATE public.profiles SET cash_kobo = v_new_balance, updated_at = now() WHERE id = p_player_id;
    ELSE
        UPDATE public.profiles SET bank_kobo = v_new_balance, updated_at = now() WHERE id = p_player_id;
    END IF;

    -- Insert into transaction ledger
    INSERT INTO public.transaction_ledger (
        player_id,
        type,
        amount_kobo,
        balance_after_kobo,
        account_type,
        reference_id,
        description,
        idempotency_key
    ) VALUES (
        p_player_id,
        p_type,
        p_amount_kobo,
        v_new_balance,
        p_account_type,
        p_reference_id,
        p_description,
        p_idempotency_key
    );

    RETURN QUERY SELECT true, v_new_balance, CAST(NULL AS TEXT);
END;
$$;
