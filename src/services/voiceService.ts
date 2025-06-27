// Multilingual Voice Interface Service

export interface VoiceConfig {
  language: string;
  voice?: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
  volume: number;
}

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: any;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  language: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private currentConfig: VoiceConfig;
  private wakeWord = 'lifeline';
  private commandTimeout = 5000; // 5 seconds
  private confidenceThreshold = 0.95; // 95% accuracy requirement
  
  // Supported languages with their configurations
  private supportedLanguages = {
    'en-US': {
      name: 'English (US)',
      wakeWords: ['lifeline', 'hey lifeline', 'blood help'],
      commands: {
        'emergency': ['emergency', 'urgent', 'help', 'critical'],
        'find_donors': ['find donors', 'search donors', 'blood donors'],
        'request_blood': ['request blood', 'need blood', 'blood request'],
        'navigate': ['go to', 'open', 'show me', 'navigate to'],
        'repeat': ['repeat', 'say again', 'what did you say'],
        'stop': ['stop', 'cancel', 'exit', 'quit'],
        'help': ['help', 'what can you do', 'commands']
      },
      responses: {
        'welcome': 'Welcome to Lifeline. How can I help you save lives today?',
        'listening': 'I\'m listening...',
        'not_understood': 'I didn\'t understand that. Please try again.',
        'emergency_activated': 'Emergency mode activated. Connecting you to blood request.',
        'donors_found': 'Found {count} compatible donors nearby.',
        'navigation_success': 'Navigating to {destination}.',
        'help_text': 'You can say: Emergency, Find donors, Request blood, or Navigate to any page.'
      }
    },
    'es-ES': {
      name: 'Español (España)',
      wakeWords: ['lifeline', 'oye lifeline', 'ayuda sangre'],
      commands: {
        'emergency': ['emergencia', 'urgente', 'ayuda', 'crítico'],
        'find_donors': ['buscar donantes', 'encontrar donantes', 'donantes de sangre'],
        'request_blood': ['solicitar sangre', 'necesito sangre', 'petición de sangre'],
        'navigate': ['ir a', 'abrir', 'muéstrame', 'navegar a'],
        'repeat': ['repetir', 'di otra vez', 'qué dijiste'],
        'stop': ['parar', 'cancelar', 'salir', 'terminar'],
        'help': ['ayuda', 'qué puedes hacer', 'comandos']
      },
      responses: {
        'welcome': 'Bienvenido a Lifeline. ¿Cómo puedo ayudarte a salvar vidas hoy?',
        'listening': 'Estoy escuchando...',
        'not_understood': 'No entendí eso. Por favor, inténtalo de nuevo.',
        'emergency_activated': 'Modo de emergencia activado. Conectándote a solicitud de sangre.',
        'donors_found': 'Encontré {count} donantes compatibles cerca.',
        'navigation_success': 'Navegando a {destination}.',
        'help_text': 'Puedes decir: Emergencia, Buscar donantes, Solicitar sangre, o Navegar a cualquier página.'
      }
    },
    'hi-IN': {
      name: 'हिन्दी (भारत)',
      wakeWords: ['lifeline', 'हे lifeline', 'खून मदद'],
      commands: {
        'emergency': ['आपातकाल', 'तुरंत', 'मदद', 'गंभीर'],
        'find_donors': ['दाता खोजें', 'रक्तदाता', 'खून दाता'],
        'request_blood': ['खून चाहिए', 'रक्त की जरूरत', 'खून मांगें'],
        'navigate': ['जाएं', 'खोलें', 'दिखाएं', 'नेविगेट करें'],
        'repeat': ['दोहराएं', 'फिर कहें', 'क्या कहा'],
        'stop': ['रुकें', 'रद्द करें', 'बाहर निकलें', 'बंद करें'],
        'help': ['मदद', 'आप क्या कर सकते हैं', 'कमांड']
      },
      responses: {
        'welcome': 'Lifeline में आपका स्वागत है। आज मैं जीवन बचाने में आपकी कैसे मदद कर सकता हूं?',
        'listening': 'मैं सुन रहा हूं...',
        'not_understood': 'मैं समझ नहीं पाया। कृपया फिर से कोशिश करें।',
        'emergency_activated': 'आपातकालीन मोड सक्रिय। रक्त अनुरोध से जोड़ रहा हूं।',
        'donors_found': 'पास में {count} संगत दाता मिले।',
        'navigation_success': '{destination} पर नेविगेट कर रहा हूं।',
        'help_text': 'आप कह सकते हैं: आपातकाल, दाता खोजें, रक्त चाहिए, या किसी भी पेज पर जाएं।'
      }
    },
    'fr-FR': {
      name: 'Français (France)',
      wakeWords: ['lifeline', 'hey lifeline', 'aide sang'],
      commands: {
        'emergency': ['urgence', 'urgent', 'aide', 'critique'],
        'find_donors': ['trouver donneurs', 'chercher donneurs', 'donneurs de sang'],
        'request_blood': ['demander sang', 'besoin de sang', 'demande de sang'],
        'navigate': ['aller à', 'ouvrir', 'montrer', 'naviguer vers'],
        'repeat': ['répéter', 'redire', 'qu\'avez-vous dit'],
        'stop': ['arrêter', 'annuler', 'sortir', 'quitter'],
        'help': ['aide', 'que pouvez-vous faire', 'commandes']
      },
      responses: {
        'welcome': 'Bienvenue sur Lifeline. Comment puis-je vous aider à sauver des vies aujourd\'hui?',
        'listening': 'J\'écoute...',
        'not_understood': 'Je n\'ai pas compris. Veuillez réessayer.',
        'emergency_activated': 'Mode d\'urgence activé. Connexion à la demande de sang.',
        'donors_found': 'Trouvé {count} donneurs compatibles à proximité.',
        'navigation_success': 'Navigation vers {destination}.',
        'help_text': 'Vous pouvez dire: Urgence, Trouver donneurs, Demander sang, ou Naviguer vers n\'importe quelle page.'
      }
    },
    'ar-SA': {
      name: 'العربية (السعودية)',
      wakeWords: ['lifeline', 'هاي lifeline', 'مساعدة دم'],
      commands: {
        'emergency': ['طوارئ', 'عاجل', 'مساعدة', 'حرج'],
        'find_donors': ['البحث عن متبرعين', 'متبرعي الدم', 'العثور على متبرعين'],
        'request_blood': ['طلب دم', 'أحتاج دم', 'طلب الدم'],
        'navigate': ['اذهب إلى', 'افتح', 'أرني', 'انتقل إلى'],
        'repeat': ['كرر', 'قل مرة أخرى', 'ماذا قلت'],
        'stop': ['توقف', 'إلغاء', 'خروج', 'إنهاء'],
        'help': ['مساعدة', 'ماذا يمكنك أن تفعل', 'الأوامر']
      },
      responses: {
        'welcome': 'مرحباً بك في Lifeline. كيف يمكنني مساعدتك في إنقاذ الأرواح اليوم؟',
        'listening': 'أنا أستمع...',
        'not_understood': 'لم أفهم ذلك. يرجى المحاولة مرة أخرى.',
        'emergency_activated': 'تم تفعيل وضع الطوارئ. جاري الاتصال بطلب الدم.',
        'donors_found': 'وجدت {count} متبرعين متوافقين قريبين.',
        'navigation_success': 'الانتقال إلى {destination}.',
        'help_text': 'يمكنك قول: طوارئ، البحث عن متبرعين، طلب دم، أو الانتقال إلى أي صفحة.'
      }
    }
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentConfig = {
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8
    };
    
    this.initializeSpeechRecognition();
    this.loadUserPreferences();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = this.currentConfig.language;
      
      this.setupRecognitionEvents();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.announceStatus('listening');
      this.triggerAccessibilityEvent('voice-listening-started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.triggerAccessibilityEvent('voice-listening-stopped');
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.handleRecognitionError(event.error);
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };
  }

  private handleSpeechResult(event: SpeechRecognitionEvent) {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;

      if (event.results[i].isFinal) {
        if (confidence >= this.confidenceThreshold) {
          finalTranscript += transcript;
        } else {
          // Low confidence - ask for clarification
          this.speak('not_understood');
          return;
        }
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      this.processVoiceCommand(finalTranscript.trim());
    }

    // Update UI with interim results for accessibility
    this.updateTranscriptDisplay(interimTranscript);
  }

  private processVoiceCommand(transcript: string): void {
    const command = this.parseCommand(transcript);
    
    if (!command) {
      this.speak('not_understood');
      return;
    }

    this.executeCommand(command);
  }

  private parseCommand(transcript: string): VoiceCommand | null {
    const lowerTranscript = transcript.toLowerCase();
    const langConfig = this.supportedLanguages[this.currentConfig.language];
    
    // Check for wake word first
    const hasWakeWord = langConfig.wakeWords.some(word => 
      lowerTranscript.includes(word.toLowerCase())
    );

    if (!hasWakeWord && !this.isInActiveSession()) {
      return null; // Ignore commands without wake word
    }

    // Parse command type
    for (const [action, keywords] of Object.entries(langConfig.commands)) {
      for (const keyword of keywords) {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          return {
            command: transcript,
            action,
            confidence: 1.0, // Already filtered by confidence threshold
            parameters: this.extractParameters(transcript, action)
          };
        }
      }
    }

    return null;
  }

  private extractParameters(transcript: string, action: string): any {
    const params: any = {};
    
    switch (action) {
      case 'navigate':
        // Extract destination from "go to [destination]" or "navigate to [destination]"
        const navMatch = transcript.match(/(?:go to|navigate to|open)\s+(.+)/i);
        if (navMatch) {
          params.destination = navMatch[1].trim();
        }
        break;
        
      case 'find_donors':
        // Extract blood type if mentioned
        const bloodTypeMatch = transcript.match(/(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)/i);
        if (bloodTypeMatch) {
          params.bloodType = bloodTypeMatch[1];
        }
        break;
        
      case 'request_blood':
        // Extract urgency and blood type
        const urgencyMatch = transcript.match(/(emergency|urgent|critical|normal)/i);
        if (urgencyMatch) {
          params.urgency = urgencyMatch[1].toLowerCase();
        }
        break;
    }
    
    return params;
  }

  private async executeCommand(command: VoiceCommand): Promise<void> {
    this.triggerAccessibilityEvent('voice-command-executed', { command: command.action });
    
    switch (command.action) {
      case 'emergency':
        await this.handleEmergencyCommand();
        break;
        
      case 'find_donors':
        await this.handleFindDonorsCommand(command.parameters);
        break;
        
      case 'request_blood':
        await this.handleRequestBloodCommand(command.parameters);
        break;
        
      case 'navigate':
        await this.handleNavigationCommand(command.parameters);
        break;
        
      case 'repeat':
        this.repeatLastResponse();
        break;
        
      case 'stop':
        this.stopListening();
        break;
        
      case 'help':
        this.provideHelp();
        break;
        
      default:
        this.speak('not_understood');
    }
  }

  private async handleEmergencyCommand(): Promise<void> {
    this.speak('emergency_activated', 'critical');
    
    // Navigate to emergency page
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/emergency';
    }
    
    // Trigger emergency protocols
    this.triggerAccessibilityEvent('emergency-activated');
  }

  private async handleFindDonorsCommand(params: any): Promise<void> {
    // Simulate finding donors
    const donorCount = Math.floor(Math.random() * 20) + 5;
    
    this.speak('donors_found', 'medium', { count: donorCount });
    
    // Navigate to recipient dashboard
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/recipient-dashboard';
    }
  }

  private async handleRequestBloodCommand(params: any): Promise<void> {
    const urgency = params.urgency || 'normal';
    
    if (urgency === 'emergency' || urgency === 'critical') {
      await this.handleEmergencyCommand();
    } else {
      this.speak('navigation_success', 'medium', { destination: 'blood request form' });
      
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/emergency';
      }
    }
  }

  private async handleNavigationCommand(params: any): Promise<void> {
    const destination = params.destination?.toLowerCase();
    
    const routeMap: { [key: string]: string } = {
      'home': '/',
      'profile': '/profile',
      'dashboard': '/donor-dashboard',
      'donor dashboard': '/donor-dashboard',
      'recipient dashboard': '/recipient-dashboard',
      'blood drives': '/blood-drives',
      'emergency': '/emergency',
      'about': '/about',
      'contact': '/contact',
      'login': '/login',
      'register': '/register'
    };
    
    const route = routeMap[destination] || '/';
    
    this.speak('navigation_success', 'medium', { destination });
    
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = route;
    }
  }

  private repeatLastResponse(): void {
    // Implement last response storage and replay
    const lastResponse = this.getLastResponse();
    if (lastResponse) {
      this.speakText(lastResponse.text, lastResponse.priority);
    } else {
      this.speak('not_understood');
    }
  }

  private provideHelp(): void {
    this.speak('help_text', 'medium');
  }

  public speak(responseKey: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium', params?: any): void {
    const langConfig = this.supportedLanguages[this.currentConfig.language];
    let text = langConfig.responses[responseKey] || responseKey;

    // Replace parameters in text
    if (params) {
      Object.keys(params).forEach(key => {
        text = text.replace(`{${key}}`, params[key]);
      });
    }

    // Translate text if not in English and Lingo is configured
    if (this.currentConfig.language !== 'en-US' && lingoTranslationService.isConfigured()) {
      lingoTranslationService.translate({
        text,
        targetLanguage: this.currentConfig.language.split('-')[0],
        sourceLanguage: 'en',
        context: 'voice-interface'
      })
      .then(result => {
        this.speakText(result.translatedText, priority);
        this.storeLastResponse({ 
          text: result.translatedText, 
          language: this.currentConfig.language, 
          priority 
        });
      })
      .catch(error => {
        console.error('Translation error:', error);
        this.speakText(text, priority);
        this.storeLastResponse({ text, language: this.currentConfig.language, priority });
      });
    } else {
      this.speakText(text, priority);
      this.storeLastResponse({ text, language: this.currentConfig.language, priority });
    }
  }

  public async speakText(text: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    // Try to translate the text if not in English and Lingo is configured
    let finalText = text;
    if (this.currentConfig.language !== 'en-US' && lingoTranslationService.isConfigured()) {
      try {
        const result = await lingoTranslationService.translate({
          text,
          targetLanguage: this.currentConfig.language.split('-')[0],
          sourceLanguage: 'en',
          context: 'voice-interface'
        });
        finalText = result.translatedText;
      } catch (error) {
        console.error('Translation error in speakText:', error);
        // Continue with original text if translation fails
      }
    }
    // Cancel current speech for high priority messages
    if (priority === 'critical' || priority === 'high') {
      this.synthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.lang = this.currentConfig.language;
    utterance.rate = this.currentConfig.rate;
    utterance.pitch = this.currentConfig.pitch;
    utterance.volume = this.currentConfig.volume;
    
    // Set voice if available
    if (this.currentConfig.voice) {
      utterance.voice = this.currentConfig.voice;
    }
    
    // Add accessibility events
    utterance.onstart = () => {
      this.triggerAccessibilityEvent('speech-started', { text: finalText, priority });
    };
    
    utterance.onend = () => {
      this.triggerAccessibilityEvent('speech-ended', { text: finalText, priority });
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.triggerAccessibilityEvent('speech-error', { error: event.error });
    };
    
    this.synthesis.speak(utterance);
  }

  public startListening(): void {
    if (!this.recognition) {
      this.announceError('Speech recognition not supported');
      return;
    }
    
    if (this.isListening) {
      return;
    }
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.announceError('Failed to start voice recognition');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public setLanguage(language: string): void {
    if (this.supportedLanguages[language]) {
      this.currentConfig.language = language;
      
      if (this.recognition) {
        this.recognition.lang = language;
      }
      
      this.saveUserPreferences();
      this.announceStatus('language_changed');
    }
  }

  public setVoiceSettings(settings: Partial<VoiceConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...settings };
    this.saveUserPreferences();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith(this.currentConfig.language.split('-')[0])
    );
  }

  public getSupportedLanguages(): Array<{ code: string; name: string }> {
    return Object.entries(this.supportedLanguages).map(([code, config]) => ({
      code,
      name: config.name
    }));
  }

  private handleRecognitionError(error: string): void {
    let errorMessage = 'Voice recognition error occurred';
    
    switch (error) {
      case 'no-speech':
        errorMessage = 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage = 'Microphone access denied. Please check permissions.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission required for voice commands.';
        break;
      case 'network':
        errorMessage = 'Network error. Voice recognition unavailable.';
        break;
    }
    
    this.announceError(errorMessage);
  }

  private announceStatus(status: string): void {
    const langConfig = this.supportedLanguages[this.currentConfig.language];
    const message = langConfig.responses[status] || status;
    
    // Use ARIA live region for screen readers
    this.updateAriaLiveRegion(message);
  }

  private announceError(error: string): void {
    this.updateAriaLiveRegion(error, 'assertive');
    this.triggerAccessibilityEvent('voice-error', { error });
  }

  private updateAriaLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof document !== 'undefined') {
      let liveRegion = document.getElementById('voice-live-region');
      
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'voice-live-region';
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = message;
    }
  }

  private updateTranscriptDisplay(transcript: string): void {
    if (typeof document !== 'undefined') {
      let transcriptDisplay = document.getElementById('voice-transcript-display');
      
      if (!transcriptDisplay) {
        transcriptDisplay = document.createElement('div');
        transcriptDisplay.id = 'voice-transcript-display';
        transcriptDisplay.setAttribute('aria-label', 'Voice input transcript');
        transcriptDisplay.style.position = 'fixed';
        transcriptDisplay.style.bottom = '20px';
        transcriptDisplay.style.right = '20px';
        transcriptDisplay.style.background = 'rgba(0, 0, 0, 0.8)';
        transcriptDisplay.style.color = 'white';
        transcriptDisplay.style.padding = '10px';
        transcriptDisplay.style.borderRadius = '5px';
        transcriptDisplay.style.maxWidth = '300px';
        transcriptDisplay.style.fontSize = '14px';
        transcriptDisplay.style.zIndex = '9999';
        document.body.appendChild(transcriptDisplay);
      }
      
      transcriptDisplay.textContent = transcript || '';
      transcriptDisplay.style.display = transcript ? 'block' : 'none';
    }
  }

  private triggerAccessibilityEvent(eventType: string, data?: any): void {
    if (typeof document !== 'undefined') {
      const event = new CustomEvent('voice-accessibility', {
        detail: { type: eventType, data }
      });
      document.dispatchEvent(event);
    }
  }

  private isInActiveSession(): boolean {
    // Check if user is in an active voice session
    return this.isListening || this.synthesis.speaking;
  }

  private loadUserPreferences(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('lifeline-voice-preferences');
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          this.currentConfig = { ...this.currentConfig, ...preferences };
        } catch (error) {
          console.error('Failed to load voice preferences:', error);
        }
      }
    }
  }

  private saveUserPreferences(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lifeline-voice-preferences', JSON.stringify(this.currentConfig));
    }
  }

  private storeLastResponse(response: VoiceResponse): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('lifeline-last-voice-response', JSON.stringify(response));
    }
  }

  private getLastResponse(): VoiceResponse | null {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('lifeline-last-voice-response');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Failed to parse last response:', error);
        }
      }
    }
    return null;
  }

  public destroy(): void {
    this.stopListening();
    this.synthesis.cancel();
    
    // Clean up DOM elements
    if (typeof document !== 'undefined') {
      const liveRegion = document.getElementById('voice-live-region');
      const transcriptDisplay = document.getElementById('voice-transcript-display');
      
      if (liveRegion) liveRegion.remove();
      if (transcriptDisplay) transcriptDisplay.remove();
    }
  }
}

export const voiceService = new VoiceService();