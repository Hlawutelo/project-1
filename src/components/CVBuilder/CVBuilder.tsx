import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, FileText, User, Briefcase, GraduationCap, Award, Code, Globe, Trophy, Users } from 'lucide-react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { LanguagesForm } from './LanguagesForm';
import { AchievementsForm } from './AchievementsForm';
import { ReferencesForm } from './ReferencesForm';
import { CVPreview } from './CVPreview';
import { CVData } from '../../types/cv';
import { apiService } from '../../services/api';

export const CVBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    references: [],
    template: 'modern',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'references', label: 'References', icon: Users },
  ];

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    try {
      const data = await apiService.getCV();
      if (data) {
        setCvData(data);
      }
    } catch (error) {
      console.error('Failed to load CV:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await apiService.saveCV(cvData);
      setMessage('CV saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save CV. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      await apiService.downloadCV();
    } catch (error) {
      console.error('Failed to download CV:', error);
      alert('Failed to download CV. Please try again.');
    }
  };

  const updateCVData = (section: keyof CVData, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data,
      updatedAt: new Date(),
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={cvData.personalInfo}
            onChange={(data) => updateCVData('personalInfo', data)}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            data={cvData.experience}
            onChange={(data) => updateCVData('experience', data)}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={cvData.education}
            onChange={(data) => updateCVData('education', data)}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={cvData.skills}
            onChange={(data) => updateCVData('skills', data)}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={cvData.projects}
            onChange={(data) => updateCVData('projects', data)}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            data={cvData.certifications}
            onChange={(data) => updateCVData('certifications', data)}
          />
        );
      case 'languages':
        return (
          <LanguagesForm
            data={cvData.languages}
            onChange={(data) => updateCVData('languages', data)}
          />
        );
      case 'achievements':
        return (
          <AchievementsForm
            data={cvData.achievements}
            onChange={(data) => updateCVData('achievements', data)}
          />
        );
      case 'references':
        return (
          <ReferencesForm
            data={cvData.references}
            onChange={(data) => updateCVData('references', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CV Builder</h2>
          <p className="text-gray-600">Create and customize your professional CV</p>
        </div>
        <div className="flex items-center space-x-3">
          {message && (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-600 text-sm">{message}</p>
            </div>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save CV'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="lg:col-span-1">
            <CVPreview data={cvData} />
          </div>
        )}
      </div>
    </div>
  );
};