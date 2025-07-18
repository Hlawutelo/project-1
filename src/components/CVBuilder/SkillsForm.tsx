import React from 'react';
import { Plus, Trash2, Code } from 'lucide-react';
import { SkillCategory, Skill } from '../../types/cv';

interface SkillsFormProps {
  data: SkillCategory[];
  onChange: (data: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const addCategory = () => {
    const newCategory: SkillCategory = {
      category: '',
      skills: [{ name: '', level: 'Intermediate' }],
    };
    onChange([...data, newCategory]);
  };

  const updateCategory = (index: number, field: keyof SkillCategory, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addSkill = (categoryIndex: number) => {
    const newData = [...data];
    newData[categoryIndex].skills.push({ name: '', level: 'Intermediate' });
    onChange(newData);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, field: keyof Skill, value: any) => {
    const newData = [...data];
    newData[categoryIndex].skills[skillIndex] = {
      ...newData[categoryIndex].skills[skillIndex],
      [field]: value,
    };
    onChange(newData);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const newData = [...data];
    if (newData[categoryIndex].skills.length > 1) {
      newData[categoryIndex].skills = newData[categoryIndex].skills.filter((_, i) => i !== skillIndex);
      onChange(newData);
    }
  };

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Skills
        </h3>
        <button
          onClick={addCategory}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {data.map((category, categoryIndex) => (
        <div key={categoryIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={category.category}
                onChange={(e) => updateCategory(categoryIndex, 'category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Programming Languages, Frameworks, Tools"
              />
            </div>
            <button
              onClick={() => removeCategory(categoryIndex)}
              className="text-red-600 hover:text-red-800 mt-6"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <button
                onClick={() => addSkill(categoryIndex)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Skill
              </button>
            </div>

            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(categoryIndex, skillIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Skill name"
                  />
                </div>
                <div>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(categoryIndex, skillIndex, 'level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={skill.years || ''}
                    onChange={(e) => updateSkill(categoryIndex, skillIndex, 'years', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Years"
                    min="0"
                    max="50"
                  />
                  {category.skills.length > 1 && (
                    <button
                      onClick={() => removeSkill(categoryIndex, skillIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Click "Add Category" to organize your skills.</p>
        </div>
      )}
    </div>
  );
};