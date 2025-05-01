/*
  # Initial Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - Linked to Clerk user ID
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `full_name` (text)
      - `email` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `skills` (text array)
      - `experience` (jsonb array)
      - `education` (jsonb array)
      - `hobbies` (text array)
      - `social_links` (jsonb)
      - `template_id` (uuid, foreign key)
      - `color_scheme` (text)
      - `is_public` (boolean)

    - `projects`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `screenshots` (text array)
      - `technologies` (text array)
      - `demo_url` (text)
      - `repo_url` (text)
      - `status` (enum: active, completed, archived)
      - `is_public` (boolean)

    - `templates`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `description` (text)
      - `preview_url` (text)
      - `is_premium` (boolean)

    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `theme_preference` (enum: light, dark, system)
      - `email_notifications` (boolean)
      - `portfolio_url_slug` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public access to public profiles and projects
*/

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');

-- Create tables
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT,
  email TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[],
  experience JSONB[],
  education JSONB[],
  hobbies TEXT[],
  social_links JSONB,
  template_id UUID REFERENCES templates(id),
  color_scheme TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  screenshots TEXT[],
  technologies TEXT[],
  demo_url TEXT,
  repo_url TEXT,
  status project_status NOT NULL DEFAULT 'active',
  is_public BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  theme_preference theme_preference NOT NULL DEFAULT 'system',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  portfolio_url_slug TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can read their own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  TO anon 
  USING (is_public = true);

-- Projects policies
CREATE POLICY "Users can read their own projects" 
  ON projects FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable by everyone" 
  ON projects FOR SELECT 
  TO anon 
  USING (is_public = true);

-- Templates policies
CREATE POLICY "Templates are viewable by everyone" 
  ON templates FOR SELECT 
  TO anon 
  USING (true);

-- User settings policies
CREATE POLICY "Users can read their own settings" 
  ON user_settings FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON user_settings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Insert some default templates
INSERT INTO templates (name, description, preview_url, is_premium) VALUES
('Minimal', 'A clean, minimalist portfolio template', 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Modern', 'Contemporary design with bold elements', 'https://images.pexels.com/photos/5082580/pexels-photo-5082580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Classic', 'Timeless and professional layout', 'https://images.pexels.com/photos/5082581/pexels-photo-5082581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
('Creative', 'Artistic design for creative professionals', 'https://images.pexels.com/photos/5082582/pexels-photo-5082582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
('Corporate', 'Professional design for business portfolios', 'https://images.pexels.com/photos/5082583/pexels-photo-5082583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true);

-- Create functions for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_user_settings
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();