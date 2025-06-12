/*
  # Database Schema Migration

  This migration creates the core tables for the Spotlight portfolio platform.

  ## New Tables
  1. **templates** - Portfolio template definitions
     - `id` (uuid, primary key)
     - `name` (text, template name)
     - `description` (text, template description)
     - `preview_url` (text, preview image URL)
     - `is_premium` (boolean, premium template flag)
     - `created_at` (timestamptz, creation timestamp)

  2. **profiles** - User profile information (extends existing user_profiles)
     - `id` (text, primary key, matches Clerk user ID)
     - `full_name` (text, user's full name)
     - `email` (text, user's email)
     - `bio` (text, user biography)
     - `avatar_url` (text, profile picture URL)
     - `skills` (text[], array of skills)
     - `experience` (jsonb[], work experience entries)
     - `education` (jsonb[], education entries)
     - `hobbies` (text[], hobbies and interests)
     - `social_links` (jsonb, social media links)
     - `template_id` (text, selected template)
     - `color_scheme` (text, color preferences)
     - `is_public` (boolean, public visibility)
     - `created_at`, `updated_at` (timestamptz, timestamps)

  3. **projects** - User project portfolio (extends existing projects table)
     - Enhanced with additional fields for portfolio display
     - `screenshots` (text[], project screenshots)
     - `status` (enum, project status)
     - `is_public` (boolean, public visibility)

  4. **user_settings** - User application settings
     - `id` (uuid, primary key)
     - `user_id` (text, references user)
     - `theme_preference` (enum, UI theme)
     - `email_notifications` (boolean, notification preferences)
     - `portfolio_url_slug` (text, custom URL slug)
     - `created_at`, `updated_at` (timestamptz, timestamps)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Public profiles and projects are viewable by anonymous users
  - Templates are publicly viewable

  ## Functions and Triggers
  - Automatic `updated_at` timestamp updates
  - Helper function for requesting user ID
*/

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create helper function for getting requesting user ID
CREATE OR REPLACE FUNCTION requesting_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'user_id')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  description text,
  preview_url text NOT NULL,
  is_premium boolean NOT NULL DEFAULT false
);

-- Create enhanced profiles table (compatible with existing user_profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text,
  email text NOT NULL,
  bio text,
  avatar_url text,
  skills text[],
  experience jsonb[],
  education jsonb[],
  hobbies text[],
  social_links jsonb,
  template_id text,
  color_scheme text,
  is_public boolean NOT NULL DEFAULT true
);

-- Enhance existing projects table with additional fields
DO $$
BEGIN
  -- Add screenshots column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'screenshots'
  ) THEN
    ALTER TABLE projects ADD COLUMN screenshots text[];
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE projects ADD COLUMN status project_status NOT NULL DEFAULT 'active';
  END IF;

  -- Add is_public column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_public boolean NOT NULL DEFAULT true;
  END IF;

  -- Add demo_url column if it doesn't exist (rename from project_url)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'demo_url'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'project_url'
    ) THEN
      ALTER TABLE projects RENAME COLUMN project_url TO demo_url;
    ELSE
      ALTER TABLE projects ADD COLUMN demo_url text;
    END IF;
  END IF;

  -- Add repo_url column if it doesn't exist (rename from github_url)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'repo_url'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'github_url'
    ) THEN
      ALTER TABLE projects RENAME COLUMN github_url TO repo_url;
    ELSE
      ALTER TABLE projects ADD COLUMN repo_url text;
    END IF;
  END IF;

  -- Add thumbnail_url column if it doesn't exist (rename from image_url)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'thumbnail_url'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'image_url'
    ) THEN
      ALTER TABLE projects RENAME COLUMN image_url TO thumbnail_url;
    ELSE
      ALTER TABLE projects ADD COLUMN thumbnail_url text;
    END IF;
  END IF;
END $$;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  theme_preference theme_preference NOT NULL DEFAULT 'system',
  email_notifications boolean NOT NULL DEFAULT true,
  portfolio_url_slug text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON templates(is_premium);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can read their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON templates;
DROP POLICY IF EXISTS "Users can read their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;

-- Create RLS policies for profiles
CREATE POLICY "Users can read their own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (id = requesting_user_id());

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (id = requesting_user_id());

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (id = requesting_user_id());

CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  TO anon 
  USING (is_public = true);

-- Create RLS policies for projects
CREATE POLICY "Users can read their own projects" 
  ON projects FOR SELECT 
  TO authenticated 
  USING (user_id = requesting_user_id());

CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = requesting_user_id());

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (user_id = requesting_user_id());

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (user_id = requesting_user_id());

CREATE POLICY "Public projects are viewable by everyone" 
  ON projects FOR SELECT 
  TO anon 
  USING (is_public = true);

-- Create RLS policies for templates
CREATE POLICY "Templates are viewable by everyone" 
  ON templates FOR SELECT 
  TO anon 
  USING (true);

-- Create RLS policies for user_settings
CREATE POLICY "Users can read their own settings" 
  ON user_settings FOR SELECT 
  TO authenticated 
  USING (user_id = requesting_user_id());

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR UPDATE 
  TO authenticated 
  USING (user_id = requesting_user_id());

CREATE POLICY "Users can insert their own settings" 
  ON user_settings FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = requesting_user_id());

-- Insert default templates
INSERT INTO templates (name, description, preview_url, is_premium) VALUES
('Minimal', 'A clean, minimalist portfolio template', 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Modern', 'Contemporary design with bold elements', 'https://images.pexels.com/photos/5082580/pexels-photo-5082580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Classic', 'Timeless and professional layout', 'https://images.pexels.com/photos/5082581/pexels-photo-5082581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Creative', 'Artistic design for creative professionals', 'https://images.pexels.com/photos/5082582/pexels-photo-5082582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
('Corporate', 'Professional design for business portfolios', 'https://images.pexels.com/photos/5082583/pexels-photo-5082583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true)
ON CONFLICT DO NOTHING;

-- Create function for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_projects ON projects;
CREATE TRIGGER set_updated_at_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_user_settings ON user_settings;
CREATE TRIGGER set_updated_at_user_settings
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();