
import React, { useState, useEffect } from 'react';
import { AppRoute, ScanResult, Patient } from './types';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import ScanAnalyzePage from './pages/ScanAnalyzePage';
import ResultsPage from './pages/ResultsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  // Mock data initialization
  const [scans, setScans] = useState<ScanResult[]>([
    {
      id: 'SCN-8821',
      patientId: 'PAT-001',
      patientName: 'John Doe',
      scanDate: '2024-05-12 14:30',
      classification: 'Glioma',
      confidence: 0.94,
      status: 'Critical',
      imageUri: 'https://picsum.photos/seed/mri1/800/800',
      heatmapUri: 'https://picsum.photos/seed/heatmap1/800/800',
      probabilities: {
        'Glioma': 0.94,
        'Meningioma': 0.03,
        'Pituitary': 0.02,
        'No Tumor': 0.01
      },
      metadata: {
        modality: 'MR',
        manufacturer: 'GE Medical Systems',
        sliceThickness: '1.0mm',
        magneticFieldStrength: '3T'
      }
    },
    {
      id: 'SCN-8822',
      patientId: 'PAT-002',
      patientName: 'Sarah Smith',
      scanDate: '2024-05-14 09:15',
      classification: 'No Tumor',
      confidence: 0.99,
      status: 'Reviewed',
      imageUri: 'https://picsum.photos/seed/mri2/800/800',
      probabilities: {
        'Glioma': 0.001,
        'Meningioma': 0.002,
        'Pituitary': 0.001,
        'No Tumor': 0.996
      },
      metadata: {
        modality: 'MR',
        manufacturer: 'Siemens',
        sliceThickness: '1.0mm',
        magneticFieldStrength: '1.5T'
      }
    }
  ]);

  const navigateToResults = (scanId: string) => {
    setSelectedScanId(scanId);
    setCurrentRoute(AppRoute.RESULTS);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD:
        return <Dashboard scans={scans} onScanClick={navigateToResults} />;
      case AppRoute.PATIENTS:
        return <PatientsPage />;
      case AppRoute.SCAN:
        return <ScanAnalyzePage onAnalysisComplete={(newScan) => {
          setScans(prev => [newScan, ...prev]);
          navigateToResults(newScan.id);
        }} />;
      case AppRoute.RESULTS:
        const scan = scans.find(s => s.id === selectedScanId) || scans[0];
        return <ResultsPage scan={scan} />;
      case AppRoute.KNOWLEDGE_BASE:
        return <KnowledgeBasePage />;
      default:
        return <Dashboard scans={scans} onScanClick={navigateToResults} />;
    }
  };

  return (
    <AppShell 
      currentRoute={currentRoute} 
      onNavigate={setCurrentRoute}
    >
      {renderContent()}
    </AppShell>
  );
};

export default App;
