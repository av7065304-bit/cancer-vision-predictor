export type ScanType = 'DICOM' | 'MRI' | 'CT' | 'X-Ray' | 'Skin Image' | 'Cervical Smear' | 'Mammogram';
export type CancerType = 'Skin Cancer' | 'Lung Cancer' | 'Breast Cancer' | 'Brain Tumor' | 'Oral Cancer' | 'Cervical Cancer' | 'Colon Cancer';
export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface MedicalScan {
  id: string;
  patientName: string;
  patientAge: number;
  patientSex: 'M' | 'F' | 'Other';
  scanType: ScanType;
  cancerType: CancerType;
  date: string;
  fileName: string;
  imageUrl: string;
  status: 'Analyzed' | 'Pending';
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
  findings: string[];
  recommendations: string[];
  segmentationPoints?: string; // SVG path for tumor boundary overlay
  gradCamUrl?: string; // Overlay grad-cam effect filter
  reasoning: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: 'en' | 'hi';
  audioUrl?: string;
}

export interface WellnessRecord {
  id: string;
  date: string;
  bmi: number;
  weight: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  sleepHours: number;
  steps: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  summary: string;
  matchScore: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  imageUrl: string;
  availability: string[];
  contact: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  role: string;
  action: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

export interface ModelMetric {
  name: string;
  displayName: string;
  accuracy: number;
  latency: number;
  parameters: string;
  f1Score: number;
  auc: number;
}
