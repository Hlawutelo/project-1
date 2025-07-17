import React, { useState } from 'react';
import { Zap, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const AutoApply: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAutoApply = async () => {
    setIsRunning(true);
    setError('');
    setResults(null);

    try {
      const response = await apiService.autoApply();
      setResults(response);
    } catch (err: any) {
      setError(err.message || 'Auto-apply failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Auto-Apply</h3>
          <p className="text-gray-600">Let AI apply to high-match jobs automatically</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">How it works:</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Finds jobs with 85%+ match score</li>
            <li>• Generates personalized cover letters</li>
            <li>• Submits applications automatically</li>
            <li>• Tracks application status</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {results && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">
                Successfully applied to {results.applied} jobs!
              </span>
            </div>
            {results.applications.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-emerald-800 mb-2">Applied to:</p>
                <ul className="text-sm text-emerald-700 space-y-1">
                  {results.applications.map((app: any) => (
                    <li key={app.id}>• {app.job.title} at {app.job.company}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleAutoApply}
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Applying to jobs...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Start Auto-Apply</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};