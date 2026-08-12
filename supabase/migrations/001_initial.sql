create extension if not exists "pgcrypto";
create table if not exists public.food_images (id uuid primary key default gen_random_uuid(),food_name text not null,image_url text not null,source text not null default 'google',is_selected boolean not null default false,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(food_name,image_url));
create index if not exists food_images_name_idx on public.food_images(food_name);
create table if not exists public.meal_trays (id uuid primary key default gen_random_uuid(),meal_date date not null unique,title text not null,rice text,soup text,side1 text,side2 text,side3 text,rice_image text,soup_image text,side1_image text,side2_image text,side3_image text,final_image_url text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.food_images enable row level security;alter table public.meal_trays enable row level security;
-- 브라우저 직접 쓰기는 차단합니다. 모든 쓰기는 service role을 사용하는 서버 API에서만 수행됩니다.
insert into storage.buckets(id,name,public) values ('meal-images','meal-images',true),('meal-trays','meal-trays',true) on conflict(id) do update set public=true;
create policy "Public meal image reads" on storage.objects for select using (bucket_id in ('meal-images','meal-trays'));
