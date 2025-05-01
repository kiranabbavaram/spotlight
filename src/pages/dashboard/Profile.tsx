import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Save, Upload, Trash2, PlusCircle, MinusCircle, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase, getUserProfile } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Profile() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    id: '',
    full_name: '',
    email: '',
    bio: '',
    avatar_url: '',
    skills: [],
    experience: [],
    education: [],
    hobbies: [],
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    },
    is_public: true
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        if (user?.id) {
          const data = await getUserProfile(user.id);
          if (data) {
            setProfile(data);
          } else {
            // Create a new profile if it doesn't exist
            setProfile({
              ...profile,
              id: user.id,
              full_name: `${user.firstName} ${user.lastName}`,
              email: user.primaryEmailAddress?.emailAddress || '',
              avatar_url: user.imageUrl || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Upsert profile (insert if not exists, update if exists)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = value;
    setProfile({ ...profile, skills: updatedSkills });
  };

  const addSkill = () => {
    setProfile({ ...profile, skills: [...profile.skills, ''] });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...profile.skills];
    updatedSkills.splice(index, 1);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...profile.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProfile({ ...profile, experience: updatedExperience });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        { title: '', company: '', start_date: '', end_date: '', description: '' }
      ]
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...profile.experience];
    updatedExperience.splice(index, 1);
    setProfile({ ...profile, experience: updatedExperience });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setProfile({ ...profile, education: updatedEducation });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { degree: '', institution: '', start_date: '', end_date: '', description: '' }
      ]
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...profile.education];
    updatedEducation.splice(index, 1);
    setProfile({ ...profile, education: updatedEducation });
  };

  const handleHobbyChange = (index: number, value: string) => {
    const updatedHobbies = [...profile.hobbies];
    updatedHobbies[index] = value;
    setProfile({ ...profile, hobbies: updatedHobbies });
  };

  const addHobby = () => {
    setProfile({ ...profile, hobbies: [...profile.hobbies, ''] });
  };

  const removeHobby = (index: number) => {
    const updatedHobbies = [...profile.hobbies];
    updatedHobbies.splice(index, 1);
    setProfile({ ...profile, hobbies: updatedHobbies });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfile({
      ...profile,
      social_links: {
        ...profile.social_links,
        [platform]: value
      }
    });
  };

  const handlePublicToggle = () => {
    setProfile({ ...profile, is_public: !profile.is_public });
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
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
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
              Save Profile
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full text-white hover:bg-primary-700">
                <Upload className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.is_public}
                    onChange={handlePublicToggle}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-700">Make my profile public</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Bio</h3>
          <textarea
            name="bio"
            rows={4}
            value={profile.bio || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          ></textarea>
        </div>

        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-slate-900 mb-4">Skills</h3>
          <div className="space-y-2">
            {(profile.skills || []).map((skill: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="e.g., JavaScript, React, UI Design"
                />
                <button 
                  onClick={() => removeSkill(index)}
                  className="p-1 text-slate-500 hover:text-error-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addSkill}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-slate-900 mb-4">Experience</h3>
          <div className="space-y-6">
            {(profile.experience || []).map((exp: any, index: number) => (
              <div key={index} className="p-4 border border-slate-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-slate-900">Experience #{index + 1}</h4>
                  <button 
                    onClick={() => removeExperience(index)}
                    className="p-1 text-slate-500 hover:text-error-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exp.start_date || ''}
                      onChange={(e) => handleExperienceChange(index, 'start_date', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.end_date || ''}
                      onChange={(e) => handleExperienceChange(index, 'end_date', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description || ''}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Experience
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-slate-900 mb-4">Education</h3>
          <div className="space-y-6">
            {(profile.education || []).map((edu: any, index: number) => (
              <div key={index} className="p-4 border border-slate-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-slate-900">Education #{index + 1}</h4>
                  <button 
                    onClick={() => removeEducation(index)}
                    className="p-1 text-slate-500 hover:text-error-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={edu.start_date || ''}
                      onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={edu.end_date || ''}
                      onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={edu.description || ''}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Education
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="p-6 border-b border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-slate-900 mb-4">Hobbies & Interests</h3>
          <div className="space-y-2">
            {(profile.hobbies || []).map((hobby: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={hobby}
                  onChange={(e) => handleHobbyChange(index, e.target.value)}
                  className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="e.g., Photography, Hiking, Reading"
                />
                <button 
                  onClick={() => removeHobby(index)}
                  className="p-1 text-slate-500 hover:text-error-600"
                >
                  <MinusCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addHobby}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Hobby
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-medium text-slate-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                GitHub
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={profile.social_links?.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                LinkedIn
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={profile.social_links?.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Twitter
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={profile.social_links?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Personal Website
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={profile.social_links?.website || ''}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;