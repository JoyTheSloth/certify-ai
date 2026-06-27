export const generateText = async (req, res) => {
  const { promptType, courseName, recipientName, organizationName, additionalContext, tone } = req.body;

  if (!courseName) {
    return res.status(400).json({ error: 'Course or Event Name is required to write certificate text.' });
  }

  // Construct clean prompt for Groq
  let prompt = '';
  if (promptType === 'appreciation') {
    prompt = `Write a formal, inspiring, and elegant appreciation statement thanking "${recipientName}" for their active participation and dedication in "${courseName}".`;
  } else if (promptType === 'citation') {
    prompt = `Write a highly professional and prestigious citation paragraph recognizing the exceptional accomplishments and excellence of "${recipientName}" in the field of "${courseName}".`;
  } else {
    // Default description
    prompt = `Write a standard professional certificate description paragraph stating that the candidate has successfully completed all coursework, exercises, and requirements for the program "${courseName}".`;
  }

  if (organizationName) {
    prompt += ` This was awarded by the organization "${organizationName}".`;
  }
  if (additionalContext) {
    prompt += ` Context regarding achievements: ${additionalContext}.`;
  }

  prompt += ` The tone should be ${tone || 'Professional'}. Make it exactly 2 to 3 sentences long, extremely polished, and suitable for printing on a premium certificate. Do NOT include quotes or markdown code formatting. Only return the plain text paragraph.`;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey === '') {
    console.warn('WARNING: GROQ_API_KEY is not configured. Fallback copywriter active.');
    return generateFallback(res, promptType, recipientName, courseName, organizationName);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional certificate copywriter. You write elegant, concise recognition statements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();

    return res.json({ text });
  } catch (err) {
    console.error('Groq API Error:', err.message);
    return generateFallback(res, promptType, recipientName, courseName, organizationName, err.message);
  }
};

const generateFallback = (res, promptType, recipientName, courseName, organizationName, errorMsg = '') => {
  let fallbackText = '';
  const org = organizationName || 'our academy';

  if (promptType === 'appreciation') {
    fallbackText = `This certificate is proudly awarded to ${recipientName} in recognition of outstanding commitment, active participation, and dedication shown during the "${courseName}" workshop conducted by ${org}.`;
  } else if (promptType === 'citation') {
    fallbackText = `In special recognition of exemplary competence, academic honor, and outstanding achievements demonstrated by ${recipientName} during the assessment reviews for "${courseName}".`;
  } else {
    fallbackText = `For successfully completing all technical lectures, practical workshops, and code assessments associated with the curriculum of "${courseName}", and demonstrating proficiency in all evaluations.`;
  }

  return res.json({
    text: fallbackText,
    warning: 'Fallback text generated.',
    error: errorMsg
  });
};
