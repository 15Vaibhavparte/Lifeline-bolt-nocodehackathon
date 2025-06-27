import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { voiceService } from '../services/voiceService';

interface VoiceAccessibilityContextType {
  announcePageChange: (pageName: string) => void;
  announceAction: (action: string) => void;
  announceError: (error: string) => void;
  announceSuccess: (message: string) => void;
}

const VoiceAccessibilityContext = createContext<VoiceAccessibilityContextType | undefined>(undefined);

interface VoiceAccessibilityProviderProps {
  children: ReactNode;
}

export function VoiceAccessibilityProvider({ children }: VoiceAccessibilityProviderProps) {
  useEffect(() => {
    // Set up global accessibility event listeners
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.getAttribute('aria-label')) {
        const label = target.getAttribute('aria-label');
        if (label) {
          voiceService.speakText(`Focused: ${label}`, 'low');
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'BUTTON') {
        const text = target.textContent || target.getAttribute('aria-label') || 'Button';
        voiceService.speakText(`Activated: ${text}`, 'low');
      }
    };

    // Add event listeners with passive option for better performance
    document.addEventListener('focus', handleFocus, { passive: true, capture: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('focus', handleFocus, { capture: true });
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const announcePageChange = (pageName: string) => {
    voiceService.speakText(`Navigated to ${pageName}`, 'medium');
  };

  const announceAction = (action: string) => {
    voiceService.speakText(action, 'low');
  };

  const announceError = (error: string) => {
    voiceService.speakText(`Error: ${error}`, 'high');
  };

  const announceSuccess = (message: string) => {
    voiceService.speakText(`Success: ${message}`, 'medium');
  };

  const contextValue: VoiceAccessibilityContextType = {
    announcePageChange,
    announceAction,
    announceError,
    announceSuccess
  };

  return (
    <VoiceAccessibilityContext.Provider value={contextValue}>
      {children}
    </VoiceAccessibilityContext.Provider>
  );
}

export function useVoiceAccessibility() {
  const context = useContext(VoiceAccessibilityContext);
  if (context === undefined) {
    throw new Error('useVoiceAccessibility must be used within a VoiceAccessibilityProvider');
  }
  return context;
}