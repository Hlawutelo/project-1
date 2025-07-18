import React from 'react';
import { Plus, Trash2, Users, Mail, Phone } from 'lucide-react';
import { Reference } from '../../types/cv';
import { v4 as uuidv4 } from 'uuid';

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

export const ReferencesForm: React.FC<ReferencesFormProps> = ({ data, onChange }) => {
  const addReference = () => {
    const newReference: Reference = {
      id: uuidv4(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    };
    onChange([...data, newReference]);
  };

  const updateReference = (id: string, field: keyof Reference, value: any) => {
    onChange(data.map(ref => ref.id === id ? { ...ref, [field]: value } : ref));
  };

  const removeReference = (id: string) => {
    onChange(data.filter(ref => ref.id !== id));
  };

  const relationships = [
    'Direct Supervisor',
    'Manager',
    'Colleague',
    'Client',
    'Professor',
    'Mentor',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          References
        </h3>
        <button
          onClick={addReference}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reference</span>
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Make sure to ask for permission before adding someone as a reference. 
          Consider adding "References available upon request\" to your CV instead of listing specific contacts.
        </p>
      </div>

      {data.map((reference) => (
        <div key={reference.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Reference Entry</h4>
            <button
              onClick={() => removeReference(reference.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={reference.name}
                onChange={(e) => updateReference(reference.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={reference.position}
                onChange={(e) => updateReference(reference.id, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Senior Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={reference.company}
                onChange={(e) => updateReference(reference.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tech Company Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <select
                value={reference.relationship}
                onChange={(e) => updateReference(reference.id, 'relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select relationship</option>
                {relationships.map(relationship => (
                  <option key={relationship} value={relationship}>{relationship}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={reference.email}
                onChange={(e) => updateReference(reference.id, 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={reference.phone}
                onChange={(e) => updateReference(reference.id, 'phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No references added yet.</p>
          <p className="text-sm">Click "Add Reference" to include professional references.</p>
          <p className="text-xs mt-2 text-gray-400">
            Tip: Consider adding "References available upon request" instead
          </p>
        </div>
      )}
    </div>
  );
};