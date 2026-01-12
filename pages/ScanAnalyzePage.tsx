
import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle2, AlertCircle, Play, Info, ShieldAlert } from 'lucide-react';
import { ScanResult, TumorClass } from '../types';
import MedicalHologram from '../components/MedicalHologram';

// Get API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ScanAnalyzePageProps {
  onAnalysisComplete: (scan: ScanResult) => void;
}

const ScanAnalyzePage: React.FC<ScanAnalyzePageProps> = ({ onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);

    // Simulate progress steps
    const steps = [
      { p: 15, label: 'Extracting DICOM metadata...' },
      { p: 40, label: 'Preprocessing (Normalization)...' },
      { p: 70, label: 'ViT Feature Extraction...' },
      { p: 90, label: 'Generating Attention Maps...' },
      { p: 100, label: 'Classification Complete' },
    ];

    for (const step of steps.slice(0, -1)) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      setProgress(step.p);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setProgress(100);

      const newScan: ScanResult = {
        id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: 'PAT-999',
        patientName: 'Anonymous Patient',
        scanDate: new Date().toLocaleString(),
        classification: result.class as TumorClass,
        confidence: result.confidence,
        status: result.class === 'No Tumor' ? 'Reviewed' : 'Critical',
        imageUri: URL.createObjectURL(file),
        heatmapUri: 'https://picsum.photos/seed/heatmap_gen/800/800',
        probabilities: result.all_probabilities,
        metadata: {
          modality: 'MR',
          manufacturer: 'Simulated',
          sliceThickness: '1.0mm',
          magneticFieldStrength: '3T'
        }
      };

      onAnalysisComplete(newScan);
    } catch (error) {
      console.error('Error during analysis:', error);
      setAnalyzing(false);
      setProgress(0);
      // Show a more descriptive error message to the user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(Analysis failed: \n\nPlease ensure:\n1. Backend is running at: \n2. Internet connection is stable\n3. File is a valid image);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A2463]">Scan & Analyze</h1>
        <p className="text-gray-500">Upload MRI scans for automated brain tumor detection using Vision Transformers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#0A2463] mb-4">Diagnostic Requirements</h2>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-600">
                <CheckCircle2 className="text-[#2A9D8F] shrink-0" size={18} />
                <span>Format: DICOM, NIfTI, PNG, JPEG</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <CheckCircle2 className="text-[#2A9D8F] shrink-0" size={18} />
                <span>Min Resolution: 256x256 px</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <CheckCircle2 className="text-[#2A9D8F] shrink-0" size={18} />
                <span>Max File Size: 50MB per slice</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
              <ShieldAlert className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-orange-800 leading-relaxed">
                <strong>HIPAA NOTICE:</strong> Ensure all Patient Personally Identifiable Information (PII) is de-identified before upload if using public cloud processing.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#0A2463] mb-4">Batch Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Analysis Mode</label>
                <select className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
                  <option>Standard (ViT-Base)</option>
                  <option>High Precision (ViT-Huge)</option>
                  <option>Quick Screen</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="heatmap" defaultChecked className="w-4 h-4 text-[#2A9D8F] border-gray-300 rounded" />
                <label htmlFor="heatmap" className="text-sm font-medium text-gray-700">Generate Attention Heatmaps</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="metadata" defaultChecked className="w-4 h-4 text-[#2A9D8F] border-gray-300 rounded" />
                <label htmlFor="metadata" className="text-sm font-medium text-gray-700">Extract DICOM Tags</label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Zone */}
        <div className="lg:col-span-2 space-y-6 relative">
          {/* 3D Medical Hologram Background */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none z-0">
            <MedicalHologram />
          </div>
          <div 
            className={`relative h-[400px] border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-8 bg-white ${
              dragActive ? 'border-[#2A9D8F] bg-[#2A9D8F]/5' : 'border-gray-200 hover:border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="text-center w-full max-w-sm">
                <div className="mb-6 mx-auto w-24 h-24 bg-teal-50 text-[#2A9D8F] rounded-full flex items-center justify-center">
                  <File size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{file.name}</h3>
                <p className="text-gray-500 text-sm mb-8">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                
                {analyzing ? (
                  <div className="space-y-4">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2A9D8F] transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm font-bold text-[#2A9D8F] animate-pulse">
                      {progress < 100 ? 'Processing via ViT Engine...' : 'Ready for Diagnosis'}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => setFile(null)}
                      className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={startAnalysis}
                      className="px-8 py-2.5 bg-[#0A2463] text-white rounded-xl font-semibold hover:bg-[#0A2463]/90 shadow-lg shadow-blue-900/10 flex items-center gap-2"
                    >
                      <Play size={18} fill="currentColor" /> Run AI Analysis
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop your MRI file here</h3>
                <p className="text-gray-500 text-center max-w-xs mb-8">
                  Drag and drop a MRI scan or batch of slices to start the AI-assisted diagnostic process.
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileInput}
                  accept=".png,.jpg,.jpeg,.dicom,.dcm"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-[#2A9D8F] text-white rounded-xl font-bold hover:bg-[#2A9D8F]/90 shadow-lg shadow-teal-900/10 transition-all"
                >
                  Choose File
                </button>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <Info className="text-[#0A2463] shrink-0 mt-1" size={20} />
            <div className="text-sm leading-relaxed text-gray-600">
              <h4 className="font-bold text-[#0A2463] mb-1">How AI Analysis Works</h4>
              <p>
                The NeuroVision ViT model utilizes self-attention mechanisms to analyze medical images. 
                Instead of processing pixels locally like traditional CNNs, it views the image as a sequence 
                of patches, allowing it to capture global dependencies across different MRI slices, 
                often leading to higher detection rates for subtle abnormalities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanAnalyzePage;
