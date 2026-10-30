-- Pega TODO esto en Supabase > SQL Editor > Run
create table categories(name text primary key, created_at timestamptz default now());
create table products(
  id uuid primary key default gen_random_uuid(),
  name text not null, price numeric not null, discount int default 0,
  category text, description text default '', images text[] default '{}',
  featured boolean default false, created_at timestamptz default now());
alter table categories enable row level security;
alter table products enable row level security;
create policy "todos ven categorias" on categories for select using (true);
create policy "todos ven productos" on products for select using (true);
create policy "dueno edita categorias" on categories for all to authenticated using (true) with check (true);
create policy "dueno edita productos" on products for all to authenticated using (true) with check (true);
insert into storage.buckets (id,name,public) values ('products','products',true) on conflict do nothing;
create policy "todos ven fotos" on storage.objects for select using (bucket_id='products');
create policy "dueno sube fotos" on storage.objects for all to authenticated using (bucket_id='products') with check (bucket_id='products');
insert into categories(name) values ('Navidad'),('Hogar'),('Juguetes'),('Accesorios'),('Regalos');
