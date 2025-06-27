import { useState, useCallback, useEffect } from 'react';
import { lingoTranslationService } from '../services/lingoTranslationService';

interface TranslationState {
  loading: boolean;
  error: string | null;
  currentLanguage: string;
  supportedLanguages: { code: string; name: string; nativeName: string }[];
}

export function useTranslation() {
  const [state, setState] = useState<TranslationState>({
    loading: false,
    error: null,
    currentLanguage: 'en',
    supportedLanguages: lingoTranslationService.getSupportedLanguages()
  });

  // Load user's preferred language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lifeline-language');
    if (savedLanguage && lingoTranslationService.isLanguageSupported(savedLanguage)) {
      setState(prev => ({ ...prev, currentLanguage: savedLanguage }));
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (lingoTranslationService.isLanguageSupported(browserLang)) {
        setState(prev => ({ ...prev, currentLanguage: browserLang }));
        localStorage.setItem('lifeline-language', browserLang);
      }
    }
  }, []);

  // Translate text
  const translate = useCallback(async (text: string, targetLanguage?: string): Promise<string> => {
    if (!text) return '';
    
    // If text is already in the target language, return it as is
    const language = targetLanguage || state.currentLanguage;
    if (language === 'en') return text;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await lingoTranslationService.translate({
        text,
        targetLanguage: language
      });
      
      setState(prev => ({ ...prev, loading: false }));
      return result.translatedText;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Translation failed' 
      }));
      return text; // Return original text as fallback
    }
  }, [state.currentLanguage]);

  // Batch translate multiple texts
  const batchTranslate = useCallback(async (texts: string[], targetLanguage?: string): Promise<string[]> => {
    if (!texts.length) return [];
    
    const language = targetLanguage || state.currentLanguage;
    if (language === 'en') return texts;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await lingoTranslationService.batchTranslate(texts, language);
      setState(prev => ({ ...prev, loading: false }));
      return results;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Batch translation failed' 
      }));
      return texts; // Return original texts as fallback
    }
  }, [state.currentLanguage]);

  // Change current language
  const changeLanguage = useCallback((languageCode: string) => {
    if (lingoTranslationService.isLanguageSupported(languageCode)) {
      setState(prev => ({ ...prev, currentLanguage: languageCode }));
      localStorage.setItem('lifeline-language', languageCode);
    } else {
      setState(prev => ({ 
        ...prev, 
        error: `Language ${languageCode} is not supported` 
      }));
    }
  }, []);

  // Detect language of text
  const detectLanguage = useCallback(async (text: string) => {
    if (!text) return { detectedLanguage: 'en', confidence: 0 };
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await lingoTranslationService.detectLanguage(text);
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Language detection failed' 
      }));
      return { detectedLanguage: 'en', confidence: 0 };
    }
  }, []);

  return {
    translate,
    batchTranslate,
    changeLanguage,
    detectLanguage,
    loading: state.loading,
    error: state.error,
    currentLanguage: state.currentLanguage,
    supportedLanguages: state.supportedLanguages,
    isConfigured: lingoTranslationService.isConfigured()
  };
}