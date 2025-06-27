// Completely free local AI fallback using Ollama
export class OllamaFallbackService {
  private endpoint: string;

  constructor() {
    this.endpoint = 'http://localhost:11434/api/generate';
  }

  async rankDonors(donors: any[], urgencyLevel: string): Promise<any[]> {
    try {
      const prompt = this.buildSimplePrompt(donors, urgencyLevel);
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2:7b',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 500,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Ollama not available');
      }

      const data = await response.json();
      return this.parseOllamaResponse(data.response, donors);

    } catch (error) {
      console.error('Ollama fallback failed:', error);
      return this.basicRanking(donors);
    }
  }

  private buildSimplePrompt(donors: any[], urgencyLevel: string): string {
    const donorList = donors.slice(0, 5).map((d, i) => 
      `${i+1}. ${d.distance_km}km away, ${d.total_donations} donations`
    ).join('\n');

    return `Rank blood donors for ${urgencyLevel} request:\n${donorList}\n\nRank by number (1 is best):`;
  }

  private parseOllamaResponse(response: string, donors: any[]): any[] {
    // Simple parsing for Ollama response
    const numbers = response.match(/\d+/g);
    if (!numbers) return this.basicRanking(donors);

    const ranking = numbers.slice(0, donors.length).map(n => parseInt(n) - 1);
    return ranking.map(index => donors[index]).filter(Boolean);
  }

  private basicRanking(donors: any[]): any[] {
    return donors.sort((a, b) => {
      const scoreA = (50 - a.distance_km) + (a.total_donations * 2);
      const scoreB = (50 - b.distance_km) + (b.total_donations * 2);
      return scoreB - scoreA;
    });
  }
}

export const ollamaFallbackService = new OllamaFallbackService();