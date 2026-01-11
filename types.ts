
export type TumorClass = 'Glioma' | 'Meningioma' | 'Pituitary' | 'No Tumor';

export interface ScanResult {
  id: string;
  patientId: string;
  patientName: string;
  scanDate: string;
  classification: TumorClass;
  confidence: number;
  status: 'Pending' | 'Reviewed' | 'Critical';
  imageUri: string;
  heatmapUri?: string;
  probabilities: Record<TumorClass, number>;
  metadata: {
    modality: string;
    manufacturer: string;
    sliceThickness: string;
    magneticFieldStrength: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  lastScanDate: string;
  status: 'Normal' | 'Under Treatment' | 'Critical';
  scans: string[]; // Scan IDs
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  PATIENTS = 'patients',
  SCAN = 'scan',
  RESULTS = 'results',
  COLLABORATION = 'collaboration',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  KNOWLEDGE_BASE = 'knowledge_base'
}
