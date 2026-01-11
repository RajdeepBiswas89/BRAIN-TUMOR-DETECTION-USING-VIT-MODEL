
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  FileText, 
  Users2, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Menu,
  ChevronRight,
  LogOut,
  Command,
  Activity,
  ShieldCheck,
  Cpu,
  BookOpen
} from 'lucide-react';
import { AppRoute } from '../../types';
import InteractiveAvatar from '../InteractiveAvatar';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const AppShell: React.FC<AppShellProps> = ({ children, currentRoute, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: AppRoute.DASHBOARD, label: 'Analytics Hub', icon: LayoutDashboard },
    { id: AppRoute.PATIENTS, label: 'Patient Registry', icon: Users },
    { id: AppRoute.SCAN, label: 'Diagnostic Engine', icon: UploadCloud },
    { id: AppRoute.RESULTS, label: 'Review Center', icon: FileText },
    { id: AppRoute.KNOWLEDGE_BASE, label: 'Knowledge Base', icon: BookOpen },
    { id: AppRoute.COLLABORATION, label: 'Consult Room', icon: Users2 },
    { id: AppRoute.ANALYTICS, label: 'Model Metrics', icon: BarChart3 },
    { id: AppRoute.SETTINGS, label: 'Architecture', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFE] overflow-hidden selection:bg-[#2A9D8F]/20 selection:text-[#2A9D8F]">
      <InteractiveAvatar />

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-80' : 'w-24'
        } bg-[#0A2463] text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50`}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#2A9D8F] to-[#4CC9F0] rounded-[1rem] flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20">NV</div>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black tracking-tight leading-none">NeuroVision</span>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Medical AI Suite</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-6 mt-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                currentRoute === item.id 
                  ? 'bg-gradient-to-r from-[#2A9D8F] to-[#2A9D8F]/80 text-white shadow-xl shadow-[#2A9D8F]/20' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={currentRoute === item.id ? '' : 'group-hover:scale-110 transition-transform'}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              {sidebarOpen && <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.label}</span>}
              {sidebarOpen && currentRoute === item.id && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-6">
           {sidebarOpen && (
             <div className="p-5 dark-glass rounded-[1.5rem] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compute Node</span>
                  <Cpu size={14} className="text-[#4CC9F0]" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>GPU Utilization</span>
                    <span className="text-[#2A9D8F]">64%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} className="h-full bg-[#2A9D8F]" />
                  </div>
                </div>
             </div>
           )}
           {sidebarOpen && (
             <button 
                className="w-full flex items-center gap-3 text-xs font-bold text-white/20 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
              >
                <LogOut size={16} /> Disconnect
             </button>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FDFDFE]">
        {/* Global Header */}
        <header className="h-24 glass-panel border-b border-gray-100 flex items-center justify-between px-12 z-40">
          <div className="flex items-center gap-8 flex-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-[#0A2463] hover:bg-gray-100 transition-all border border-gray-200"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-lg hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Global Registry Search..." 
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2A9D8F]/20 placeholder:text-gray-300 font-medium text-sm transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                <Command size={10} /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6 px-8 border-r border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#2A9D8F]" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encrypted Session</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-blue-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network 12ms</span>
              </div>
            </div>
            
            <button className="relative p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#0A2463]">Dr. Helena Vance</p>
                <p className="text-[10px] font-bold text-[#2A9D8F] uppercase tracking-widest leading-none mt-1">Chief Neurologist</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#0A2463] p-[3px] shadow-lg shadow-blue-900/10 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-[0.8rem] overflow-hidden bg-white border border-white/20">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-[#FDFDFE]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppShell;
