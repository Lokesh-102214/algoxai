
-- ai_chat_history
CREATE TABLE public.ai_chat_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  agent text NOT NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  page_context text,
  was_helpful boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own chat history" ON public.ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat history" ON public.ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat history" ON public.ai_chat_history FOR UPDATE USING (auth.uid() = user_id);

-- user_topic_progress
CREATE TABLE public.user_topic_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_slug text NOT NULL,
  problems_solved int NOT NULL DEFAULT 0,
  avg_time_seconds int NOT NULL DEFAULT 0,
  quiz_score int NOT NULL DEFAULT 0,
  last_activity timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own progress" ON public.user_topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_topic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_topic_progress FOR UPDATE USING (auth.uid() = user_id);

-- learning_paths
CREATE TABLE public.learning_paths (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommended_path jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own paths" ON public.learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own paths" ON public.learning_paths FOR UPDATE USING (auth.uid() = user_id);

-- ai_sessions
CREATE TABLE public.ai_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start timestamptz NOT NULL DEFAULT now(),
  messages_count int NOT NULL DEFAULT 0,
  agents_used jsonb NOT NULL DEFAULT '[]'::jsonb
);
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own sessions" ON public.ai_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.ai_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.ai_sessions FOR UPDATE USING (auth.uid() = user_id);
