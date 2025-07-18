import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { JobList } from './components/JobList';
import { Applications } from './components/Applications';
import { CVBuilder } from './components/CVBuilder/CVBuilder';
import { InterviewScheduler } from './components/Interviews/InterviewScheduler';
import { NotificationCenter } from './components/Notifications/NotificationCenter';
import { Settings } from './components/Settings';
import { AutoApply } from './components/AutoApply';
import { AuthPage } from './components/Auth/AuthPage';

const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Dashboard user={user} />
            <AutoApply />
          </div>
        );
      case 'jobs':
        return <JobList />;
      case 'cv-builder':
        return <CVBuilder />;
      case 'applications':
        return <Applications />;
      case 'interviews':
        return <InterviewScheduler />;
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <Settings user={user} onUpdateUser={updateUser} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;