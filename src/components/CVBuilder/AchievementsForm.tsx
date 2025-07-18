import React from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { Achievement } from '../../types/cv';
import { v4 as uuidv4 } from 'uuid';

interface AchievementsFormProps {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export const AchievementsForm: React.FC<AchievementsFormProps> = ({ data, onChange }) => {
  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: uuidv4(),
      title: '',
      description: '',
      date: '',
      category: '',
    };
    onChange([...data, newAchievement]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: any) => {
    onChange(data.map(achievement => achievement.id === id ? { ...achievement, [field]: value } : achievement));
  };

  const removeAchievement = (id: string) => {
    onChange(data.filter(achievement => achievement.id !== id));
  };

  const categories = [
    'Professional',
    'Academic',
    'Leadership',
    'Technical',
    'Community',
    'Awards',
    'Publications',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Achievements & Awards
        </h3>
        <button
          onClick={addAchievement}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {data.map((achievement) => (
        <div key={achievement.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Achievement Entry</h4>
            <button
              onClick={() => removeAchievement(achievement.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={achievement.title}
                onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Employee of the Year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={achievement.category}
                onChange={(e) => updateAchievement(achievement.id, 'category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="month"
                value={achievement.date}
                onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={achievement.description}
              onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the achievement and its significance..."
            />
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No achievements added yet.</p>
          <p className="text-sm">Click "Add Achievement" to highlight your accomplishments.</p>
        </div>
      )}
    </div>
  );
};