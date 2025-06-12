import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Save, Bell, Palette, Globe, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Settings() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme_preference: 'system' as 'light' | 'dark' | 'system',
    email_notifications: true,
    portfolio_url_slug: '',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            setSettings({
              theme_preference: data.theme_preference,
              email_notifications: data.email_notifications,
              portfolio_url_slug: data.portfolio_url_slug || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [user?.id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Account Settings */}
        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Account</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Portfolio URL Slug
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  spotlight.com/portfolio/
                </span>
                <input
                  type="text"
                  value={settings.portfolio_url_slug}
                  onChange={(e) => handleChange('portfolio_url_slug', e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="your-username"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                This will be your public portfolio URL. Leave empty to use your user ID.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <Palette className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Theme Preference
              </label>
              <div className="mt-2 space-y-2">
                {[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="theme_preference"
                      value={option.value}
                      checked={settings.theme_preference === option.value}
                      onChange={(e) => handleChange('theme_preference', e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <span className="ml-2 text-sm text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Choose how Spotlight appears to you. System uses your device's theme.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                <p className="text-sm text-slate-500">
                  Receive email updates about your portfolio and projects
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => handleChange('email_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Privacy</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Portfolio Visibility</h4>
              <p className="text-sm text-slate-600 mb-3">
                Control who can see your portfolio. You can manage this setting in your Profile page.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/profile'}
                className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Manage Privacy Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;