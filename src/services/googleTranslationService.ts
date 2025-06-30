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

export class GoogleTranslationService {
  private apiKey: string;
  private baseUrl: string = 'https://translation.googleapis.com/language/translate/v2';
  private cache: Map<string, TranslationResponse> = new Map();

  // Supported languages for blood donation platform
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
      'bn': 'রক্তদান'
    },
    'emergency': {
      'hi': 'आपातकाल',
      'es': 'emergencia',
      'fr': 'urgence',
      'ar': 'طوارئ',
      'pt': 'emergência',
      'de': 'Notfall',
      'ta': 'அவசரநிலை',
      'bn': 'জরুরি'
    },
    'blood type': {
      'hi': 'रक्त समूह',
      'es': 'tipo de sangre',
      'fr': 'groupe sanguin',
      'ar': 'فصيلة الدم',
      'pt': 'tipo sanguíneo',
      'de': 'Blutgruppe',
      'ta': 'இரத்த வகை',
      'bn': 'রক্তের গ্রুপ'
    },
    'donor': {
      'hi': 'दाता',
      'es': 'donante',
      'fr': 'donneur',
      'ar': 'متبرع',
      'pt': 'doador',
      'de': 'Spender',
      'ta': 'நன்கொடையாளர்',
      'bn': 'দাতা'
    },
    'patient': {
      'hi': 'रोगी',
      'es': 'paciente',
      'fr': 'patient',
      'ar': 'مريض',
      'pt': 'paciente',
      'de': 'Patient',
      'ta': 'நோயாளி',
      'bn': 'রোগী'
    }
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || import.meta.env.VITE_GOOGLE_AI_KEY || '';
  }

  // Main translation function
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const cacheKey = `${request.text}-${request.targetLanguage}-${request.sourceLanguage || 'auto'}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Check for medical terms and use dictionary if available
      const dictionaryTranslation = this.translateMedicalTerms(request.text, request.targetLanguage);
      if (dictionaryTranslation) {
        const response: TranslationResponse = {
          translatedText: dictionaryTranslation,
          sourceLanguage: request.sourceLanguage || 'en',
          targetLanguage: request.targetLanguage,
          confidence: 1.0
        };
        this.cache.set(cacheKey, response);
        return response;
      }

      // Use Google Translate API
      const params = new URLSearchParams({
        key: this.apiKey,
        q: request.text,
        target: request.targetLanguage,
        format: 'text'
      });

      if (request.sourceLanguage && request.sourceLanguage !== 'auto') {
        params.append('source', request.sourceLanguage);
      }

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      
      const translationResponse: TranslationResponse = {
        translatedText: data.data.translations[0].translatedText,
        sourceLanguage: data.data.translations[0].detectedSourceLanguage || request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
        confidence: 0.95
      };

      // Cache the result
      this.cache.set(cacheKey, translationResponse);
      
      return translationResponse;
    } catch (error) {
      console.error('Translation failed:', error);
      
      // Fallback to basic translation or return original
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
        confidence: 0
      };
    }
  }

  // Batch translate multiple texts
  async batchTranslate(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<string[]> {
    try {
      const translations = await Promise.all(
        texts.map(text => this.translate({
          text,
          targetLanguage,
          sourceLanguage
        }))
      );
      
      return translations.map(t => t.translatedText);
    } catch (error) {
      console.error('Batch translation failed:', error);
      return texts; // Return original texts as fallback
    }
  }

  // Detect language
  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        q: text
      });

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      const detection = data.data.detections[0][0];
      
      return {
        detectedLanguage: detection.language,
        confidence: detection.confidence
      };
    } catch (error) {
      console.error('Language detection failed:', error);
      return {
        detectedLanguage: 'en',
        confidence: 0
      };
    }
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
    // Blood types are typically the same across languages
    return bloodType;
  }

  // Translate medical terms using dictionary
  private translateMedicalTerms(text: string, targetLanguage: string): string | null {
    // Check if the text is a known medical term
    for (const [term, translations] of Object.entries(this.medicalTerms)) {
      if (text.toLowerCase() === term.toLowerCase()) {
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
    return !!this.apiKey;
  }

  // Check if the service is available
  async checkAvailability(): Promise<boolean> {
    try {
      // Test with a simple translation
      const response = await this.translate({
        text: 'test',
        targetLanguage: 'es'
      });
      return response.confidence > 0;
    } catch (error) {
      console.error('Google Translate service availability check failed:', error);
      return false;
    }
  }
}

export const googleTranslationService = new GoogleTranslationService();
