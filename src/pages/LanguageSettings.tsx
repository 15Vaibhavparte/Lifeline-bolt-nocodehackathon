import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  MessageSquare,
  FileText,
  Headphones,
  Smartphone
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TranslatedText } from '../components/TranslatedText';

export function LanguageSettings() {
  const { 
    translate, 
    batchTranslate, 
    detectLanguage, 
    loading, 
    error, 
    currentLanguage, 
    supportedLanguages,
    isConfigured
  } = useTranslation();
  
  const [testText, setTestText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleTranslate = async () => {
    if (!testText) return;
    
    setIsTranslating(true);
    try {
      const result = await translate(testText);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectLanguage = async () => {
    if (!testText) return;
    
    setIsDetecting(true);
    try {
      const result = await detectLanguage(testText);
      setDetectedLanguage(result.detectedLanguage);
    } catch (error) {
      console.error('Language detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const exampleTexts = {
    'emergency': 'Emergency blood request for patient with severe trauma. O- blood needed urgently.',
    'donation': 'Thank you for your blood donation. Your generosity helps save lives.',
    'eligibility': 'To be eligible for blood donation, you must be at least 18 years old and weigh at least 50kg.',
    'notification': 'A compatible blood donor has been found for your request. Please check your notifications.'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Language Settings</h1>
          <p className="text-lg text-gray-600">
            Configure language preferences and test translations
          </p>
        </motion.div>

        {/* Configuration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-xl border-2 ${
            isConfigured 
              ? 'border-green-200 bg-green-50' 
              : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isConfigured ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            )}
            <div>
              <h3 className={`text-lg font-semibold ${
                isConfigured ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {isConfigured ? 'Translation Service Configured' : 'Translation Service Not Fully Configured'}
              </h3>
              <p className={`${
                isConfigured ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isConfigured 
                  ? 'Lingo.dev AI translation is ready to use'
                  : 'Please add your Lingo.dev API key to enable translations'
                }
              </p>
            </div>
          </div>
          
          {!isConfigured && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Configuration Instructions</h4>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>Sign up at <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lingo.dev</a></li>
                <li>Create a new project and get your API key</li>
                <li>Add the following to your <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file:
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                    VITE_LINGO_API_KEY=your_api_key_here<br/>
                    VITE_LINGO_PROJECT_ID=your_project_id_here
                  </pre>
                </li>
                <li>Restart your development server</li>
              </ol>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LanguageSwitcher variant="full" />
          </motion.div>

          {/* Translation Testing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Translation Test</h3>
                  <p className="text-sm text-gray-600">Try translating text to different languages</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter text to translate
                </label>
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type or paste text here..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleTranslate}
                  disabled={!testText || isTranslating || !isConfigured}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Translate</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDetectLanguage}
                  disabled={!testText || isDetecting || !isConfigured}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isDetecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Detect Language</span>
                    </>
                  )}
                </button>
              </div>

              {translatedText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Translation Result:</h4>
                  <p className="text-gray-800">{translatedText}</p>
                  
                  {detectedLanguage && (
                    <div className="mt-2 text-sm text-gray-600">
                      Detected language: {
                        supportedLanguages.find(l => l.code === detectedLanguage)?.name || 
                        detectedLanguage
                      }
                    </div>
                  )}
                </div>
              )}

              {/* Example Texts */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Try these examples:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(exampleTexts).map(([key, text]) => (
                    <button
                      key={key}
                      onClick={() => setTestText(text)}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      {text.length > 60 ? text.substring(0, 60) + '...' : text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Translation Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Content Translation</h3>
            </div>
            <p className="text-gray-600 text-sm">
              <TranslatedText 
                text="All platform content is automatically translated to your preferred language, ensuring a seamless experience for users worldwide."
              />
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Voice Integration</h3>
            </div>
            <p className="text-gray-600 text-sm">
              <TranslatedText 
                text="Voice commands and responses are available in multiple languages, making the platform accessible to users with different language preferences."
              />
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Mobile Support</h3>
            </div>
            <p className="text-gray-600 text-sm">
              <TranslatedText 
                text="Translations work seamlessly on all devices, ensuring consistent multilingual support across desktop and mobile interfaces."
              />
            </p>
          </div>
        </motion.div>

        {/* Supported Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-soft p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Supported Languages</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {supportedLanguages.map((language) => (
              <div 
                key={language.code}
                className={`p-3 rounded-lg border ${
                  currentLanguage === language.code 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className={`font-medium ${
                    currentLanguage === language.code ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// Default export for lazy loading
export default LanguageSettings;
