/**
 * serper_provider.js
 * Standalone module to wrap Serper.dev Google Search API
 */

const SerperProvider = {
  async search(query, apiKey, location = "us") {
    if (!apiKey) throw new Error("SERPER_API_KEY is missing");

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "q": query,
      "gl": location,
      "hl": "en",
      "autocorrect": true
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // Retry logic with exponential backoff
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        const response = await fetch("https://google.serper.dev/search", requestOptions);
        
        if (response.status === 429 || response.status === 503) {
          throw new Error(`Serper API ${response.status}`);
        }

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Serper API Error");
        }

        const data = await response.json();
        return {
          organic: data.organic || [],
          peopleAlsoAsk: data.peopleAlsoAsk || [],
          snippets: (data.organic || []).map(res => res.snippet).join("\n")
        };
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  },

  /**
   * Deep Research: Breaks a problem into 3 queries and aggregates results
   */
  async deepResearch(problemStatement, apiKey) {
    // 1. Generate 3 distinct queries (simulated logic, or could use LLM to generate these)
    // For now, we'll use keyword-based expansion
    const queries = [
      `${problemStatement} market gaps and current solutions`,
      `${problemStatement} recommended tech stack and architecture`,
      `${problemStatement} competitive analysis and unique selling points`
    ];

    const results = await Promise.all(queries.map(q => this.search(q, apiKey)));
    
    return {
      aggregatedOrganic: results.flatMap(r => r.organic),
      aggregatedSnippets: results.map((r, i) => `--- Query: ${queries[i]} ---\n${r.snippets}`).join("\n\n"),
      aggregatedPAA: results.flatMap(r => r.peopleAlsoAsk)
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerperProvider;
} else {
  window.SerperProvider = SerperProvider;
}
