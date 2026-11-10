-- ==============================================================================
-- PROJECTLINK PLATFORM — SUPABASE PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor and click RUN.
-- It will automatically provision all tables, relations, triggers, and Row Level Security (RLS) policies.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT UNIQUE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  title TEXT DEFAULT '',
  university TEXT DEFAULT '',
  location TEXT DEFAULT 'Toshkent, O‘zbekiston',
  age INTEGER,
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  github TEXT DEFAULT '',
  telegram TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  avatar_initials TEXT DEFAULT 'PL',
  status TEXT DEFAULT 'Active',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table (11 Strategic Directions)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_initials TEXT DEFAULT 'PL',
  role_needed TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  location TEXT DEFAULT 'Toshkent',
  deadline DATE,
  status TEXT DEFAULT 'Open', -- 'Open' or 'Closed'
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project Members Table (Membership tracking)
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- e.g. 'Lead', 'Frontend Developer', 'UI Designer', etc.
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_handle TEXT,
  role TEXT NOT NULL,
  note TEXT,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Project Internal Chat Messages (Discord-style channels)
CREATE TABLE IF NOT EXISTS public.project_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'umumiy-chat',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'A‘zo',
  user_initials TEXT DEFAULT 'PL',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — ROCK SOLID CYBERSECURITY
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
-- Anyone (even unauthenticated) can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- --- PROJECTS POLICIES ---
-- Anyone can view projects
CREATE POLICY "Projects are viewable by everyone" 
  ON public.projects FOR SELECT 
  USING (true);

-- Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = owner_id);

-- Only project owners or admins can update their project
CREATE POLICY "Project owners can update their projects" 
  ON public.projects FOR UPDATE 
  USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only project owners or admins can delete their project
CREATE POLICY "Project owners can delete their projects" 
  ON public.projects FOR DELETE 
  USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --- APPLICATIONS POLICIES ---
-- Users can see their own applications, and project owners can see applications to their projects
CREATE POLICY "Users and project owners can view relevant applications" 
  ON public.applications FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can submit applications
CREATE POLICY "Authenticated users can submit applications" 
  ON public.applications FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Only project owners can update application status (accept/reject)
CREATE POLICY "Project owners can update application status" 
  ON public.applications FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --- PROJECT MEMBERS POLICIES ---
-- Anyone can see members of a project
CREATE POLICY "Project members are viewable by everyone" 
  ON public.project_members FOR SELECT 
  USING (true);

-- Project owners can add or remove members
CREATE POLICY "Project owners can manage members" 
  ON public.project_members FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --- PROJECT MESSAGES (DISCORD CHAT) POLICIES ---
-- Project members and owners can read project chat messages
CREATE POLICY "Project members can read chat messages" 
  ON public.project_messages FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.applications WHERE project_id = project_messages.project_id AND user_id = auth.uid() AND status = 'accepted') OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Project members can post messages
CREATE POLICY "Project members can post chat messages" 
  ON public.project_messages FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.applications WHERE project_id = project_messages.project_id AND user_id = auth.uid() AND status = 'accepted') OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_handle TEXT;
  v_initials TEXT;
BEGIN
  v_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  v_handle := COALESCE(new.raw_user_meta_data->>'handle', split_part(new.email, '@', 1));
  v_initials := UPPER(SUBSTRING(v_name, 1, 2));

  INSERT INTO public.profiles (
    id,
    name,
    email,
    handle,
    avatar_initials,
    role,
    title,
    university,
    location,
    bio,
    skills,
    status,
    is_verified
  ) VALUES (
    new.id,
    v_name,
    new.email,
    v_handle,
    v_initials,
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    COALESCE(new.raw_user_meta_data->>'title', 'Talaba / Yosh Dasturchi'),
    COALESCE(new.raw_user_meta_data->>'university', 'Universitet / Kollej'),
    'Toshkent, O‘zbekiston',
    'ProjectLink yoshlar tarmog‘i a’zosi.',
    ARRAY['Loyiha ishtirokchisi'],
    'Active',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Supabase Realtime for Project Messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;

