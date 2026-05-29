export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // We now accept the custom prompt built by the frontend modes
  const { prompt } = req.body; 
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing from Vercel' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        // Strict system instructions so it acts exactly like QuillBot
        systemInstruction: {
          parts: [{
            text: `You are an expert copywriter, editor, and linguist. Your task is to follow the user's instructions to rewrite the provided text. CRITICAL RULES: 1. ONLY return the paraphrased text. 2. DO NOT include any conversational filler (e.g., "Here is your text:"). 3. DO NOT wrap the output in quotes unless the original text had them. 4. Maintain the same language as the input text.`
          }]
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Google AI Error:", data);
      return res.status(500).json({ error: data.error?.message || 'Google AI rejected the request' });
    }
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Server Fetch Error:", error);
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
}
