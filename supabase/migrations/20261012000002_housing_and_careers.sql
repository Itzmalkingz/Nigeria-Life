-- ============================================================================
-- LIFE IN AFRICA — MIGRATION 002: HOUSING, CAREERS & DYNAMIC EVENTS
-- ============================================================================

-- 1. HOUSING TIERS TABLE
CREATE TABLE IF NOT EXISTS public.housing_units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    weekly_rent_kobo BIGINT NOT NULL,
    energy_recovery_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    comfort_rating INTEGER NOT NULL DEFAULT 1
);

INSERT INTO public.housing_units (id, name, district, weekly_rent_kobo, energy_recovery_multiplier, comfort_rating) VALUES
    ('face_me_i_face_you', 'Face-me-I-face-you', 'Mushin', 240000, 1.0, 1),
    ('studio_apartment', 'Studio Apartment', 'Yaba', 800000, 1.3, 2),
    ('modern_flat', 'Modern 2-Bedroom Flat', 'Lekki Phase 1', 3500000, 1.7, 4),
    ('luxury_duplex', 'Luxury Waterfront Duplex', 'Banana Island', 15000000, 2.2, 5)
ON CONFLICT (id) DO NOTHING;

-- 2. CAREER DEFINITIONS TABLE
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('informal', 'corporate', 'tech', 'business')),
    shift_hours INTEGER NOT NULL DEFAULT 8,
    base_pay_kobo_per_shift BIGINT NOT NULL,
    min_skill_level INTEGER NOT NULL DEFAULT 0
);

INSERT INTO public.careers (id, title, category, shift_hours, base_pay_kobo_per_shift, min_skill_level) VALUES
    ('danfo_conductor', 'Danfo Conductor', 'informal', 8, 500000, 0),
    ('market_trader', 'Market Trader', 'business', 8, 850000, 1),
    ('junior_dev', 'Junior Software Developer', 'tech', 8, 1500000, 2),
    ('bank_teller', 'Bank Operations Teller', 'corporate', 8, 1200000, 1)
ON CONFLICT (id) DO NOTHING;

-- 3. PLAYER EMPLOYMENT TABLE
CREATE TABLE IF NOT EXISTS public.player_employment (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    career_id TEXT NOT NULL REFERENCES public.careers(id),
    current_level INTEGER NOT NULL DEFAULT 1,
    performance_score INTEGER NOT NULL DEFAULT 50,
    total_shifts_completed INTEGER NOT NULL DEFAULT 0,
    hired_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for player employment
ALTER TABLE public.player_employment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own employment" ON public.player_employment FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can update own employment" ON public.player_employment FOR UPDATE USING (auth.uid() = player_id);
CREATE POLICY "Users can insert own employment" ON public.player_employment FOR INSERT WITH CHECK (auth.uid() = player_id);

-- 4. PROCESS WEEKLY RENT RPC
CREATE OR REPLACE FUNCTION public.process_weekly_rent(p_player_id UUID)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    new_cash_kobo BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_profile RECORD;
    v_housing RECORD;
    v_rent_amount BIGINT;
    v_idempotency_key TEXT;
    v_tx_res RECORD;
BEGIN
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_player_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, CAST('Profile not found' AS TEXT), CAST(0 AS BIGINT);
        RETURN;
    END IF;

    -- Get housing details
    SELECT * INTO v_housing FROM public.housing_units WHERE id = COALESCE(v_profile.housing_unit_id, 'face_me_i_face_you');
    v_rent_amount := v_housing.weekly_rent_kobo;

    v_idempotency_key := 'rent-' || p_player_id || '-' || date_trunc('week', now());

    -- Try paying from cash first, then bank if needed
    IF v_profile.cash_kobo >= v_rent_amount THEN
        SELECT * INTO v_tx_res FROM public.execute_transaction(
            p_player_id,
            'RENT_PAYMENT',
            -v_rent_amount,
            'cash',
            'Weekly rent payment for ' || v_housing.name,
            v_housing.id,
            v_idempotency_key
        );
        IF v_tx_res.success THEN
            UPDATE public.profiles SET rent_due_date = (now() + INTERVAL '7 days'), updated_at = now() WHERE id = p_player_id;
            RETURN QUERY SELECT true, CAST('Rent paid successfully from cash' AS TEXT), v_tx_res.new_balance_kobo;
            RETURN;
        END IF;
    END IF;

    -- Fallback to bank
    IF v_profile.bank_kobo >= v_rent_amount THEN
        SELECT * INTO v_tx_res FROM public.execute_transaction(
            p_player_id,
            'RENT_PAYMENT',
            -v_rent_amount,
            'bank',
            'Weekly rent payment for ' || v_housing.name,
            v_housing.id,
            v_idempotency_key
        );
        IF v_tx_res.success THEN
            UPDATE public.profiles SET rent_due_date = (now() + INTERVAL '7 days'), updated_at = now() WHERE id = p_player_id;
            RETURN QUERY SELECT true, CAST('Rent paid successfully from bank' AS TEXT), v_profile.cash_kobo;
            RETURN;
        END IF;
    END IF;

    -- If insufficient funds in both: eviction warning or downgrade to Mushin Face-me-I-face-you
    IF v_profile.housing_unit_id != 'face_me_i_face_you' THEN
        UPDATE public.profiles 
        SET housing_unit_id = 'face_me_i_face_you', 
            current_location_id = 'home_mushin',
            rent_due_date = (now() + INTERVAL '7 days'),
            updated_at = now() 
        WHERE id = p_player_id;

        RETURN QUERY SELECT false, CAST('Evicted for unpaid rent! Downgraded to Mushin Face-me-I-face-you.' AS TEXT), v_profile.cash_kobo;
        RETURN;
    END IF;

    RETURN QUERY SELECT false, CAST('Rent overdue! Risk of legal action or further penalties.' AS TEXT), v_profile.cash_kobo;
END;
$$;
