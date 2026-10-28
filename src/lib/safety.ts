/**
 * Safety and Emergency Protocol Utilities
 * Tele-MANAS: National Tele Mental Health Programme of India
 * Toll-Free 24x7 Helplines: 14416 and 1-800-891-4416
 */

export const TELE_MANAS_PRIMARY = '14416';
export const TELE_MANAS_SECONDARY = '1-800-891-4416';
export const KHANDWALA_KIRAN_HELPLINE = '1800-599-0019'; // Govt of India Social Justice & Empowerment helpline

export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'dying',
  'self harm',
  'cut myself',
  'cutting myself',
  'harming myself',
  'hang myself',
  'no reason to live',
  'better off dead',
  'take my own life',
  'marna chahta',
  'marna chahti',
  'khatam karna',
  'jeene ki iccha',
  'jaan de dunga',
  'jaan de dungi',
  'khudkushi',
  'aatmahatya',
  'zindagi se thak gaya',
  'zindagi se thak gayi'
];

export function detectCrisisIntent(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase().trim();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export const SAFETY_DISCLAIMER =
  'Manas Mitra is an AI-powered emotional wellness companion and NOT a medical diagnostic tool or psychiatric hospital substitute. If you or someone you know is in immediate distress or having thoughts of self-harm, please connect with India’s National Tele-MANAS helpline at 14416 or 1800-891-4416 immediately.';

export const CRISIS_RESPONSE_EN = `I hear how much pain you are experiencing right now, and I care deeply about your safety. You do not have to carry this overwhelming weight alone.

Please connect right now with India's National Tele-MANAS Mental Health Helpline (Free, Confidential, 24/7):
📞 Call Toll-Free: 14416 or 1-800-891-4416
📞 Alternate Govt Helpline (KIRAN): 1800-599-0019

Steps you can take right now:
1. Reach out to a trusted friend, roommate, parent, or campus counselor.
2. Step out into a safe, open area on campus.
3. Call 14416—trained, compassionate mental health professionals are ready to listen in your regional language.

I am an AI assistant and cannot contact emergency teams or provide clinical interventions. Please let a real human support you today.`;

export const CRISIS_RESPONSE_HI = `मुझे आपकी बहुत परवाह है, और ऐसा प्रतीत होता है कि आप इस समय अत्यंत कठिन व असहनीय दौर से गुजर रहे हैं। कृपया याद रखें कि आप इस मुश्किल में अकेले नहीं हैं।

भारत सरकार की राष्ट्रीय टेली-मानस (Tele-MANAS) मानसिक स्वास्थ्य हेल्पलाइन 24/7 निःशुल्क और पूर्णतः गोपनीय सहायता प्रदान करती है:
📞 तुरंत कॉल करें (टोल-फ्री): 14416 या 1-800-891-4416
📞 सरकारी किरण (KIRAN) हेल्पलाइन: 1800-599-0019

आप अभी क्या कर सकते हैं:
1. किसी विश्वस्त मित्र, रूममेट, परिजन या कॉलेज काउंसलर से तुरंत बात करें।
2. किसी खुले और सुरक्षित स्थान पर जाएं और गहरी सांस लें।
3. 14416 पर डायल करें—विशेषज्ञ परामर्शदाता आपकी भाषा में सुनने के लिए तैयार हैं।

मैं केवल एक एआई सहायक हूँ और वास्तविक आपातकालीन मदद या निदान प्रदान नहीं कर सकता। कृपया तुरंत किसी विशेषज्ञ या अपनों से संपर्क करें।`;
