export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { textToRewrite } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing from Vercel' });
  }

  try {
    // Upgraded to the newest gemini-2.5-flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `You are an expert copywriter. Paraphrase the following text to sound modern, clear, and professional. Return only the paraphrased text: ${textToRewrite}` 
          }] 
        }]
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
