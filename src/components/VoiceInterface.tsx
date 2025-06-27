import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Languages,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Headphones,
  Accessibility
} from 'lucide-react';
import { useVoiceInterface } from '../hooks/useVoiceInterface';

interface VoiceInterfaceProps {
  className?: string;
  showFullControls?: boolean;
}

export function VoiceInterface({ className = '', showFullControls = false }: VoiceInterfaceProps) {
  const {
    isListening,
    isSupported,
    currentLanguage,
    voiceSettings,
    availableVoices,
    error,
    startListening,
    stopListening,
    speak,
    changeLanguage,
    updateVoiceSettings,
    getSupportedLanguages,
    testVoiceInterface,
    requestMicrophonePermission
  } = useVoiceInterface();

  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const supportedLanguages = getSupportedLanguages();

  useEffect(() => {
    // Check microphone permission on mount
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(result.state === 'granted');
      
      result.addEventListener('change', () => {
        setHasPermission(result.state === 'granted');
      });
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      setHasPermission(null);
    }
  };

  const handleMicrophoneToggle = async () => {
    if (!isSupported) {
      speak('Voice interface not supported in this browser', 'high');
      return;
    }

    if (hasPermission === false) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
      setHasPermission(true);
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleVolumeToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    updateVoiceSettings({ volume: newMutedState ? 0 : 0.8 });
  };

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    speak(`Language changed to ${supportedLanguages.find(l => l.code === language)?.name}`, 'medium');
  };

  const handleVoiceChange = (voiceIndex: number) => {
    const selectedVoice = availableVoices[voiceIndex];
    if (selectedVoice) {
      updateVoiceSettings({ voice: selectedVoice });
    }
  };

  const handleRateChange = (rate: number) => {
    updateVoiceSettings({ rate });
  };

  const handlePitchChange = (pitch: number) => {
    updateVoiceSettings({ pitch });
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600 bg-red-100';
    if (isListening) return 'text-green-600 bg-green-100';
    if (!isSupported) return 'text-gray-600 bg-gray-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusIcon = () => {
    if (error) return AlertCircle;
    if (isListening) return Mic;
    if (!isSupported) return MicOff;
    return Mic;
  };

  const StatusIcon = getStatusIcon();

  if (!showFullControls) {
    // Compact floating voice button
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {/* Dappier Copilot positioned above voice button */}
        <div id="dappier-copilot" className="mb-4"></div>
        
        {/* Voice Interface Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <button
            onClick={handleMicrophoneToggle}
            disabled={!isSupported}
            className={`w-14 h-14 rounded-full shadow-strong transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${getStatusColor()}`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Start voice commands'}
          >
            <StatusIcon className="h-6 w-6 mx-auto" />
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-16 right-0 bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Full voice interface controls
  return (
    <div className={`bg-white rounded-xl shadow-soft p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            <Accessibility className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Voice Interface</h3>
            <p className="text-sm text-gray-600">
              {isSupported ? 'Multilingual voice commands available' : 'Voice interface not supported'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Voice settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Permission Status */}
      {hasPermission === false && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">Microphone Permission Required</p>
              <p className="text-yellow-700 text-sm">
                Voice commands need microphone access to work properly.
              </p>
              <button
                onClick={requestMicrophonePermission}
                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Grant Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Voice Input */}
        <div className="text-center">
          <button
            onClick={handleMicrophoneToggle}
            disabled={!isSupported || hasPermission === false}
            className={`w-16 h-16 rounded-full mx-auto mb-3 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor()}`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            <StatusIcon className="h-8 w-8 mx-auto" />
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </button>
          <p className="text-sm font-medium text-gray-900">
            {isListening ? 'Listening...' : 'Voice Input'}
          </p>
          <p className="text-xs text-gray-600">
            Say "Hey Lifeline" to start
          </p>
        </div>

        {/* Volume Control */}
        <div className="text-center">
          <button
            onClick={handleVolumeToggle}
            className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 mx-auto mb-3 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label={isMuted ? 'Unmute voice output' : 'Mute voice output'}
          >
            {isMuted ? <VolumeX className="h-8 w-8 mx-auto" /> : <Volume2 className="h-8 w-8 mx-auto" />}
          </button>
          <p className="text-sm font-medium text-gray-900">
            {isMuted ? 'Muted' : 'Audio On'}
          </p>
          <p className="text-xs text-gray-600">
            Voice feedback
          </p>
        </div>

        {/* Test Voice */}
        <div className="text-center">
          <button
            onClick={testVoiceInterface}
            disabled={!isSupported}
            className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 mx-auto mb-3 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
            aria-label="Test voice interface"
          >
            <Play className="h-8 w-8 mx-auto" />
          </button>
          <p className="text-sm font-medium text-gray-900">Test Voice</p>
          <p className="text-xs text-gray-600">
            Hear sample output
          </p>
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="h-4 w-4 inline mr-2" />
          Language
        </label>
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select voice interface language"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <h4 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h4>
            
            {/* Voice Selection */}
            {availableVoices.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice
                </label>
                <select
                  value={availableVoices.findIndex(v => v === voiceSettings.voice)}
                  onChange={(e) => handleVoiceChange(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={-1}>Default Voice</option>
                  {availableVoices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speech Rate */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Rate: {voiceSettings.rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceSettings.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Adjust speech rate"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Speech Pitch */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Pitch: {voiceSettings.pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Adjust speech pitch"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Voice Commands</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Wake word:</strong> "Hey Lifeline" or "Lifeline"</p>
          <p><strong>Emergency:</strong> "Emergency" or "Urgent help"</p>
          <p><strong>Find donors:</strong> "Find donors" or "Search blood donors"</p>
          <p><strong>Navigate:</strong> "Go to [page]" or "Open [section]"</p>
          <p><strong>Help:</strong> "Help" or "What can you do"</p>
          <p><strong>Stop:</strong> "Stop" or "Cancel"</p>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h5 className="font-medium text-green-900 mb-2">
          <Accessibility className="h-4 w-4 inline mr-2" />
          Accessibility Features
        </h5>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✓ Screen reader compatible</li>
          <li>✓ Keyboard navigation support</li>
          <li>✓ High contrast mode ready</li>
          <li>✓ Adjustable speech settings</li>
          <li>✓ Multiple language support</li>
          <li>✓ Error recovery mechanisms</li>
        </ul>
      </div>
    </div>
  );
}