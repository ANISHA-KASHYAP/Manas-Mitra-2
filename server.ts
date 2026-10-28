import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  detectCrisisIntent,
  CRISIS_RESPONSE_EN,
  CRISIS_RESPONSE_HI,
  SAFETY_DISCLAIMER,
} from './src/lib/safety.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key.includes('MY_GEMINI_API_KEY') || key.includes('your_gemini_api_key')) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI client:', err);
    return null;
  }
}

/**
 * 1. AI Mental Wellness Chatbot Endpoint
 * Includes strict risk detection filter and Tele-MANAS safety coordination.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'English', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message text required' });
    }

    // 1. Critical Crisis & Distress Pre-Screening
    if (detectCrisisIntent(message)) {
      const isHindi = language.toLowerCase().includes('hindi');
      return res.json({
        reply: isHindi ? CRISIS_RESPONSE_HI : CRISIS_RESPONSE_EN,
        isCrisis: true,
        disclaimer: SAFETY_DISCLAIMER,
      });
    }

    // 2. Check if Gemini API Key is configured on the server
    const aiClient = getAiClient();
    if (!aiClient) {
      return res.json({
        isMissingKey: true,
        reply:
          'Notice: The GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY into your secrets or .env file to activate real-time Gemini AI responses. (Indian Tele-MANAS safety protocols and offline tools remain fully active).',
        isCrisis: false,
      });
    }

    // 3. Construct Deeply Empathetic System Instruction & Conversation
    const systemInstruction = `You are "Manas Mitra" (मानस मित्र), an extraordinarily empathetic, intelligent, culturally attuned AI wellness companion created specifically for Indian college and engineering students.

COMMUNICATION PHILOSOPHY & TONE:
- Tone: Warm, validating, non-judgmental, grounded, brotherly/sisterly mentor (like a caring senior or trusted counselor).
- Languages: Masterfully support English, pure Hindi (हिन्दी), and natural conversational Hinglish (e.g. "yaar padhai nahi ho rahi", "marks ko lekar anxiety hai", "attendance short hai"). Mirror the student's chosen language style naturally.
- Culture Context: Deeply understand Indian college realities:
  * Mid-sem/End-sem exam panic, bulky syllabi, lab record submissions, viva fear
  * Backlogs, CGPA/SGPA drops, fear of disappointing parents
  * Placement aptitude tests, coding rounds, interview rejections, imposter syndrome
  * Hostel life: mess food fatigue, roommate friction, late-night homesickness, feeling left behind
  * Procrastination-guilt spirals and screen doomscrolling

RESPONSE STRUCTURE:
1. Warm Emotional Validation: Truly hear and acknowledge their emotional state first. Never dismiss their pain or say "just don't worry".
2. Realistic Micro-Step: Provide 1 or 2 small, completely doable steps right now (e.g. 5-minute rule, 4-7-8 breathing, drinking water, picking just 1 easy topic).
3. Perspective Shift: Offer a gentle, comforting truth (e.g., "A semester is just a chapter, not your whole story").
4. Interactive Follow-up: Conclude with a warm, conversational question inviting them to share more.
- Length: Keep responses conversational (around 2-3 short, breathable paragraphs). Avoid dry robotic bullet lists unless specifically asked.
- Ethical Boundaries: You are a peer-level wellness companion, NOT a psychiatric diagnostic doctor. Do not diagnose illnesses.
- Safety: If the student expresses despair or urges of self-harm, gently advise reaching out to a human and prominently provide Tele-MANAS (14416 / 1-800-891-4416).`;

    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'Mitra'}: ${h.text}`)
          .join('\n\n')
      : '';

    const prompt = formattedHistory
      ? `${systemInstruction}\n\n[Previous conversation]:\n${formattedHistory}\n\nStudent: ${message}\nMitra (in ${language}):`
      : `${systemInstruction}\n\nStudent: ${message}\nMitra (in ${language}):`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.75,
      },
    });

    const reply = response.text || 'I am here with you. Take a slow, gentle breath. How can I best support you right now?';
    return res.json({ reply, isCrisis: false });
  } catch (error: any) {
    console.warn('Chat API notice (transient upstream):', error?.status || error?.message || error);
    
    // Intelligent Domain-Aware Offline / Latency Fallback Engine
    const isHindi = req.body?.language && req.body.language.toLowerCase().includes('hindi');
    const msgLower = (req.body?.message || '').toLowerCase();

    let supportiveFallback = '';

    if (msgLower.includes('exam') || msgLower.includes('padhai') || msgLower.includes('study') || msgLower.includes('syllabus') || msgLower.includes('marks') || msgLower.includes('cgpa')) {
      supportiveFallback = isHindi
        ? 'मैं आपकी बात बहुत अच्छे से समझ रहा हूँ। जब परीक्षा सिर पर हो और सिलेबस बहुत बड़ा लगे, तो घबराहट होना बहुत स्वाभाविक है। सबसे पहले एक गहरी सांस लें—आपके अंक आपकी पूरी पहचान नहीं हैं।\n\nअभी के लिए सिर्फ एक छोटा कदम उठाइए: पूरा सिलेबस एक साथ मत देखिए। बस आने वाले 30 मिनट के लिए सबसे ज़रूरी एक आसान टॉपिक चुनिए और टाइमर लगाकर पढ़िए। 30 मिनट बाद 5 मिनट का ब्रेक लें।\n\nक्या आप मुझे बता सकते हैं कि कौन से विषय या टॉपिक को लेकर सबसे ज्यादा टेंशन हो रही है?'
        : 'I hear you completely. When exam dates draw near and the syllabus feels like a mountain, feeling overwhelmed is completely natural. Take a slow breath with me—your GPA is an academic metric, not your worth as a human being.\n\nHere is a gentle 10-minute micro-step: Stop looking at the entire syllabus right now. Pick just one single concept or past-year question. Set a timer for 25 minutes and just focus on that one piece. Once the timer rings, stretch and hydrate.\n\nWhich specific subject or chapter is causing you the most anxiety right now?';
    } else if (msgLower.includes('sleep') || msgLower.includes('neend') || msgLower.includes('night') || msgLower.includes('raat') || msgLower.includes('overthinking')) {
      supportiveFallback = isHindi
        ? 'रात के समय जब हॉस्टल या कमरा शांत होता है, तो दिमाग में चिंताओं का चक्रव्यूह और तेज़ चलने लगता है। यह बहुत से छात्रों के साथ होता है।\n\nअपने बिस्तर पर बैठकर 4-7-8 तकनीक अपनाइए: 4 सेकंड नाक से सांस अंदर लें, 7 सेकंड धीरे से रोकें, और 8 सेकंड मुँह से छोड़ें। अपने फोन को कम से कम 15 मिनट के लिए तकिए से दूर रख दें।\n\nक्या कोई खास बात या कल की कोई चिंता है जो आपको सोने नहीं दे रही?'
        : 'Late nights can amplify overthinking so much because the world goes quiet and our mind starts replaying every worry. You are not alone in this.\n\nTry this right now: Put your phone screen face down away from your pillow. Do 3 cycles of slow breathing (inhale 4s, exhale slowly for 6s). If thoughts are racing, write them on a rough piece of paper to "empty" them out of your head for the night.\n\nIs there a specific tomorrow worry that is keeping your mind running?';
    } else if (msgLower.includes('lonely') || msgLower.includes('akel') || msgLower.includes('hostel') || msgLower.includes('ghar') || msgLower.includes('friend')) {
      supportiveFallback = isHindi
        ? 'हॉस्टल में घर से दूर रहना और अकेलेपन का अहसास होना सच में दिल को बहुत भारी कर देता है। इतने सारे लोगों के बीच रहकर भी खुद को अलग-थलग महसूस करना बहुत सामान्य है।\n\nयाद रखिए, यह दौर हमेशा ऐसा नहीं रहेगा। आज अपने किसी पुराने स्कूल के दोस्त या घर पर 5 मिनट बात करके देखिए। या थोड़ी देर हॉस्टल कैम्पस में खुली हवा में टहल आइए।\n\nक्या आपको घर की याद आ रही है या कॉलेज में किसी बात से मन दुखी है?'
        : 'Hostel life can feel surprisingly lonely, especially when you are surrounded by crowds of students but feel like nobody truly understands what you are going through inside.\n\nYour feelings are completely valid. Moving away from comfort and routine takes immense emotional energy. Consider calling someone from home or an old friend for just 5 minutes today, or take a gentle 10-minute walk outside your dorm.\n\nAre you missing home, or has something specific happened with friends on campus?';
    } else {
      supportiveFallback = isHindi
        ? 'मैं आपकी बात पूरी संवेदनशीलता से सुन रहा हूँ। कॉलेज की ज़िंदगी में कई बार सब कुछ एक साथ भारी लगने लगता है।\n\nइस समय खुद पर ज्यादा दबाव मत डालिए। एक घूंट पानी पीजिए और कंधों को ढीला छोड़िए। आप अकेले नहीं हैं, और हम इस स्थिति को एक-एक कदम करके संभाल लेंगे।\n\nआप इस समय सबसे ज्यादा किस बात को लेकर परेशान महसूस कर रहे हैं?'
        : 'I am right here with you, listening without any judgment. College can sometimes feel like carrying a backpack full of rocks—every deadline, expectation, and emotion piling on.\n\nGive yourself permission to pause for just 60 seconds right now. Unclench your jaw, drop your shoulders, and take a sip of water. We can navigate this together, one gentle step at a time.\n\nWhat is the biggest weight on your chest today?';
    }

    return res.json({
      reply: supportiveFallback,
      isCrisis: false,
    });
  }
});

/**
 * 2. Pre-Assessment Evaluation Endpoint
 */
app.post('/api/assessment', async (req, res) => {
  try {
    const { scores, notes = '' } = req.body;

    if (!scores) {
      return res.status(400).json({ error: 'Assessment scores required' });
    }

    const { stress = 3, sleep = 3, mood = 3, energy = 3, functioning = 3 } = scores;
    const avgScore = (stress + sleep + mood + energy + functioning) / 5;

    // If Gemini is available, generate an authentic supportive evaluation
    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const assessmentPrompt = `A college student completed a non-diagnostic 5-factor wellness check-in:
- Academic & Exam Pressure (1=Overwhelming, 4=Comfortable): ${stress}/4
- Sleep Restfulness (1=Very Poor, 4=Sound): ${sleep}/4
- Emotional Tone (1=Sad/Empty, 4=Optimistic): ${mood}/4
- Energy & Stamina (1=Exhausted, 4=High): ${energy}/4
- Campus & Social Functioning (1=Withdrawn, 4=Connected): ${functioning}/4
- Student Context Notes: "${notes || 'None provided'}"

Provide a JSON response with:
1. "summary": A warm, encouraging, supportive paragraph (3-4 sentences) summarizing their current equilibrium without medical diagnoses.
2. "suggestedSteps": An array of 3 concrete, practical, gentle self-care or study-pacing suggestions.
Respond ONLY with valid JSON in this exact structure:
{"summary": "...", "suggestedSteps": ["...", "...", "..."]}`;

        const aiRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: assessmentPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (aiRes.text) {
          const parsed = JSON.parse(aiRes.text);
          return res.json({
            summary: parsed.summary,
            suggestedSteps: parsed.suggestedSteps,
            nonDiagnosticNotice: 'This supportive reflection is algorithmically generated and does not constitute a clinical psychiatric diagnosis.',
          });
        }
      } catch (err) {
        console.warn('Gemini assessment fallback:', err);
      }
    }

    // Deterministic fallback
    let summary = '';
    const suggestedSteps: string[] = [];

    if (avgScore >= 3.2) {
      summary =
        'Your responses indicate a solid wellness baseline with healthy coping mechanisms. You seem to be balancing academic demands while preserving personal vitality.';
      suggestedSteps.push(
        'Maintain your current sleep schedule (aim for 7-8 hours).',
        'Continue allocating time for campus clubs, exercise, or hobbies.',
        'Use the 4-7-8 breathing module during exam preparations for quick relaxation.'
      );
    } else if (avgScore >= 2.2) {
      summary =
        'Your check-in reflects moderate pressure, likely from exam preparations, changing sleep patterns, or hostel adjustments. These feelings are common and respond well to gentle pacing.';
      suggestedSteps.push(
        'Practice the 4-7-8 breathing circle twice daily to relieve mental tension.',
        'Adopt the 45-minute study + 10-minute movement routine.',
        'Consider scheduling an exploratory chat with a campus counselor in our directory.'
      );
    } else {
      summary =
        'Your responses show that you are currently carrying significant emotional strain and tiredness. Recognizing this is a courageous first step, and getting support is strongly recommended.';
      suggestedSteps.push(
        'Reach out to a campus counselor for a safe, confidential listening space.',
        'Keep the Tele-MANAS toll-free helpline (14416) saved for immediate support anytime.',
        'Prioritize restful sleep and share your feelings with a trusted roommate or family member.'
      );
    }

    return res.json({
      summary,
      suggestedSteps,
      nonDiagnosticNotice:
        'This supportive reflection is algorithmically generated and does not constitute a clinical psychiatric diagnosis.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process assessment' });
  }
});

// Setup Vite Dev Server Middleware or Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`  MANAS MITRA (मानस मित्र) — Platform Ready`);
    console.log(`  Local URL: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = PORT + 1;
      console.warn(`Port ${PORT} is currently in use. Automatically trying port ${fallbackPort}...`);
      app.listen(fallbackPort, '0.0.0.0', () => {
        console.log(`\n  MANAS MITRA running on: http://localhost:${fallbackPort}\n`);
      });
    } else {
      console.error('Server startup error:', err);
    }
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
