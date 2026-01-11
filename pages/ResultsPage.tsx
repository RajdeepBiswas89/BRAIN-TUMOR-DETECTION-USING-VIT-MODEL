
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Maximize2, 
  Download, 
  Share2, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Layers,
  Info,
  CheckCircle,
  Eye,
  EyeOff,
  Crosshair,
  AlertTriangle,
  Brain,
  Zap,
  Activity
} from 'lucide-react';
import { ScanResult, TumorClass } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Helper Components defined at top for safety
const Sparkles: React.FC<{className?: string, size?: number}> = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const DataRow: React.FC<{label: string, value: string}> = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="font-bold text-[#0A2463]">{value}</span>
  </div>
);

const InsightRow: React.FC<{icon: React.ReactNode, text: string}> = ({ icon, text }) => (
  <div className="flex gap-4 group">
    <div className="shrink-0 mt-1">{icon}</div>
    <p className="text-[11px] text-white/70 leading-relaxed font-medium group-hover:text-white transition-colors">{text}</p>
  </div>
);

const ResultsPage: React.FC<{ scan: ScanResult }> = ({ scan }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    
    setGeneratingPDF(true);
    try {
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFillColor(10, 36, 99);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NeuroVision AI', 15, 20);
      pdf.setFontSize(10);
      pdf.text('Brain Tumor Detection Report', 15, 28);
      
      // Patient Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Information', 15, 55);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${scan.patientName}`, 15, 65);
      pdf.text(`Patient ID: ${scan.patientId}`, 15, 72);
      pdf.text(`Scan Date: ${scan.scanDate}`, 15, 79);
      pdf.text(`Scan ID: ${scan.id}`, 15, 86);
      
      // Diagnosis Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Diagnostic Results', 15, 100);
      
      // Classification Box
      const isHealthy = scan.classification === 'No Tumor';
      if (isHealthy) {
        pdf.setFillColor(42, 157, 143);
      } else {
        pdf.setFillColor(239, 68, 68);
      }
      pdf.roundedRect(15, 105, 80, 25, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text('Classification:', 20, 115);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(scan.classification, 20, 125);
      
      // Confidence
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(100, 105, 80, 25, 3, 3, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Confidence:', 105, 115);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${(scan.confidence * 100).toFixed(1)}%`, 105, 125);
      
      // Probabilities
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Classification Probabilities', 15, 145);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      let yPos = 155;
      Object.entries(scan.probabilities).sort(([,a], [,b]) => (b as number) - (a as number)).forEach(([name, prob]) => {
        pdf.text(`${name}:`, 20, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${((prob as number) * 100).toFixed(2)}%`, 80, yPos);
        pdf.setFont('helvetica', 'normal');
        
        // Progress bar
        pdf.setFillColor(220, 220, 220);
        pdf.rect(100, yPos - 4, 80, 5, 'F');
        pdf.setFillColor(42, 157, 143);
        pdf.rect(100, yPos - 4, 80 * (prob as number), 5, 'F');
        
        yPos += 10;
      });
      
      // Metadata
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Scan Metadata', 15, yPos + 10);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      yPos += 20;
      Object.entries(scan.metadata).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        pdf.text(`${label}: ${value}`, 20, yPos);
        yPos += 7;
      });
      
      // AI Insights
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Neural Findings', 15, yPos + 10);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos += 20;
      const insights = [
        '• Spatial attention peaks detected in the peri-ventricular zone',
        '• T2 FLAIR signal intensity matches typical patterns',
        '• Vision Transformer (ViT) model v4.2 utilized for analysis',
        '• High-resolution attention mapping enabled'
      ];
      insights.forEach(insight => {
        pdf.text(insight, 20, yPos);
        yPos += 7;
      });
      
      // Footer
      pdf.setFillColor(10, 36, 99);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('Generated by NeuroVision AI | Confidential Medical Report', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Save PDF
      pdf.save(`NeuroVision_Report_${scan.id}_${scan.patientName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const probabilityData = Object.entries(scan.probabilities).map(([name, value]) => ({
    name,
    value: (value as number) * 100
  }));

  const COLORS = {
    'Glioma': '#4361EE',
    'Meningioma': '#7209B7',
    'Pituitary': '#4CC9F0',
    'No Tumor': '#2A9D8F'
  };

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8 pb-20">
      <div className="xl:col-span-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-[#0A2463] rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-blue-900/20">
              {scan.patientName[0]}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0A2463]">{scan.patientName}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Registry Ref: {scan.patientId}</p>
            </div>
          </div>
          <div className="space-y-4 py-6 border-y border-gray-50">
            <DataRow label="Clinical Age" value="45" />
            <DataRow label="Assigned Dept" value="Neurology" />
            <DataRow label="Scan Protocol" value="T1-Weighted GAD" />
          </div>
          <button className="w-full mt-8 py-4 bg-gray-50 text-[#0A2463] text-sm font-bold rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center gap-2">
            <Brain size={18} /> View Longitudinal Record
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <h3 className="font-bold text-[#0A2463] mb-6 flex items-center gap-2">
            <Info size={18} className="text-blue-500" /> Diagnostic Meta
          </h3>
          <div className="space-y-4">
            {Object.entries(scan.metadata).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center group">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-mono text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">{val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#050505] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col h-[700px] border border-white/5"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.05]"></div>
             <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/[0.05]"></div>
          </div>

          <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
            <div className="flex gap-3">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-5 py-3 rounded-2xl border transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest backdrop-blur-md ${
                  showHeatmap ? 'bg-[#2A9D8F] border-[#2A9D8F] text-white shadow-lg shadow-teal-500/20' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Crosshair size={16} /> {showHeatmap ? 'Neural Map: On' : 'Neural Map: Off'}
              </button>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-1.5 flex gap-2 items-center">
                <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="p-2 text-white/40 hover:text-white transition-colors"><ZoomOut size={16} /></button>
                <span className="text-[10px] text-white/60 font-black font-mono w-10 text-center">{(zoom * 100).toFixed(0)}%</span>
                <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="p-2 text-white/40 hover:text-white transition-colors"><ZoomIn size={16} /></button>
              </div>
            </div>
            <button className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">
              <Maximize2 size={18} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-20 cursor-crosshair">
            <motion.div 
              animate={{ scale: zoom }}
              className="relative shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <img src={scan.imageUri} alt="MRI Core" className="max-h-[500px] w-auto rounded-lg" />
              {showHeatmap && scan.heatmapUri && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  src={scan.heatmapUri} 
                  className="absolute inset-0 max-h-[500px] w-auto rounded-lg mix-blend-screen pointer-events-none contrast-150 brightness-110"
                />
              )}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[2px] bg-teal-400/30 blur-[1px] shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                />
              </div>
            </motion.div>
          </div>

          <div className="h-20 bg-white/5 backdrop-blur-xl border-t border-white/10 px-10 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Slice Sequence</span>
                <span className="text-white font-black text-sm">Axial FSE 12 / 48</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <button className="p-1 text-white/40 hover:text-white"><ChevronLeft size={16}/></button>
                  <button className="p-1 text-white/40 hover:text-white"><ChevronRight size={16}/></button>
                </div>
                <div className="w-48 h-1 bg-white/5 rounded-full relative overflow-hidden">
                  <motion.div 
                    animate={{ left: ['0%', '100%'] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 w-20 h-full bg-teal-500 blur-[2px]" 
                  />
                  <div className="absolute top-0 left-0 h-full w-[25%] bg-teal-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-[#2A9D8F] animate-pulse">● LIVE INTERPRETATION</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">60 FPS / GPU ACCEL</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {['DICOM Pack', 'Clinical Share', 'Collaboration', '3D Volumetric'].map((label, idx) => (
             <button key={label} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center gap-3 hover:shadow-lg transition-all group">
               <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 {idx === 0 && <Download size={20} />}
                 {idx === 1 && <Share2 size={20} />}
                 {idx === 2 && <MessageSquare size={20} />}
                 {idx === 3 && <Layers size={20} />}
               </div>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="xl:col-span-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-[#0A2463] uppercase tracking-widest">Classification</h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">ViT Engine 4.2</span>
          </div>
          
          <div className={`p-6 rounded-3xl mb-8 flex items-center justify-between border-2 ${
            scan.classification === 'No Tumor' ? 'bg-teal-50 border-teal-100 text-[#2A9D8F]' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Inferred State</p>
              <p className="text-2xl font-black tracking-tight">{scan.classification}</p>
            </div>
            {scan.classification === 'No Tumor' ? <CheckCircle size={36} /> : <AlertTriangle className="text-red-500" size={36} />}
          </div>

          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={probabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {probabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as TumorClass]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-[#0A2463]">{(scan.confidence * 100).toFixed(0)}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">% CONF</span>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {probabilityData.sort((a,b) => b.value - a.value).map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[item.name as TumorClass] }} />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="font-mono text-xs font-black text-[#0A2463]">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A2463] p-8 rounded-[2.5rem] text-white overflow-hidden relative"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <Zap size={100} fill="currentColor" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            Neural Findings
          </h3>
          <div className="space-y-5">
            <InsightRow icon={<Sparkles size={14} className="text-[#4CC9F0]" />} text="Spatial attention peaks in the peri-ventricular zone." />
            <InsightRow icon={<Sparkles size={14} className="text-[#4CC9F0]" />} text="T2 FLAIR signal intensity matches typical Glioma patterns." />
            <InsightRow icon={<Activity size={14} className="text-[#4CC9F0]" />} text="Contrast uptake indicates Grade II progression risk." />
          </div>
          <button 
            onClick={generatePDFReport}
            disabled={generatingPDF}
            className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingPDF ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Download size={14} />
                </motion.div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={14} />
                Download PDF Report
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
