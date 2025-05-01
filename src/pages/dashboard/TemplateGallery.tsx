import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { toast } from 'sonner';

import { getTemplates } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function TemplateGallery() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      setSelectedTemplate(templateId);
      toast.success('Template selected successfully');
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to select template');
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Template Gallery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${
              selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''
            }`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {template.is_premium && (
              <div className="absolute top-2 right-2 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </span>
              </div>
            )}
            <div className="aspect-w-16 aspect-h-9 bg-slate-100">
              <img
                src={template.preview_url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-slate-900">{template.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{template.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    selectedTemplate === template.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-white bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {selectedTemplate === template.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Template'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No templates available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;