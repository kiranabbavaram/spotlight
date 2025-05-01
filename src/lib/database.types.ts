export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          email: string
          bio: string | null
          avatar_url: string | null
          skills: string[] | null
          experience: Json[] | null
          education: Json[] | null
          hobbies: string[] | null
          social_links: Json | null
          template_id: string | null
          color_scheme: string | null
          is_public: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email: string
          bio?: string | null
          avatar_url?: string | null
          skills?: string[] | null
          experience?: Json[] | null
          education?: Json[] | null
          hobbies?: string[] | null
          social_links?: Json | null
          template_id?: string | null
          color_scheme?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email?: string
          bio?: string | null
          avatar_url?: string | null
          skills?: string[] | null
          experience?: Json[] | null
          education?: Json[] | null
          hobbies?: string[] | null
          social_links?: Json | null
          template_id?: string | null
          color_scheme?: string | null
          is_public?: boolean
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          screenshots: string[] | null
          technologies: string[] | null
          demo_url: string | null
          repo_url: string | null
          status: 'active' | 'completed' | 'archived'
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          screenshots?: string[] | null
          technologies?: string[] | null
          demo_url?: string | null
          repo_url?: string | null
          status?: 'active' | 'completed' | 'archived'
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          screenshots?: string[] | null
          technologies?: string[] | null
          demo_url?: string | null
          repo_url?: string | null
          status?: 'active' | 'completed' | 'archived'
          is_public?: boolean
        }
      }
      templates: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          preview_url: string
          is_premium: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          preview_url: string
          is_premium?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          preview_url?: string
          is_premium?: boolean
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          theme_preference: 'light' | 'dark' | 'system'
          email_notifications: boolean
          portfolio_url_slug: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          theme_preference?: 'light' | 'dark' | 'system'
          email_notifications?: boolean
          portfolio_url_slug?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          theme_preference?: 'light' | 'dark' | 'system'
          email_notifications?: boolean
          portfolio_url_slug?: string | null
        }
      }
    }
  }
}