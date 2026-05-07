-- Run this in Supabase SQL Editor before deploying.
ALTER TABLE quiz_responses
  ADD COLUMN IF NOT EXISTS full_report JSONB;
