import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationContextType {
  translate: (text: string, targetLanguage?: string) => Promise<string>;
  batchTranslate: (texts: string[], targetLanguage?: string) => Promise<string[]>;
  changeLanguage: (languageCode: string) => void;
  detectLanguage: (text: string) => Promise<{ detectedLanguage: string; confidence: number }>;
  loading: boolean;
  error: string | null;
  currentLanguage: string;
  supportedLanguages: { code: string; name: string; nativeName: string }[];
  isConfigured: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const translation = useTranslation();

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}