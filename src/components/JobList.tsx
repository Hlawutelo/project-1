import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search, Filter, MapPin, DollarSign, Clock, Star, Send, Eye } from 'lucide-react';
import { apiService } from '../services/api';

interface JobListProps {
  onApply?: (jobId: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ onApply }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async (refresh = false) => {
    try {
      setLoading(true);
      const data = await apiService.getJobs({
        search: searchTerm,
        location: locationTerm,
        refresh
      });
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadJobs(true);
  };

  const handleApply = async (jobId: string) => {
    try {
      await apiService.applyToJob(jobId);
      // Update job status locally
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, applied: true } : job
      ));
      if (onApply) onApply(jobId);
    } catch (error) {
      console.error('Failed to apply to job:', error);
      alert('Failed to apply to job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'remote' && job.remote) ||
                         (selectedFilter === 'high-match' && job.matchScore && job.matchScore > 85) ||
                         (selectedFilter === 'recent' && new Date(job.posted) > new Date(Date.now() - 7*24*60*60*1000));
    
    return matchesSearch && matchesFilter;
  });

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getMatchBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-50';
    if (score >= 80) return 'bg-blue-50';
    if (score >= 70) return 'bg-orange-50';
    return 'bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Matches</h2>
          <p className="text-gray-600">AI-powered job recommendations based on your profile</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadJobs(true)}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Loading...' : 'Refresh Jobs'}</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Location..."
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full md:w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {showFilters && (
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'high-match', label: 'High Match' },
              { id: 'remote', label: 'Remote' },
              { id: 'recent', label: 'Recent' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(job.matchScore)} ${getMatchColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </span>
                </div>
                
                <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                    {job.remote && <span className="text-emerald-600">(Remote)</span>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${job.salary.min}k - ${job.salary.max}k</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor((Date.now() - new Date(job.posted).getTime()) / (1000 * 60 * 60 * 24))} days ago</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={job.applied}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    job.applied
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{job.applied ? 'Applied' : 'Apply'}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};