insert into public.saved_visualizations (
  id,
  user_id,
  title,
  algorithm_slug,
  route,
  config,
  notes,
  is_public
)
select
  gen_random_uuid(),
  id,
  'Bubble Sort Demo',
  'bubble-sort',
  '/visualizer/sorting/bubble-sort',
  '{"array":[5,1,4,2,8],"speed":500}'::jsonb,
  'Starter visualization seeded for local development.',
  true
from auth.users
limit 1
on conflict do nothing;
