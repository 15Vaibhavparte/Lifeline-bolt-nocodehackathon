import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'minimal' | 'dropdown' | 'full';
}

export function LanguageSwitcher({ className = '', variant = 'dropdown' }: LanguageSwitcherProps) {
  const { currentLanguage, supportedLanguages, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={toggleDropdown}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Change language"
          title="Change language"
        >
          <Globe className="h-5 w-5" />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              {supportedLanguages.slice(0, 6).map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span>{language.nativeName}</span>
                  {currentLanguage === language.code && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguageInfo?.nativeName || 'English'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-80 overflow-y-auto"
            >
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500 block">{language.name}</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white rounded-xl shadow-soft p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Globe className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Language Settings</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              currentLanguage === language.code
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{language.nativeName}</div>
              <div className="text-xs text-gray-500">{language.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}