
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, BrainCircuit, Loader2, Mic, MicOff } from 'lucide-react';
import Assistant3D from './Assistant3D';

// Optional imports with error handling
let GoogleGenAI: any = null;
let Modality: any = null;
try {
  const genAI = require("@google/genai");
  GoogleGenAI = genAI.GoogleGenAI;
  Modality = genAI.Modality;
} catch (error) {
  console.warn('GoogleGenAI package not available. AI features will be limited.');
}

// Audio decoding utilities as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const InteractiveAvatar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Dr. Vance, I am NeuroAssistant 4.0. How can I assist with your diagnostic workflow today?' }
  ]);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Error boundary catch - more graceful error handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('InteractiveAvatar Error:', event.error);
      // Only set error if it's a critical failure, not for API issues
      if (event.error?.message?.includes('Failed to fetch') || 
          event.error?.message?.includes('NetworkError') ||
          event.error?.message?.includes('API')) {
        console.warn('API Error detected, but component will continue rendering');
      } else {
        setHasError(true);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // If there's a critical error, render a fallback UI instead of nothing
  if (hasError) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="text-sm">AI Assistant Error</span>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Safe initialization
  useEffect(() => {
    try {
      setIsInitialized(true);
      console.log('InteractiveAvatar initialized successfully');
    } catch (error) {
      console.error('InteractiveAvatar initialization failed:', error);
      setHasError(true);
    }
  }, []);

  // Initialize Speech Recognition with defensive check
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && typeof SpeechRecognition === 'function') {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    } catch (e) {
      console.warn("Speech recognition initialization failed:", e);
    }
  }, [isInitialized]);

  const speakResponse = async (text: string) => {
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key not found. Text-to-speech will be disabled.');
        return;
      }
      
      // Check if GoogleGenAI is available
      if (typeof GoogleGenAI === 'undefined') {
        console.warn('GoogleGenAI not available. Text-to-speech disabled.');
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a professional clinical tone: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          audioContextRef.current,
          24000,
          1
        );

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        
        setIsSpeaking(true);
        source.start();
        source.onended = () => {
          setIsSpeaking(false);
        };
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isThinking) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsThinking(true);
    setIsSpeaking(false);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key not found. Using fallback response.');
        // Fallback response when API key is not available
        const fallbackResponse = "I understand your question. However, the Gemini AI integration is currently disabled due to missing API key. Please contact your system administrator to enable full AI assistance.";
        setMessages(prev => [...prev, { role: 'ai', text: fallbackResponse }]);
        setIsThinking(false);
        return;
      }
      
      // Check if GoogleGenAI is available
      if (typeof GoogleGenAI === 'undefined') {
        console.warn('GoogleGenAI not available. Using fallback response.');
        const fallbackResponse = "I understand your question. However, the AI engine is currently initializing. Please try again in a moment.";
        setMessages(prev => [...prev, { role: 'ai', text: fallbackResponse }]);
        setIsThinking(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: textToSend,
        config: {
          systemInstruction: `You are NeuroAssistant 4.0, a high-end enterprise medical AI assistant for NeuroVision Elite. 
          Your tone is professional, clinical, yet helpful. You specialize in Brain Tumor detection.
          Keep responses concise and data-driven. Reference hypothetical scan results SC-8821 (Glioma 94%) if relevant to demonstrate context.`,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "I apologize, Dr. Vance. I encountered a neural synchronization error.";
      
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      await speakResponse(aiText);

    } catch (error) {
      console.error("AI Assistant Error:", error);
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'ai', text: "Engine Error: Connection to the medical LLM cluster timed out." }]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Safe render with error boundary
  try {
    return (
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[420px] h-[600px] glass-panel rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
          >
            <div className="h-40 bg-[#0A2463] relative overflow-hidden flex items-center px-8 gap-6">
              <div className="w-24 h-24 relative">
                <Assistant3D isThinking={isThinking} isSpeaking={isSpeaking} />
              </div>
              <div className="text-white z-10">
                <h4 className="font-black text-lg tracking-tight">NeuroAssistant</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    isListening ? 'bg-red-400 animate-ping' :
                    isThinking ? 'bg-amber-400 animate-pulse' : 
                    isSpeaking ? 'bg-teal-400' : 'bg-[#2A9D8F]'
                  }`}></span>
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">
                    {isListening ? 'Awaiting Audio Input' :
                     isThinking ? 'Processing Neural Data' : 
                     isSpeaking ? 'Communicating Insights' : 'Ready for Query'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                    msg.role === 'ai' 
                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100 font-medium' 
                    : 'bg-[#0A2463] text-white rounded-tr-none font-bold'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                   <div className="bg-white/50 p-4 rounded-full flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-8 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isThinking || isListening}
                    placeholder={isListening ? "Listening..." : "Query NeuroAssistant..."}
                    className={`w-full bg-gray-50 border-none rounded-2xl pl-6 pr-14 py-4 text-sm font-medium focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all placeholder:text-gray-300 ${isListening ? 'italic text-[#2A9D8F]' : ''}`}
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isThinking || isListening || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0A2463] text-white rounded-xl hover:bg-[#0A2463]/90 transition-all disabled:opacity-30 shadow-lg shadow-blue-900/10"
                  >
                    {isThinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                
                <button 
                  onClick={toggleListening}
                  className={`p-4 rounded-2xl transition-all shadow-lg ${
                    isListening 
                    ? 'bg-red-500 text-white shadow-red-500/30' 
                    : 'bg-[#2A9D8F]/10 text-[#2A9D8F] hover:bg-[#2A9D8F]/20'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <p className="mt-4 text-center text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">Neural Audio Interface v2.0 Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="group relative w-24 h-24 bg-gradient-to-br from-[#0A2463] to-[#7209B7] rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border-2 border-white/20 rounded-full scale-75 opacity-50"
        />
        <BrainCircuit className="text-white w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2A9D8F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <AnimatePresence>
          {!isOpen && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 w-4 h-4 bg-[#2A9D8F] border-4 border-[#0A2463] rounded-full z-20 shadow-sm"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
  } catch (error) {
    console.error('InteractiveAvatar render error:', error);
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="text-sm">AI Assistant Error</span>
          </div>
        </div>
      </div>
    );
  }
};

export default InteractiveAvatar;
