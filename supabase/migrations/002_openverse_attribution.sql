alter table public.food_images add column if not exists creator text;
alter table public.food_images add column if not exists license text;
alter table public.food_images add column if not exists license_url text;
alter table public.food_images add column if not exists attribution text;
alter table public.food_images add column if not exists landing_url text;
alter table public.food_images alter column source set default 'openverse';
