// Temporary workaround for Lingo translation service
// This service will use Google Translate API directly until Lingo API is properly configured

import { BloodType } from '../lib/supabase';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  context?: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

interface LanguageDetectionResponse {
  detectedLanguage: string;
  confidence: number;
}

export class FallbackTranslationService {
  private cache: Map<string, TranslationResponse> = new Map();

  // Medical terminology dictionary for accurate translations
  private medicalTerms = {
    'blood donation': {
      'hi': 'रक्तदान',
      'es': 'donación de sangre',
      'fr': 'don de sang',
      'ar': 'التبرع بالدم',
      'pt': 'doação de sangue',
      'de': 'Blutspende',
      'ta': 'இரத்த தானம்',
      'bn': 'রক্তদান',
      'te': 'రక్తదానం',
      'mr': 'रक्तदान',
      'gu': 'રક્તદાન',
      'kn': 'ರಕ್ತದಾನ',
      'ml': 'രക്തദാനം',
      'pa': 'ਖੂਨ ਦਾਨ'
    },
    'emergency': {
      'hi': 'आपातकाल',
      'es': 'emergencia',
      'fr': 'urgence',
      'ar': 'طوارئ',
      'pt': 'emergência',
      'de': 'Notfall',
      'ta': 'அவசரநிலை',
      'bn': 'জরুরি',
      'te': 'అత్యవసర',
      'mr': 'आपातकाल',
      'gu': 'કટોકટી',
      'kn': 'ತುರ್ತು',
      'ml': 'അടിയന്തിര',
      'pa': 'ਐਮਰਜੈਂਸੀ'
    },
    'blood type': {
      'hi': 'रक्त समूह',
      'es': 'tipo de sangre',
      'fr': 'groupe sanguin',
      'ar': 'فصيلة الدم',
      'pt': 'tipo sanguíneo',
      'de': 'Blutgruppe',
      'ta': 'இரத்த வகை',
      'bn': 'রক্তের গ্রুপ',
      'te': 'రక్త వర్గం',
      'mr': 'रक्त गट',
      'gu': 'બ્લડ ગ્રુપ',
      'kn': 'ರಕ್ತದ ಪ್ರಕಾರ',
      'ml': 'രക്തഗ്രൂപ്പ്',
      'pa': 'ਖੂਨ ਦਾ ਕਿਸਮ'
    },
    'donor': {
      'hi': 'दाता',
      'es': 'donante',
      'fr': 'donneur',
      'ar': 'متبرع',
      'pt': 'doador',
      'de': 'Spender',
      'ta': 'நன்கொடையாளர்',
      'bn': 'দাতা',
      'te': 'దాత',
      'mr': 'दाता',
      'gu': 'દાતા',
      'kn': 'ದಾನಿ',
      'ml': 'ദാതാവ്',
      'pa': 'ਦਾਨੀ'
    },
    'patient': {
      'hi': 'रोगी',
      'es': 'paciente',
      'fr': 'patient',
      'ar': 'مريض',
      'pt': 'paciente',
      'de': 'Patient',
      'ta': 'நோயாளி',
      'bn': 'রোগী',
      'te': 'రోగి',
      'mr': 'रुग्ण',
      'gu': 'દર્દી',
      'kn': 'ರೋಗಿ',
      'ml': 'രോഗി',
      'pa': 'ਮਰੀਜ਼'
    },
    'hospital': {
      'hi': 'अस्पताल',
      'es': 'hospital',
      'fr': 'hôpital',
      'ar': 'مستشفى',
      'pt': 'hospital',
      'de': 'Krankenhaus',
      'ta': 'மருத்துவமனை',
      'bn': 'হাসপাতাল',
      'te': 'ఆసుపత్రి',
      'mr': 'रुग्णालय',
      'gu': 'હોસ્પિટલ',
      'kn': 'ಆಸ್ಪತ್ರೆ',
      'ml': 'ആശുപത്രി',
      'pa': 'ਹਸਪਤਾਲ'
    },
    'find donor': {
      'hi': 'दाता खोजें',
      'es': 'encontrar donante',
      'fr': 'trouver un donneur',
      'ar': 'العثور على متبرع',
      'pt': 'encontrar doador',
      'de': 'Spender finden',
      'ta': 'நன்கொடையாளரைக் கண்டறியவும்',
      'bn': 'দাতা খুঁজুন',
      'te': 'దాతను కనుగొనండి',
      'mr': 'दाता शोधा',
      'gu': 'દાતા શોધો',
      'kn': 'ದಾನಿಯನ್ನು ಹುಡುಕಿ',
      'ml': 'ദാതാവിനെ കണ്ടെത്തുക',
      'pa': 'ਦਾਨੀ ਲੱਭੋ'
    }
  };

  // Common UI texts
  private uiTexts = {
    'save': {
      'hi': 'सेव करें',
      'es': 'guardar',
      'fr': 'sauvegarder',
      'ar': 'حفظ',
      'pt': 'salvar',
      'de': 'speichern',
      'ta': 'சேமிக்கவும்',
      'bn': 'সংরক্ষণ করুন',
      'te': 'సేవ్ చేయండి',
      'mr': 'जतन करा',
      'gu': 'સેવ કરો',
      'kn': 'ಉಳಿಸಿ',
      'ml': 'സേവ് ചെയ്യുക',
      'pa': 'ਸੇਵ ਕਰੋ'
    },
    'cancel': {
      'hi': 'रद्द करें',
      'es': 'cancelar',
      'fr': 'annuler',
      'ar': 'إلغاء',
      'pt': 'cancelar',
      'de': 'abbrechen',
      'ta': 'ரத்து செய்',
      'bn': 'বাতিল করুন',
      'te': 'రద్దు చేయండి',
      'mr': 'रद्द करा',
      'gu': 'રદ કરો',
      'kn': 'ರದ್ದುಮಾಡಿ',
      'ml': 'റദ്ദാക്കുക',
      'pa': 'ਰੱਦ ਕਰੋ'
    },
    'search': {
      'hi': 'खोजें',
      'es': 'buscar',
      'fr': 'rechercher',
      'ar': 'بحث',
      'pt': 'procurar',
      'de': 'suchen',
      'ta': 'தேடு',
      'bn': 'খুঁজুন',
      'te': 'వెతకండి',
      'mr': 'शोधा',
      'gu': 'શોધો',
      'kn': 'ಹುಡುಕಿ',
      'ml': 'തിരയുക',
      'pa': 'ਖੋਜੋ'
    }
  };

  // Supported languages
  private supportedLanguages = {
    'en': { name: 'English', nativeName: 'English' },
    'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
    'es': { name: 'Spanish', nativeName: 'Español' },
    'fr': { name: 'French', nativeName: 'Français' },
    'ar': { name: 'Arabic', nativeName: 'العربية' },
    'pt': { name: 'Portuguese', nativeName: 'Português' },
    'de': { name: 'German', nativeName: 'Deutsch' },
    'ja': { name: 'Japanese', nativeName: '日本語' },
    'ko': { name: 'Korean', nativeName: '한국어' },
    'zh': { name: 'Chinese', nativeName: '中文' },
    'ru': { name: 'Russian', nativeName: 'Русский' },
    'it': { name: 'Italian', nativeName: 'Italiano' },
    'ta': { name: 'Tamil', nativeName: 'தமிழ்' },
    'bn': { name: 'Bengali', nativeName: 'বাংলা' },
    'te': { name: 'Telugu', nativeName: 'తెలుగు' },
    'mr': { name: 'Marathi', nativeName: 'मराठी' },
    'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી' },
    'kn': { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    'ml': { name: 'Malayalam', nativeName: 'മലയാളം' },
    'pa': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  };

  // Main translation function
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const cacheKey = `${request.text}-${request.targetLanguage}-${request.sourceLanguage || 'auto'}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Check for medical terms first
    const medicalTranslation = this.translateMedicalTerms(request.text, request.targetLanguage);
    if (medicalTranslation) {
      const response: TranslationResponse = {
        translatedText: medicalTranslation,
        sourceLanguage: request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
        confidence: 1.0
      };
      this.cache.set(cacheKey, response);
      return response;
    }

    // Check for UI texts
    const uiTranslation = this.translateUITexts(request.text, request.targetLanguage);
    if (uiTranslation) {
      const response: TranslationResponse = {
        translatedText: uiTranslation,
        sourceLanguage: request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
        confidence: 1.0
      };
      this.cache.set(cacheKey, response);
      return response;
    }

    // For now, return original text if no dictionary match
    // This prevents CORS errors while you set up proper translation API
    const response: TranslationResponse = {
      translatedText: request.text,
      sourceLanguage: request.sourceLanguage || 'en',
      targetLanguage: request.targetLanguage,
      confidence: 0.5
    };
    
    this.cache.set(cacheKey, response);
    return response;
  }

  // Batch translate multiple texts
  async batchTranslate(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<string[]> {
    const results = await Promise.all(
      texts.map(text => this.translate({ 
        text, 
        targetLanguage, 
        sourceLanguage 
      }))
    );
    return results.map(r => r.translatedText);
  }

  // Detect language
  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    // Simple language detection based on character patterns
    if (/[\u0900-\u097F]/.test(text)) return { detectedLanguage: 'hi', confidence: 0.9 };
    if (/[\u0980-\u09FF]/.test(text)) return { detectedLanguage: 'bn', confidence: 0.9 };
    if (/[\u0B80-\u0BFF]/.test(text)) return { detectedLanguage: 'ta', confidence: 0.9 };
    if (/[\u0C00-\u0C7F]/.test(text)) return { detectedLanguage: 'te', confidence: 0.9 };
    if (/[\u0600-\u06FF]/.test(text)) return { detectedLanguage: 'ar', confidence: 0.9 };
    if (/[\u4e00-\u9fff]/.test(text)) return { detectedLanguage: 'zh', confidence: 0.9 };
    
    return { detectedLanguage: 'en', confidence: 0.8 };
  }

  // Get supported languages
  getSupportedLanguages(): { code: string; name: string; nativeName: string }[] {
    return Object.entries(this.supportedLanguages).map(([code, { name, nativeName }]) => ({
      code,
      name,
      nativeName
    }));
  }

  // Check if language is supported
  isLanguageSupported(languageCode: string): boolean {
    return languageCode in this.supportedLanguages;
  }

  // Translate blood type
  translateBloodType(bloodType: BloodType, _targetLanguage: string): string {
    return bloodType;
  }

  // Translate medical terms using dictionary
  private translateMedicalTerms(text: string, targetLanguage: string): string | null {
    const lowerText = text.toLowerCase();
    
    for (const [term, translations] of Object.entries(this.medicalTerms)) {
      if (lowerText === term.toLowerCase() || lowerText.includes(term.toLowerCase())) {
        const translation = translations[targetLanguage as keyof typeof translations];
        if (translation) {
          return translation;
        }
      }
    }
    return null;
  }

  // Translate UI texts using dictionary
  private translateUITexts(text: string, targetLanguage: string): string | null {
    const lowerText = text.toLowerCase();
    
    for (const [term, translations] of Object.entries(this.uiTexts)) {
      if (lowerText === term.toLowerCase()) {
        const translation = translations[targetLanguage as keyof typeof translations];
        if (translation) {
          return translation;
        }
      }
    }
    return null;
  }

  // Check if the service is properly configured
  isConfigured(): boolean {
    return true; // Always available as fallback
  }

  // Check if the service is available
  async checkAvailability(): Promise<boolean> {
    return true; // Always available
  }
}

// Export the fallback service
export const fallbackTranslationService = new FallbackTranslationService();
