-- Perketat RLS INSERT reservations agar tidak bisa menyisipkan status selain 'pending'
DROP POLICY IF EXISTS "Anyone can create reservation" ON public.reservations;

CREATE POLICY "Anyone can create reservation"
ON public.reservations
FOR INSERT
WITH CHECK (
  status = 'pending'
  AND reviewed_by IS NULL
  AND reviewed_at IS NULL
);
