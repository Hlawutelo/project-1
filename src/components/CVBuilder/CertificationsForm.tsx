import React from 'react';
import { Plus, Trash2, Award, ExternalLink } from 'lucide-react';
import { Certification } from '../../types/cv';
import { v4 as uuidv4 } from 'uuid';

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const addCertification = () => {
    const newCertification: Certification = {
      id: uuidv4(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    onChange([...data, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    onChange(data.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const removeCertification = (id: string) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Certifications
        </h3>
        <button
          onClick={addCertification}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {data.map((certification) => (
        <div key={certification.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Certification Entry</h4>
            <button
              onClick={() => removeCertification(certification.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
              <input
                type="text"
                value={certification.name}
                onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
              <input
                type="text"
                value={certification.issuer}
                onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Amazon Web Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input
                type="month"
                value={certification.issueDate}
                onChange={(e) => updateCertification(certification.id, 'issueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
              <input
                type="month"
                value={certification.expiryDate}
                onChange={(e) => updateCertification(certification.id, 'expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID (Optional)</label>
              <input
                type="text"
                value={certification.credentialId}
                onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ABC123XYZ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ExternalLink className="w-4 h-4 inline mr-1" />
                Verification URL (Optional)
              </label>
              <input
                type="url"
                value={certification.url}
                onChange={(e) => updateCertification(certification.id, 'url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://verify.certification.com"
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to showcase your credentials.</p>
        </div>
      )}
    </div>
  );
};