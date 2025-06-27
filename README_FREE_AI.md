# Free AI Integration Guide for Lifeline

## Overview
This guide shows how to integrate **completely free AI** into your blood matching app, since the PRD doesn't specify which AI services to use.

## Free AI Options (Ranked by Cost)

### 1. 🥇 Google AI (Gemini) - BEST FREE OPTION
- **Cost**: Completely free for reasonable usage
- **Limits**: 60 requests/minute
- **Setup**: 
  ```bash
  # 1. Get free API key at https://ai.google.dev/
  # 2. Add to .env:
  VITE_GOOGLE_AI_KEY=your_key_here
  ```

### 2. 🥈 Ollama (Local AI) - 100% FREE
- **Cost**: Completely free (runs on your computer)
- **Setup**:
  ```bash
  # Install Ollama
  curl -fsSL https://ollama.ai/install.sh | sh
  
  # Download free models
  ollama pull llama2:7b      # 7B model (4GB)
  ollama pull mistral:7b     # Alternative model
  
  # Start Ollama server
  ollama serve
  ```

### 3. 🥉 OpenAI - LIMITED FREE
- **Cost**: $5 free credit (then paid)
- **Good for**: Testing and prototyping
- **Setup**: Get key at https://platform.openai.com/

## Implementation Strategy

### Tier 1: Google AI (Primary)
```javascript
// Use Google AI for main matching
const primaryMatching = await freeAIMatchingService.findOptimalMatches(
  bloodType, urgencyLevel, lat, lon
);
```

### Tier 2: Ollama (Fallback)
```javascript
// If Google AI fails, use local Ollama
const fallbackMatching = await ollamaFallbackService.rankDonors(
  donors, urgencyLevel
);
```

### Tier 3: Basic Algorithm (Emergency)
```javascript
// If all AI fails, use rule-based matching
const emergencyMatching = basicMatchingAlgorithm(donors);
```

## Cost Analysis

| Service | Monthly Cost | Requests/Month | Best For |
|---------|-------------|----------------|----------|
| Google AI | **$0** | ~100,000 | Production |
| Ollama | **$0** | Unlimited | Privacy-focused |
| OpenAI | $5 credit | ~25,000 | Testing |
| Basic Algorithm | **$0** | Unlimited | Fallback |

## Getting Started

1. **Choose Google AI** (recommended):
   ```bash
   # Get free API key
   open https://ai.google.dev/
   
   # Add to .env
   echo "VITE_GOOGLE_AI_KEY=your_key" >> .env
   ```

2. **Install Ollama** (backup):
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama pull llama2:7b
   ```

3. **Test the integration**:
   ```javascript
   import { useFreeAI } from './hooks/useFreeAI';
   
   const { findMatches } = useFreeAI();
   const result = await findMatches({
     bloodType: 'O+',
     urgencyLevel: 'high',
     hospitalLat: 19.0760,
     hospitalLon: 72.8777
   });
   ```

## Performance Expectations

- **Google AI**: 2-5 seconds response time
- **Ollama**: 5-15 seconds (depends on hardware)
- **Basic Algorithm**: <1 second

## Scaling Strategy

1. **Start**: Google AI free tier
2. **Growth**: Add Ollama for redundancy
3. **Scale**: Consider paid AI services when needed

This approach gives you production-ready AI matching with **zero ongoing costs**.