# Lingo.dev AI Translation Integration Guide

## Overview

This guide explains how to use the Lingo.dev AI translation service integrated into the Lifeline blood donation platform. The integration provides high-quality, context-aware translations for medical terminology and general content across the application.

## Setup Instructions

### 1. Create a Lingo.dev Account
1. Visit [Lingo.dev](https://lingo.dev) and sign up for an account
2. Create a new project for your blood donation platform
3. Get your API key and project ID from the dashboard

### 2. Configure Environment Variables
Add the following to your `.env` file:
```
VITE_LINGO_API_KEY=your_lingo_api_key
VITE_LINGO_PROJECT_ID=your_lingo_project_id
VITE_LINGO_BASE_URL=https://api.lingo.dev
```

### 3. Restart Your Development Server
After adding the environment variables, restart your development server for the changes to take effect.

## Using Translation in Components

### Basic Text Translation
Use the `TranslatedText` component to automatically translate any text content:

```jsx
import { TranslatedText } from '../components/TranslatedText';

// Simple usage
<TranslatedText text="Donate blood today and save lives" />

// With custom element type
<TranslatedText 
  text="Your donation can help up to 3 people in need" 
  as="p" 
  className="text-lg text-gray-700" 
/>

// With original text toggle
<TranslatedText 
  text="Blood donation is a safe and simple procedure" 
  showOriginal={true} 
/>
```

### Language Switcher
Add the language switcher to allow users to change their preferred language:

```jsx
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// Minimal version (icon only)
<LanguageSwitcher variant="minimal" />

// Dropdown version
<LanguageSwitcher variant="dropdown" />

// Full version (for settings page)
<LanguageSwitcher variant="full" />
```

### Programmatic Translation
Use the translation hook for programmatic translations:

```jsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { 
    translate, 
    batchTranslate, 
    changeLanguage, 
    currentLanguage 
  } = useTranslation();

  const handleTranslate = async () => {
    const translated = await translate('Hello, how are you?');
    console.log(translated);
  };

  const handleBatchTranslate = async () => {
    const texts = ['Hello', 'Thank you', 'Goodbye'];
    const translated = await batchTranslate(texts);
    console.log(translated);
  };

  return (
    // Your component JSX
  );
}
```

## Supported Languages

The integration supports 20 languages including:
- English
- Hindi
- Spanish
- French
- Arabic
- Portuguese
- German
- Japanese
- Korean
- Chinese
- Russian
- Italian
- Tamil
- Bengali
- Telugu
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi

## Medical Terminology

The translation service is optimized for medical terminology related to blood donation, including:
- Blood types (A+, B-, O+, etc.)
- Medical procedures
- Donation terminology
- Emergency terms

## Voice Interface Integration

The translation service is integrated with the voice interface, allowing for:
- Translated voice commands
- Multilingual voice responses
- Language detection for user input

## Performance Considerations

- Translations are cached to improve performance and reduce API calls
- Critical medical terms use a local dictionary for instant, accurate translations
- Batch translation is used for multiple text elements to reduce API calls

## Troubleshooting

### Common Issues

1. **Translations not working**
   - Check that your API key and project ID are correctly set in the `.env` file
   - Verify that the language is supported
   - Check the browser console for any API errors

2. **Incorrect medical translations**
   - Report specific terminology issues to improve the medical dictionary

3. **Performance issues**
   - Consider using batch translations for multiple elements
   - Implement lazy loading for translated content

### Support

For issues with the Lingo.dev integration, contact:
- Email: support@lingo.dev
- Documentation: https://docs.lingo.dev

## Future Enhancements

Planned improvements to the translation system:
- Offline translation support
- Custom medical terminology dictionary expansion
- Voice-to-voice translation for phone calls
- Real-time conversation translation for donor-recipient communication

## Credits

This integration uses the Lingo.dev AI Translation API, which provides high-quality, context-aware translations optimized for medical terminology.