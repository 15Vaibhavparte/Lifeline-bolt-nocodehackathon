import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  context?: string;
  showOriginal?: boolean;
}

export function TranslatedText({ 
  text, 
  className = '', 
  as: Component = 'span',
  context,
  showOriginal = false
}: TranslatedTextProps) {
  const { translate, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [originalVisible, setOriginalVisible] = useState(showOriginal);

  useEffect(() => {
    // Skip translation if language is English or text is empty
    if (currentLanguage === 'en' || !text) {
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      setIsLoading(true);
      try {
        const result = await translate(text, currentLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLanguage, translate]);

  const toggleOriginal = () => {
    setOriginalVisible(!originalVisible);
  };

  if (currentLanguage === 'en' || !text) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {translatedText}
      
      {showOriginal && (
        <div className="mt-1">
          <button 
            onClick={toggleOriginal}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {originalVisible ? 'Hide original' : 'Show original'}
          </button>
          
          {originalVisible && (
            <div className="text-xs text-gray-600 mt-1 italic">
              Original: {text}
            </div>
          )}
        </div>
      )}
    </Component>
  );
}