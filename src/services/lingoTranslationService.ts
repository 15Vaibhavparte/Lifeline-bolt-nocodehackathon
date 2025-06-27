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

export class LingoTranslationService {
  private apiKey: string;
  private projectId: string;
  private baseUrl: string;
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
    }
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || '';
    this.projectId = import.meta.env.VITE_LINGO_PROJECT_ID || '';
    this.baseUrl = import.meta.env.VITE_LINGO_BASE_URL || 'https://api.lingo.dev';
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

      // Use Lingo API for translation
      const response = await fetch(`${this.baseUrl}/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Project-ID': this.projectId
        },
        body: JSON.stringify({
          text: request.text,
          target_language: request.targetLanguage,
          source_language: request.sourceLanguage || 'auto',
          context: request.context || 'healthcare',
          domain: 'medical',
          preserve_formatting: true
        })
      });

      if (!response.ok) {
        throw new Error(`Lingo API error: ${response.status}`);
      }

      const data = await response.json();
      
      const translationResponse: TranslationResponse = {
        translatedText: data.translated_text,
        sourceLanguage: data.source_language,
        targetLanguage: data.target_language,
        confidence: data.confidence || 0.9
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
      const response = await fetch(`${this.baseUrl}/v1/batch-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Project-ID': this.projectId
        },
        body: JSON.stringify({
          texts: texts,
          target_language: targetLanguage,
          source_language: sourceLanguage || 'auto',
          context: 'healthcare',
          domain: 'medical'
        })
      });

      if (!response.ok) {
        throw new Error(`Lingo API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translations.map((t: any) => t.translated_text);
    } catch (error) {
      console.error('Batch translation failed:', error);
      return texts; // Return original texts as fallback
    }
  }

  // Detect language
  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Project-ID': this.projectId
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (!response.ok) {
        throw new Error(`Lingo API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        detectedLanguage: data.detected_language,
        confidence: data.confidence
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
  translateBloodType(bloodType: BloodType, targetLanguage: string): string {
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
    return !!this.apiKey && !!this.projectId;
  }

  // Check if the service is available
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Lingo service availability check failed:', error);
      return false;
    }
  }
}

export const lingoTranslationService = new LingoTranslationService();