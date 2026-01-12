-- Add end time columns to reservations and activities tables
ALTER TABLE public.reservations 
ADD COLUMN reservation_end_time text;

ALTER TABLE public.activities 
ADD COLUMN event_end_time text;