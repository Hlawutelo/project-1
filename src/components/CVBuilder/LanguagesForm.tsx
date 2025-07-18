import React from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import { Language } from '../../types/cv';

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const addLanguage = () => {
    const newLanguage: Language = {
      name: '',
      proficiency: 'Conversational',
    };
    onChange([...data, newLanguage]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeLanguage = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Languages
        </h3>
        <button
          onClick={addLanguage}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Language</span>
        </button>
      </div>

      {data.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {data.map((language, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    value={language.name}
                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="English, Spanish, French..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeLanguage(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet.</p>
          <p className="text-sm">Click "Add Language" to showcase your language skills.</p>
        </div>
      )}
    </div>
  );
};