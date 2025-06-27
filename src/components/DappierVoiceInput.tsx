import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader } from 'lucide-react';

interface DappierVoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
}

export function DappierVoiceInput({ onTranscript, language = 'en-US', className = '' }: DappierVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(isSupported);
  }, []);

  const startListening = async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        setTranscript(transcriptText);
        
        if (result.isFinal) {
          onTranscript(transcriptText);
          setIsListening(false);
        }
      };
      
      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error: any) {
      setError(error.message || 'Failed to start voice recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    // In a real implementation, you would call recognition.stop()
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-3 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-600 text-white animate-pulse' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-medium border border-gray-200 p-3 min-w-[200px] max-w-[300px]"
          >
            <p className="text-sm text-gray-700">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 bg-red-50 rounded-lg shadow-medium border border-red-200 p-3 min-w-[200px] max-w-[300px]"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}