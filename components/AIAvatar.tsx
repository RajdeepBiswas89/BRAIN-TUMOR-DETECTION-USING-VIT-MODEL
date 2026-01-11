
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AIAvatar: React.FC = () => {
  return (
    <div className="relative group cursor-pointer">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7209B7] to-[#4361EE] flex items-center justify-center shadow-lg shadow-purple-500/20 relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
        <Sparkles className="text-white w-8 h-8 relative z-20" />
        
        {/* Animated Neural Rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-white rounded-2xl"
        />
      </motion.div>
      
      {/* Insight Tooltip */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute left-full ml-4 top-0 w-48 bg-white p-3 rounded-xl shadow-xl border border-gray-100 pointer-events-none z-50 hidden lg:block"
      >
        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">AI Assistant</p>
        <p className="text-xs text-gray-600 leading-tight italic">"Dr. Vance, I've noticed a 4% increase in Glioma confidence scores in the last batch."</p>
      </motion.div>
    </div>
  );
};

export default AIAvatar;
