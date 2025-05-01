import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link2, GitHub, Linkedin, Twitter, Globe, Calendar, Clock } from 'lucide-react';

import { getPublicProfile } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Portfolio() {
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        if (!userId) return;
        
        const { profile, projects } = await getPublicProfile(userId);
        
        setProfile(profile);
        setProjects(projects);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setError('This portfolio is not available or is set to private.');
        toast.error('Failed to load portfolio');
      } finally {
        setIsLoading(false);
      }
    }

    loadPortfolio();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Not Available</h1>
          <p className="mt-2 text-slate-600">{error || 'This portfolio is not available or is set to private.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/150'}
              alt={profile.full_name}
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <motion.h1 
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {profile.full_name}
              </motion.h1>
              <p className="mt-2 text-lg text-white/80 max-w-2xl">{profile.bio}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {profile.social_links?.github && (
                  <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">
                    <GitHub className="h-5 w-5" />
                  </a>
                )}
                {profile.social_links?.linkedin && (
                  <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.social_links?.twitter && (
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {profile.social_links?.website && (
                  <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              {/* Skills section */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Experience section */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
                <div className="space-y-4">
                  {profile.experience?.length > 0 ? (
                    profile.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary-200 pl-4 pb-4">
                        <h3 className="text-lg font-medium text-slate-900">{exp.title}</h3>
                        <p className="text-primary-600">{exp.company}</p>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-sm text-slate-600">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No experience listed</p>
                  )}
                </div>
              </div>

              {/* Education section */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education?.length > 0 ? (
                    profile.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary-200 pl-4 pb-4">
                        <h3 className="text-lg font-medium text-slate-900">{edu.degree}</h3>
                        <p className="text-primary-600">{edu.institution}</p>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                          </span>
                        </div>
                        {edu.description && (
                          <p className="mt-2 text-sm text-slate-600">{edu.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No education listed</p>
                  )}
                </div>
              </div>

              {/* Hobbies section */}
              {profile.hobbies?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Hobbies & Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies.map((hobby: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Projects</h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project: any) => (
                  <motion.div 
                    key={project.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-48 bg-slate-200 relative">
                      {project.thumbnail_url ? (
                        <img 
                          src={project.thumbnail_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xl font-bold">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'active' 
                            ? 'bg-primary-100 text-primary-800' 
                            : project.status === 'completed' 
                              ? 'bg-success-100 text-success-800'
                              : 'bg-slate-100 text-slate-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-slate-900">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-3">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies?.map((tech: string, index: number) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {project.demo_url && (
                            <a 
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700"
                            >
                              <Link2 className="h-3 w-3 mr-1" />
                              Demo
                            </a>
                          )}
                          {project.repo_url && (
                            <a 
                              href={project.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700"
                            >
                              <GitHub className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-slate-600">No projects have been added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default Portfolio;