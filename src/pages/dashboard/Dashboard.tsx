import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { CirclePlus, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { getUserProjects, getUserProfile } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Dashboard() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (user?.id) {
          const [projectsData, profileData] = await Promise.all([
            getUserProjects(user.id),
            getUserProfile(user.id)
          ]);
          
          setProjects(projectsData || []);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  // Calculate stats
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const profileCompletion = calculateProfileCompletion(profile);

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
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link to="/dashboard/projects/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
          <CirclePlus className="w-4 h-4 mr-2" />
          New Project
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div 
          className="bg-white rounded-lg shadow p-5"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Projects</p>
              <h3 className="mt-1 text-3xl font-semibold text-slate-900">{activeProjects}</h3>
            </div>
            <div className="p-2 bg-primary-50 rounded-full">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/projects" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all projects
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow p-5"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed Projects</p>
              <h3 className="mt-1 text-3xl font-semibold text-slate-900">{completedProjects}</h3>
            </div>
            <div className="p-2 bg-success-50 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/projects" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all projects
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow p-5"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600">Profile Completion</p>
              <h3 className="mt-1 text-3xl font-semibold text-slate-900">{profileCompletion}%</h3>
            </div>
            <div className="p-2 bg-warning-50 rounded-full">
              <AlertCircle className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/profile" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              Complete your profile
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Recent Projects</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {projects.length > 0 ? (
            projects.slice(0, 5).map(project => (
              <Link key={project.id} to={`/dashboard/projects/${project.id}`} className="block hover:bg-slate-50">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {project.thumbnail_url ? (
                        <img 
                          src={project.thumbnail_url} 
                          alt={project.title} 
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-200 flex items-center justify-center text-slate-500">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-slate-900">{project.title}</h4>
                        <p className="text-sm text-slate-500">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
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
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-500">No projects yet. Create your first project!</p>
              <Link 
                to="/dashboard/projects/new" 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <CirclePlus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </div>
          )}
        </div>
        {projects.length > 5 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Link 
              to="/dashboard/projects" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center"
            >
              View all projects
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  
  const fields = [
    'full_name',
    'bio',
    'avatar_url',
    'skills',
    'experience',
    'education',
    'social_links'
  ];
  
  const completedFields = fields.filter(field => {
    const value = profile[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0;
    }
    return !!value;
  }).length;
  
  return Math.round((completedFields / fields.length) * 100);
}

export default Dashboard;