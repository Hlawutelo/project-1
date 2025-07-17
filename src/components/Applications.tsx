import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, ExternalLink, MessageCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface ApplicationsProps {}

export const Applications: React.FC<ApplicationsProps> = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await apiService.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview': return '📅';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      case 'viewed': return '👀';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total Applications: <span className="font-medium">{applications.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            Interviews: <span className="font-medium text-orange-600">
              {applications.filter(app => app.status === 'interview').length}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
            <div className="col-span-4">Job Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Applied</div>
            <div className="col-span-2">Last Updated</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {applications.map(app => (
            <div key={app.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {app.job.company.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.job.title}</h3>
                      <p className="text-sm text-gray-600">{app.job.company}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{app.job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            ${app.job.salary.min}k - ${app.job.salary.max}k
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    <span className="mr-1">{getStatusIcon(app.status)}</span>
                    {app.status}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">
                    {new Date(app.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {app.notes && (
                <div className="mt-3 ml-15">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Notes:</span> {app.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};