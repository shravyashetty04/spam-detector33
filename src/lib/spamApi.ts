const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export interface SpamResult {
  result: boolean;
}

export async function checkSpam(input: string): Promise<SpamResult> {
  if (!API_BASE_URL) {
    // Mock mode: simulate the API with keyword-based heuristic
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const spamKeywords = [
      "subscribe", "check out", "free", "click here", "win", "visit my",
      "buy now", "http", "www.", ".com", "giveaway", "follow me",
    ];
    const lower = input.toLowerCase();
    const isSpam = spamKeywords.some((kw) => lower.includes(kw));
    return { result: isSpam };
  }

  const res = await fetch(`${API_BASE_URL}/api/${encodeURIComponent(input)}`);
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}
