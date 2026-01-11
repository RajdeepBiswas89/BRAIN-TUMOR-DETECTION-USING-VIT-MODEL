
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Microscope,
  Radar,
  Lock,
  Globe
} from 'lucide-react';
import { ScanResult } from '../types';
import Brain3D from '../components/Brain3D';
import Doctor3D from '../components/Doctor3D';
import LowPolyMedicalScene from '../components/LowPolyMedicalScene';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 19 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 22 },
  { name: 'Fri', count: 30 },
  { name: 'Sat', count: 10 },
  { name: 'Sun', count: 8 },
];

const performanceData = [
  { name: 'Jan', acc: 92 },
  { name: 'Feb', acc: 93 },
  { name: 'Mar', acc: 95 },
  { name: 'Apr', acc: 94 },
  { name: 'May', acc: 96 },
];

const getTumorStyles = (type: string) => {
  switch (type) {
    case 'Glioma': return 'bg-blue-50 border-blue-100 text-[#4361EE] shadow-sm';
    case 'Meningioma': return 'bg-purple-50 border-purple-100 text-[#7209B7] shadow-sm';
    case 'Pituitary': return 'bg-sky-50 border-sky-100 text-[#4CC9F0] shadow-sm';
    case 'No Tumor': return 'bg-teal-50 border-teal-100 text-[#2A9D8F] shadow-sm';
    default: return 'bg-gray-50 border-gray-100 text-gray-500 shadow-sm';
  }
};

const StatCard: React.FC<{icon: React.ReactNode, title: string, value: string, trend: string, trendUp: boolean}> = ({ icon, title, value, trend, trendUp }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-[#2A9D8F]/20 transition-all cursor-default"
  >
    <div className="flex items-center justify-between mb-8">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 shadow-inner">{icon}</div>
      <div className={`text-[10px] font-black px-3 py-1.5 rounded-xl tracking-tighter ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </div>
    </div>
    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
    <p className="text-4xl font-black text-[#0A2463]">{value}</p>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

const Dashboard: React.FC<{ scans: ScanResult[]; onScanClick: (id: string) => void }> = ({ scans, onScanClick }) => {
  return (
    <div className="relative min-h-screen">
      <LowPolyMedicalScene />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[1600px] mx-auto space-y-12"
      >
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 bg-[#0A2463] rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[500px] shadow-2xl shadow-blue-900/40"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <Brain3D />
            </div>

            <div className="absolute -right-10 bottom-0 w-[450px] h-[550px] z-20 hidden xl:block">
              <Doctor3D />
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-20 left-0 bg-white text-[#0A2463] px-6 py-3 rounded-2xl font-black text-sm shadow-2xl border-2 border-[#2A9D8F]/20 flex items-center gap-3 after:content-[''] after:absolute after:top-full after:left-10 after:border-8 after:border-transparent after:border-t-white"
              >
                <div className="w-2 h-2 bg-[#2A9D8F] rounded-full animate-pulse" />
                "Hello, Dr. Vance. Neural systems are online."
              </motion.div>
            </div>
            
            <div className="relative z-30 max-w-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-4 py-1.5 bg-[#2A9D8F]/20 text-[#2A9D8F] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#2A9D8F]/30 flex items-center gap-2">
                  <Radar size={12} className="animate-spin" /> Live Diagnostic Feed
                </div>
                <div className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                  <Lock size={12} /> HIPAA COMPLIANT
                </div>
              </div>
              
              <h1 className="text-6xl font-black leading-[1.1] mb-6 tracking-tight">
                Elite Neural <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F]">Interpretation</span>
              </h1>
              
              <p className="text-white/60 text-lg mb-10 leading-relaxed font-medium">
                Autonomous screening of multimodality DICOM imagery utilizing Vision Transformer (ViT) architecture v4.2 with sub-millimeter precision.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-10 py-4 bg-[#2A9D8F] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#2A9D8F]/90 shadow-2xl shadow-[#2A9D8F]/30 flex items-center gap-3"
                >
                  <BrainCircuit size={20} /> Deploy Analysis
                </motion.button>
                <button className="px-10 py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center gap-3">
                  <Globe size={18} /> Network Status
                </button>
              </div>
            </div>

            <div className="relative z-30 pt-12 flex gap-12 border-t border-white/5">
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Latency</p>
                <p className="text-2xl font-black">1.2ms</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Active Peers</p>
                <p className="text-2xl font-black">128+</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Sync State</p>
                <p className="text-2xl font-black text-[#2A9D8F]">Optimal</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4 grid grid-rows-2 gap-8">
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-[#2A9D8F]/30 transition-all">
               <div className="flex justify-between items-start">
                 <div className="w-16 h-16 bg-teal-50 rounded-[1.5rem] text-[#2A9D8F] flex items-center justify-center transition-transform group-hover:scale-110">
                   <Zap size={32} fill="currentColor" />
                 </div>
                 <div className="text-right">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Queue Dynamics</span>
                   <p className="text-[#2A9D8F] font-black text-sm">98.2% LOAD</p>
                 </div>
               </div>
               <div>
                 <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Engine Load</p>
                 <h3 className="text-4xl font-black text-[#0A2463]">Peak Flow</h3>
                 <div className="mt-6 flex items-end gap-1.5 h-12">
                   {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                     <motion.div 
                      key={i}
                      animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-[#2A9D8F] to-[#4CC9F0] rounded-full"
                     />
                   ))}
                 </div>
               </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#7209B7] to-[#4361EE] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-purple-900/30 group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Microscope size={200} />
              </div>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Urgent Diagnostics</p>
              <h3 className="text-5xl font-black leading-none">08 <span className="text-lg font-bold text-white/40 tracking-normal">CRITICAL</span></h3>
              <p className="text-white/60 text-sm mt-4 font-medium max-w-[200px]">High-priority anomalies detected in the last sequence.</p>
              <button className="mt-8 flex items-center gap-3 text-xs font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                Immediate Review <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            icon={<Activity className="text-blue-600" size={24} />} 
            title="Throughput" 
            value="1.2k" 
            trend="+12%" 
            trendUp={true} 
          />
          <StatCard 
            icon={<ShieldCheck className="text-[#2A9D8F]" size={24} />} 
            title="Precision" 
            value="96.4%" 
            trend="+0.8%" 
            trendUp={true} 
          />
          <StatCard 
            icon={<AlertTriangle className="text-orange-500" size={24} />} 
            title="Review Vol" 
            value="24" 
            trend="-12%" 
            trendUp={true} 
          />
          <StatCard 
            icon={<Clock className="text-purple-600" size={24} />} 
            title="Inference" 
            value="2.4s" 
            trend="-2ms" 
            trendUp={true} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-[#0A2463]">Subject Velocity</h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Diagnostic volume indexed by region</p>
              </div>
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                <button className="px-5 py-2 bg-white text-[#0A2463] shadow-sm rounded-xl text-xs font-bold uppercase tracking-widest">Global</button>
                <button className="px-5 py-2 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-[#0A2463]">Regional</button>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '20px' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#2A9D8F" strokeWidth={5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0A2463] mb-2">Engine Accuracy</h2>
              <p className="text-gray-400 text-sm font-medium mb-10">Performance delta over last 5 iterations</p>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7209B7" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#7209B7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="step" dataKey="acc" stroke="#7209B7" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-8 p-8 bg-[#0A2463] rounded-[2rem] text-white overflow-hidden relative">
              <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-[#4CC9F0]/20 blur-3xl rounded-full" />
              <p className="text-[#4CC9F0] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Neural Insight</p>
              <p className="text-sm font-medium leading-relaxed italic opacity-80">
                "ViT v4.2 shows a 12% improvement in edge-case Meningioma detection."
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0A2463]">Global Subject Registry</h2>
              <p className="text-gray-400 text-sm font-medium">Verified medical records across the federated network</p>
            </div>
            <button className="bg-gray-50 text-[#0A2463] p-4 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 text-[10px] font-black uppercase tracking-[0.25em]">
                  <th className="px-10 py-6">Reference Hash</th>
                  <th className="px-10 py-6">Subject Identity</th>
                  <th className="px-10 py-6">AI Interpretation</th>
                  <th className="px-10 py-6">Confidence Index</th>
                  <th className="px-10 py-6 text-right">Registry Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer" onClick={() => onScanClick(scan.id)}>
                    <td className="px-10 py-8 text-xs font-mono font-bold text-gray-400 group-hover:text-[#0A2463] transition-colors">{scan.id}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-xl text-[#0A2463] shadow-sm">
                          {scan.patientName[0]}
                        </div>
                        <div>
                          <p className="text-md font-black text-gray-900 leading-none">{scan.patientName}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1.5">{scan.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getTumorStyles(scan.classification)}`}>
                        {scan.classification}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="flex-1 h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${scan.confidence * 100}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#2A9D8F] to-[#4CC9F0]"
                          />
                        </div>
                        <span className="text-xs font-black text-[#0A2463]">{(scan.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="text-gray-300 group-hover:text-[#2A9D8F] group-hover:scale-125 transition-all p-2 rounded-xl">
                        <ExternalLink size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
