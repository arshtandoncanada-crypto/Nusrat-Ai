export default async function handler(req, res) {
  // 1. Security check: Only allow POST requests (data being sent to us)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Grab the text the user typed in your website
  const { textToRewrite } = req.body;
  
  // 3. Vercel will secretly inject your Gemini API key here later
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing from server' });
  }

  try {
    // 4. Send the text to Google's Gemini AI
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `You are an expert copywriter. Please paraphrase the following text to make it sound modern, clean, and professional: ${textToRewrite}` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    // 5. Send the AI's response back to your Nusrat Ai website
    res.status(200).json(data);
    
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'Failed to rewrite text' });
  }
}