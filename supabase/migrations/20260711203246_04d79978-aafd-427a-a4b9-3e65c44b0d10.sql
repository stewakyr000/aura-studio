
-- Styles library (public read, admin write via service role)
CREATE TABLE public.styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tag text,
  description text,
  preview_url text,
  gradient text,
  tokens text[] DEFAULT '{}',
  config jsonb DEFAULT '{}'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.styles TO anon, authenticated;
GRANT ALL ON public.styles TO service_role;
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Styles are readable by everyone" ON public.styles FOR SELECT USING (true);

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  release_info text,
  song_key text,
  bpm int,
  cover_url text,
  style_id uuid REFERENCES public.styles ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX projects_user_idx ON public.projects(user_id, created_at DESC);

-- Assets
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('audio','video','image','cover')),
  file_url text NOT NULL,
  storage_path text,
  file_name text,
  file_size bigint,
  mime_type text,
  duration_seconds numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own assets" ON public.assets FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX assets_project_idx ON public.assets(project_id);

-- Lyrics
CREATE TABLE public.lyrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  line_index int NOT NULL,
  text text NOT NULL DEFAULT '',
  section text,
  start_seconds numeric,
  end_seconds numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lyrics TO authenticated;
GRANT ALL ON public.lyrics TO service_role;
ALTER TABLE public.lyrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lyrics" ON public.lyrics FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX lyrics_project_idx ON public.lyrics(project_id, line_index);

-- Content items
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('video','photo')),
  title text,
  preview_url text,
  final_url text,
  status text NOT NULL DEFAULT 'idea' CHECK (status IN ('idea','queued','processing','generated','ready','posted','failed')),
  style_id uuid REFERENCES public.styles ON DELETE SET NULL,
  source_asset_id uuid REFERENCES public.assets ON DELETE SET NULL,
  duration_seconds numeric,
  aspect_ratio text,
  metadata jsonb DEFAULT '{}'::jsonb,
  external_job_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own content" ON public.content_items FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX content_items_project_idx ON public.content_items(project_id, created_at DESC);

-- Calendar posts
CREATE TABLE public.calendar_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content_item_id uuid REFERENCES public.content_items ON DELETE SET NULL,
  scheduled_for timestamptz,
  platform text CHECK (platform IN ('tiktok','instagram','youtube','other')),
  caption text,
  status text NOT NULL DEFAULT 'idea' CHECK (status IN ('idea','generated','ready','posted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_posts TO authenticated;
GRANT ALL ON public.calendar_posts TO service_role;
ALTER TABLE public.calendar_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own calendar" ON public.calendar_posts FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX calendar_project_idx ON public.calendar_posts(project_id, scheduled_for);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER tg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER tg_lyrics_updated BEFORE UPDATE ON public.lyrics
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER tg_content_items_updated BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER tg_calendar_updated BEFORE UPDATE ON public.calendar_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Seed styles
INSERT INTO public.styles (slug, name, tag, description, gradient, tokens, sort_order) VALUES
('vhs', 'VHS Underground', 'Analog · Raw', 'Grain, scanlines, and shutter jitter. The tape you found in your father''s attic. For songs that bruise.', 'from-orange-900/50 via-rose-950/30 to-zinc-950', ARRAY['grain','distortion','nostalgic','raw'], 1),
('cinema', 'Late Night Cinema', 'Emotional · 35mm', 'Slow pushes, letterbox bars, warm rolloff. Songs sung to the passenger window at 2 a.m.', 'from-slate-800/50 via-neutral-900/40 to-background', ARRAY['emotional','film','slow','letterbox'], 2),
('ritual', 'Dark Ritual', 'Sacred · Mysterious', 'Candlelight, smoke, and inverted crosses of light. For tracks that feel like a summoning.', 'from-red-950/50 via-amber-950/20 to-black', ARRAY['mysterious','spiritual','atmospheric'], 3),
('bedroom', 'Bedroom Artist', 'Intimate · Handheld', 'Fairy lights, unmade bed, phone-in-hand. Confessional and impossible to fake.', 'from-amber-900/40 via-stone-900/30 to-background', ARRAY['intimate','authentic','handheld'], 4),
('internet', 'Internet Discovery', 'Native · Fan-page', 'Fast cuts, bold captions, algorithm-fluent. Designed to be discovered, not scrolled past.', 'from-cyan-950/40 via-fuchsia-950/20 to-zinc-950', ARRAY['tiktok','fan-page','fast','bold'], 5),
('editorial', 'High Editorial', 'Magazine · Cold', 'Serif type, cropped stills, gallery silence. When your record deserves a spread.', 'from-zinc-800/60 via-neutral-900/40 to-background', ARRAY['editorial','typographic','minimal'], 6);
