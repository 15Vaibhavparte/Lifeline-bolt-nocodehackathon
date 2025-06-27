import { useState, useEffect, useCallback } from 'react';
import { voiceService, VoiceConfig } from '../services/voiceService';

export function useVoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [voiceSettings, setVoiceSettings] = useState<VoiceConfig>({
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if voice interface is supported
    const supported = 'speechSynthesis' in window && 
                     ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    setIsSupported(supported);

    if (supported) {
      // Load available voices
      const loadVoices = () => {
        const voices = voiceService.getAvailableVoices();
        setAvailableVoices(voices);
      };

      // Load voices immediately and on voiceschanged event
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      // Set up accessibility event listeners
      const handleAccessibilityEvent = (event: CustomEvent) => {
        const { type, data } = event.detail;
        
        switch (type) {
          case 'voice-listening-started':
            setIsListening(true);
            setError(null);
            break;
          case 'voice-listening-stopped':
            setIsListening(false);
            break;
          case 'voice-error':
            setError(data.error);
            setIsListening(false);
            break;
          case 'speech-started':
            // Handle speech start
            break;
          case 'speech-ended':
            // Handle speech end
            break;
        }
      };

      document.addEventListener('voice-accessibility', handleAccessibilityEvent as EventListener);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        document.removeEventListener('voice-accessibility', handleAccessibilityEvent as EventListener);
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice interface not supported in this browser');
      return;
    }

    try {
      voiceService.startListening();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to start voice recognition');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, []);

  const speak = useCallback((text: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    if (!isSupported) {
      setError('Speech synthesis not supported');
      return;
    }

    try {
      voiceService.speakText(text, priority);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to speak text');
    }
  }, [isSupported]);

  const changeLanguage = useCallback((language: string) => {
    voiceService.setLanguage(language);
    setCurrentLanguage(language);
    
    // Update available voices for new language
    const voices = voiceService.getAvailableVoices();
    setAvailableVoices(voices);
  }, []);

  const updateVoiceSettings = useCallback((settings: Partial<VoiceConfig>) => {
    const newSettings = { ...voiceSettings, ...settings };
    setVoiceSettings(newSettings);
    voiceService.setVoiceSettings(newSettings);
  }, [voiceSettings]);

  const getSupportedLanguages = useCallback(() => {
    return voiceService.getSupportedLanguages();
  }, []);

  const testVoiceInterface = useCallback(() => {
    const testMessage = {
      'en-US': 'Voice interface test successful. Lifeline is ready to help.',
      'es-ES': 'Prueba de interfaz de voz exitosa. Lifeline está listo para ayudar.',
      'hi-IN': 'वॉयस इंटरफेस टेस्ट सफल। Lifeline मदद के लिए तैयार है।',
      'fr-FR': 'Test d\'interface vocale réussi. Lifeline est prêt à aider.',
      'ar-SA': 'اختبار واجهة الصوت ناجح. Lifeline جاهز للمساعدة।'
    };

    speak(testMessage[currentLanguage] || testMessage['en-US'], 'medium');
  }, [currentLanguage, speak]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setError(null);
      return true;
    } catch (err: any) {
      setError('Microphone permission denied. Voice commands will not work.');
      return false;
    }
  }, []);

  return {
    isListening,
    isSupported,
    currentLanguage,
    voiceSettings,
    availableVoices,
    error,
    transcript,
    startListening,
    stopListening,
    speak,
    changeLanguage,
    updateVoiceSettings,
    getSupportedLanguages,
    testVoiceInterface,
    requestMicrophonePermission
  };
}