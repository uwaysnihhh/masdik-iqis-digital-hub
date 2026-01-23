-- Perbaiki constraint jenis kegiatan agar mendukung opsi "Lainnya" dan variasi ejaan "sholat"
ALTER TABLE public.activities
  DROP CONSTRAINT IF EXISTS activities_type_check;

ALTER TABLE public.activities
  ADD CONSTRAINT activities_type_check
  CHECK (
    type = ANY (
      ARRAY[
        'kajian',
        'pengajian',
        'shalat',
        'sholat',
        'acara',
        'sosial',
        'reservasi',
        'lainnya'
      ]::text[]
    )
  );
