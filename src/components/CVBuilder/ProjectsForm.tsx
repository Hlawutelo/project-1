import React from 'react';
import { Plus, Trash2, FileText, ExternalLink, Github } from 'lucide-react';
import { Project } from '../../types/cv';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      current: false,
      url: '',
      github: '',
      highlights: [''],
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(data.map(project => project.id === id ? { ...project, [field]: value } : project));
  };

  const removeProject = (id: string) => {
    onChange(data.filter(project => project.id !== id));
  };

  const addHighlight = (id: string) => {
    const project = data.find(p => p.id === id);
    if (project) {
      updateProject(id, 'highlights', [...project.highlights, '']);
    }
  };

  const updateHighlight = (id: string, index: number, value: string) => {
    const project = data.find(p => p.id === id);
    if (project) {
      const newHighlights = [...project.highlights];
      newHighlights[index] = value;
      updateProject(id, 'highlights', newHighlights);
    }
  };

  const removeHighlight = (id: string, index: number) => {
    const project = data.find(p => p.id === id);
    if (project && project.highlights.length > 1) {
      const newHighlights = project.highlights.filter((_, i) => i !== index);
      updateProject(id, 'highlights', newHighlights);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Projects
        </h3>
        <button
          onClick={addProject}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {data.map((project) => (
        <div key={project.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Project Entry</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="E-commerce Platform"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="month"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="month"
                value={project.endDate}
                onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                disabled={project.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                checked={project.current}
                onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Currently working on this project</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the project, its purpose, and your role..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ExternalLink className="w-4 h-4 inline mr-1" />
                Live URL
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://project-demo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub Repository
              </label>
              <input
                type="url"
                value={project.github}
                onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Key Highlights</label>
              <button
                onClick={() => addHighlight(project.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Highlight
              </button>
            </div>
            {project.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => updateHighlight(project.id, index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe a key feature or achievement..."
                />
                {project.highlights.length > 1 && (
                  <button
                    onClick={() => removeHighlight(project.id, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to showcase your work.</p>
        </div>
      )}
    </div>
  );
};