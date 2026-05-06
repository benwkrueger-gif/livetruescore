/*
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  newsletter_opt_in BOOLEAN DEFAULT TRUE,
  
  -- Arena Scan (Q1–Q8), each 1–10
  arena_work INTEGER CHECK (arena_work BETWEEN 1 AND 10),
  arena_financial INTEGER CHECK (arena_financial BETWEEN 1 AND 10),
  arena_relationships INTEGER CHECK (arena_relationships BETWEEN 1 AND 10),
  arena_health INTEGER CHECK (arena_health BETWEEN 1 AND 10),
  arena_freedom INTEGER CHECK (arena_freedom BETWEEN 1 AND 10),
  arena_play INTEGER CHECK (arena_play BETWEEN 1 AND 10),
  arena_creativity INTEGER CHECK (arena_creativity BETWEEN 1 AND 10),
  arena_contribution INTEGER CHECK (arena_contribution BETWEEN 1 AND 10),
  
  -- Values Layer
  values_ranked JSONB,        -- array of {value, rank} in order 1–4
  sacrifice_first TEXT,       -- Q10 single select
  envy_signal TEXT,           -- Q11 single select
  permission_orientation TEXT CHECK (permission_orientation IN ('A','B','C','D')),
  
  -- Identity Core
  deferred_dream BOOLEAN,
  deferred_dream_category TEXT,
  deferred_dream_other TEXT,
  influence_source TEXT,      -- Q15
  future_vision TEXT,         -- Q16 open text
  
  -- Computed Results (populated server-side)
  alignment_score INTEGER CHECK (alignment_score BETWEEN 0 AND 100),
  alignment_type TEXT,
  top_gaps JSONB,             -- [{arena, importance, satisfaction, gap}]
  importance_weights JSONB,   -- {arena_key: weight}
  score_label TEXT,           -- 'Strongly Aligned' | 'Partially Aligned' etc
  
  -- Attribution
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Sharing
  share_count INTEGER DEFAULT 0
);

CREATE INDEX idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_alignment_type ON quiz_responses(alignment_type);
*/

-- Run this in Supabase SQL Editor:
-- ALTER TABLE quiz_responses
--   ADD COLUMN IF NOT EXISTS ai_narrative TEXT;
