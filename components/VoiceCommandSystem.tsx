import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Zap } from 'lucide-react';
import { AppRoute } from '../types';
import { soundSystem } from './SoundEffects';

interface VoiceCommandProps {
  onNavigate: (route: AppRoute) => void;
  onAction?: (action: string, params?: any) => void;
}

const VoiceCommandSystem: React.FC<VoiceCommandProps> = ({ onNavigate, onAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [lastCommand, setLastCommand] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<any>(null);

  // Initialize continuous speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Speech recognition not supported in this browser');
      alert('Voice control requires Chrome, Edge, or Safari browser');
      setIsActive(false);
      return;
    }

    console.log('✅ Speech Recognition API available');
    const recognition = new SpeechRecognition();
    recognition.continuous = false;  // Changed to false - no auto-restart
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('🎤 Voice recognition STARTED');
      setIsListening(true);
      showFeedbackMessage('🎤 Listening...');
    };

    recognition.onresult = (event: any) => {
      console.log('📝 Speech detected:', event);
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        console.log('💬 Interim:', interimTranscript);
        setTranscript(interimTranscript);
      }

      if (finalTranscript) {
        console.log('✅ Final transcript:', finalTranscript);
        setTranscript('');
        processVoiceCommand(finalTranscript.toLowerCase().trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        alert('⚠️ Microphone permission denied! Please allow microphone access in browser settings.');
        setIsActive(false);
        showFeedbackMessage('❌ Mic Permission Denied');
        return;
      }
      
      if (event.error === 'no-speech') {
        console.log('⏸ No speech detected');
        showFeedbackMessage('⏸ No speech detected - Click mic to try again');
        return;
      }
      
      if (event.error === 'aborted') {
        console.log('⚠️ Recognition aborted');
        return;
      }
    };

    recognition.onend = () => {
      console.log('⏹ Voice recognition ended - Click mic button to speak again');
      setIsListening(false);
      showFeedbackMessage('✓ Click mic button to speak again');
      // NO AUTO-RESTART - user must click button
    };

    recognitionRef.current = recognition;

    return () => {
      console.log('🛑 Cleanup: Stopping voice recognition');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const showFeedbackMessage = (message: string) => {
    setFeedback(message);
    setShowFeedback(true);
    
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  const processVoiceCommand = (command: string) => {
    console.log('Processing command:', command);
    setLastCommand(command);
    soundSystem.playNotification();

    // Navigation commands
    if (command.includes('go to') || command.includes('open') || command.includes('show')) {
      if (command.includes('dashboard') || command.includes('home') || command.includes('main')) {
        onNavigate(AppRoute.DASHBOARD);
        speak('Opening Dashboard');
        showFeedbackMessage('✓ Navigating to Dashboard');
        soundSystem.playSuccess();
        return;
      }
      
      if (command.includes('patient') || command.includes('registry')) {
        onNavigate(AppRoute.PATIENTS);
        speak('Opening Patient Registry');
        showFeedbackMessage('✓ Navigating to Patients');
        soundSystem.playSuccess();
        return;
      }
      
      if (command.includes('scan') || command.includes('upload') || command.includes('diagnostic')) {
        onNavigate(AppRoute.SCAN);
        speak('Opening Diagnostic Engine');
        showFeedbackMessage('✓ Navigating to Scan & Analyze');
        soundSystem.playSuccess();
        return;
      }
      
      if (command.includes('result') || command.includes('review')) {
        onNavigate(AppRoute.RESULTS);
        speak('Opening Review Center');
        showFeedbackMessage('✓ Navigating to Results');
        soundSystem.playSuccess();
        return;
      }
      
      if (command.includes('knowledge') || command.includes('learn') || command.includes('info')) {
        onNavigate(AppRoute.KNOWLEDGE_BASE);
        speak('Opening Knowledge Base');
        showFeedbackMessage('✓ Navigating to Knowledge Base');
        soundSystem.playSuccess();
        return;
      }
    }

    // Action commands
    if (command.includes('download') || command.includes('save') || command.includes('export')) {
      if (command.includes('report') || command.includes('pdf')) {
        speak('Generating PDF report');
        showFeedbackMessage('✓ Generating PDF Report...');
        soundSystem.playProcessing();
        onAction?.('download_report');
        return;
      }
    }

    if (command.includes('upload') || command.includes('select file') || command.includes('choose file')) {
      speak('Opening file selector');
      showFeedbackMessage('✓ Opening file selector');
      onAction?.('open_file_selector');
      soundSystem.playClick();
      return;
    }

    if (command.includes('analyze') || command.includes('process') || command.includes('scan')) {
      speak('Starting analysis');
      showFeedbackMessage('✓ Starting AI Analysis...');
      soundSystem.playProcessing();
      onAction?.('start_analysis');
      return;
    }

    // Help command
    if (command.includes('help') || command.includes('what can you do') || command.includes('commands')) {
      const helpText = 'You can say: Go to Dashboard, Open Patients, Show Scan page, Go to Results, Download Report, Upload Scan, or Analyze Image';
      speak(helpText);
      showFeedbackMessage('💡 Listening for commands...');
      return;
    }

    // Wake word detection
    if (command.includes('hey neuro') || command.includes('hi neuro') || command.includes('hello neuro')) {
      speak('Yes, I\'m listening. How can I help?');
      showFeedbackMessage('👋 Hello! I\'m ready');
      soundSystem.playNotification();
      return;
    }

    // If no command matched
    if (command.length > 3) {
      speak('I didn\'t understand that command. Say help for available commands.');
      showFeedbackMessage('❓ Command not recognized');
      soundSystem.playError();
    }
  };

  const toggleVoiceControl = () => {
    if (!recognitionRef.current) {
      console.error('❌ Recognition not initialized');
      return;
    }

    if (isListening) {
      // Stop listening
      console.log('🛑 Stopping voice recognition manually...');
      recognitionRef.current.stop();
      setIsListening(false);
      showFeedbackMessage('⏹ Voice stopped');
    } else {
      // Start listening
      try {
        console.log('🎤 STARTING voice recognition (manual click)...');
        recognitionRef.current.start();
        showFeedbackMessage('🎤 Listening - Speak now!');
        soundSystem.playNotification();
      } catch (e) {
        console.error('❌ Failed to start:', e);
        showFeedbackMessage('❌ Failed to start - Try again');
      }
    }
  };

  return (
    <>
      {/* Voice Control Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-[1000] flex flex-col items-end gap-2"
      >
        {/* Feedback Display */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10, x: 10 }}
              className="bg-gradient-to-r from-[#2A9D8F] to-[#4CC9F0] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript Display */}
        <AnimatePresence>
          {transcript && isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/95 backdrop-blur-xl border-2 border-[#4CC9F0] px-6 py-3 rounded-2xl shadow-xl max-w-md"
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Listening...
                </span>
              </div>
              <p className="text-[#0A2463] font-bold">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Control Button */}
        <motion.button
          onClick={toggleVoiceControl}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${
            isActive
              ? 'bg-gradient-to-br from-[#2A9D8F] to-[#4CC9F0]'
              : 'bg-gray-400'
          }`}
        >
          {isActive && isListening && (
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-[#4CC9F0] rounded-2xl"
            />
          )}
          
          <div className="relative z-10">
            {isActive ? (
              <Mic className="text-white w-7 h-7" strokeWidth={2.5} />
            ) : (
              <MicOff className="text-white w-7 h-7" strokeWidth={2.5} />
            )}
          </div>

          {/* Listening Indicator */}
          {isActive && isListening && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          )}
        </motion.button>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-black text-white uppercase tracking-wider bg-[#0A2463]/80 backdrop-blur-md px-4 py-2 rounded-full"
        >
          {isActive ? (
            isListening ? '🎤 Listening...' : '⏸ Paused'
          ) : (
            '🔇 Voice Off'
          )}
        </motion.div>

        {/* Last Command */}
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="text-xs text-white/60 font-bold max-w-[200px] text-right bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg"
          >
            Last: "{lastCommand.substring(0, 30)}..."
          </motion.div>
        )}
      </motion.div>

      {/* Instructions Overlay (shows on first load) */}
      <AnimatePresence>
        {isActive && !lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1 }}
            className="fixed bottom-32 right-8 z-[999] max-w-sm"
          >
            <div className="bg-gradient-to-br from-[#0A2463] to-[#4361EE] text-white p-6 rounded-3xl shadow-2xl border-2 border-[#4CC9F0]/30">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-[#4CC9F0]" />
                <h3 className="font-black text-lg">Voice Commands Active!</h3>
              </div>
              <p className="text-sm mb-3 text-white/80 leading-relaxed">
                Try saying:
              </p>
              <ul className="text-xs space-y-1 text-white/90 font-bold">
                <li>• "Go to Dashboard"</li>
                <li>• "Open Scan page"</li>
                <li>• "Show Results"</li>
                <li>• "Download Report"</li>
                <li>• "Help" for more commands</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceCommandSystem;
