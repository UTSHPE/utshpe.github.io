-- Holds the Instagram access token for the instagram-feed edge function, which
-- refreshes it weekly (tokens expire after 60 days).
-- Row level security is on with no policies, so only the service role (the edge
-- function) can read or write it; the site's public key cannot.
create table if not exists public.instagram_token (
  id int primary key default 1 check (id = 1),
  access_token text not null,
  refreshed_at timestamptz not null default now()
);

alter table public.instagram_token enable row level security;
