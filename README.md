# MANAS MITRA (मानस मित्र)
### AI-Powered Mental Wellness and Healthcare Coordination Platform

> **Academic Capstone Project**  
> **Course:** 2nd-Year B.Tech Computer Science & Engineering (Software Engineering & AI Capstone)  
> **Topic:** AI-Driven Student Healthcare Coordination & Preventative Mental Wellness

---

## 🌟 Executive Overview

**MANAS MITRA (मानस मित्र)** is a full-stack, responsive mental wellness and healthcare coordination web application engineered specifically for Indian university and college students. 

Balancing rigorous academic workloads, hostel adjustments, placement anxieties, and personal relationships often creates an invisible barrier to seeking support. Manas Mitra solves this by providing:
1. **A judgment-free, confidential digital companion** in English, Hindi, and Hinglish.
2. **Real-time autonomic nervous system grounding tools** (e.g., 4-7-8 diaphragmatic breathing and 5-4-3-2-1 sensory de-escalation).
3. **Structured mood tracking and 5-pillar wellness self-reflection**.
4. **Zero-leakage, consent-based clinical case summary generation** to show campus counselors on the student's own terms.
5. **Deterministic safety gates linked to India's National Tele-MANAS (14416 / 1-800-891-4416)** 24x7 crisis response service.

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js + Express (`server.ts`) with Vite middleware integration in development and optimized static serving in production.
- **AI Engine:** Google Gemini 3.8 Flash (`@google/genai` v2.4.0) accessed strictly server-side.
- **Data Persistence:** Local-first browser storage with complete JSON backup export and zero-footprint purge controls.
- **Color Palette & Design Language:** Soft pastel lavender (`#FAF8FF`, `#8B5CF6`), sky blue, warm peach, and clean off-white with anti-AI-slop typography and zero-pill discipline.

---

## 📋 Comprehensive Feature Breakdown

### 1. Landing Page
- Purpose-built branding, student-centered introduction, feature capability grid, step-by-step workflow, and immediate Tele-MANAS emergency banner.

### 2. Wellness Sanctuary (Dashboard)
- Daily check-in greeting, current emotional pulse card, interactive weekly energy SVG trendline, daily micro-wellness habit checklist with toggleable completion, and instant-access tools.

### 3. AI Mental Wellness Chatbot (Mitra)
- Full conversational interface powered by server-side Gemini 3.8 Flash.
- Instant language switching between English and Hindi.
- Suggested prompt chips (exam stress, sleep difficulties, imposter syndrome, grounding).
- Automatic distress keyword pre-screening with immediate Tele-MANAS modal redirection.
- Graceful API key status handling (informative server message if key is absent without pretending to hallucinate).

### 4. Daily Mood Tracker & Timeline
- Five distinct emotional tones: *Happy*, *Calm*, *Okay*, *Sad*, *Stressed*.
- Intensity rating slider (1–10).
- Context notes and campus tags (`#Exams`, `#Hostel`, `#Family`, `#Sleep`, `#Placements`).
- Full timeline history with editing, deleting, and local persistence.

### 5. AI Pre-Assessment Check-in
- 5-factor reflection questionnaire (Academic Workload, Sleep Architecture, Emotional Baseline, Energy, Social Connection).
- Server-side synthesis delivering an algorithmic summary and 3 concrete next steps.
- Strict non-diagnostic clarification notice.

### 6. Risk Detection & Emergency Support
- Real-time screening for distress and self-harm keywords in English and Hindi.
- Integration with India’s 24/7 **Tele-MANAS** helpline (`14416` and `1-800-891-4416`) and the Social Justice **KIRAN** helpline (`1800-599-0019`).
- Accessible at all times via the top navigation bar.

### 7. Interactive 3D Dhyan Vatika (Three.js Zen Sanctuary)
- Real-time 3D procedural Zen garden rendered via Three.js with studio PBR materials, ACES Filmic tone mapping, PCF soft shadows, and zero-404 procedural geometry.
- Floating lotus bio-feedback pacer dynamically animating in rhythm with the 4-7-8 breathing technique.
- Time of Day atmosphere presets (*Morning Golden, Sunset Pastel, Twilight Night*).
- Built-in Web Audio API ambient stream synthesizer.
- Collapsible bottom control dock ensuring zero viewport occlusion.

### 8. Personalized Self-Care Suite
- **4-7-8 Breathing Circle:** Real-time animated visual countdown stimulating the vagus nerve.
- **5-4-3-2-1 Sensory Grounding:** Interactive step-by-step checklist to disrupt cognitive panic loops.
- **Expressive Journal:** Student prompts with local storage saving.
- **Sleep & Study Hygiene:** Practical hostel dorm tips and the 45+10 / 20-20-20 study techniques.

### 8. Campus Counselor Directory
- Synthetic counselor profiles labeled transparently as academic demo data.
- Search by expertise (CBT, burnout, etc.) and filter by spoken languages.
- Functional support slot booking dialog with validation and active request log.

### 9. Consent-Based Clinical Case Summary
- Multi-select interface allowing students to choose which mood entries and assessment results to include.
- Explicit informed consent checkbox.
- Print-ready and PDF-exportable formatted briefing sheet for sharing with health professionals.

### 10. Settings, Privacy & Data Sovereignty
- Interface language selection (English / Hindi).
- Full JSON data backup export.
- Zero-footprint local storage purge button.
- Comprehensive privacy architecture disclosures.

### 11. About & Tele-MANAS Documentation
- Academic presentation background, technical implementation overview, and clinical boundaries.

---

## 🚀 Step-by-Step Execution Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
In the project root directory:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY="AIzaSy...your_gemini_api_key"
PORT=3000
```
*(Note: If no API key is provided, the platform functions normally in safe offline mode and informs the user when opening the AI chat).*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Testing and Verification Performed

1. **Compilation & Type Safety:** Ran `npm run build` and `tsc --noEmit` to verify all imports, JSX structures, and TypeScript interfaces.
2. **Crisis Intent Screening:** Verified keyword matching against distress test phrases in English and Hindi.
3. **Local Storage CRUD:** Verified that mood additions, edits, deletions, and goal toggles persist across page reloads.
4. **Print Styles:** Verified that the Case Summary view renders cleanly in browser print preview.
5. **Responsive Layout:** Tested navigation on mobile viewports (drawer menu) and desktop viewports (sidebar).

---

## 🏛️ Academic & Clinical Disclaimers
Manas Mitra is an educational computer science capstone project developed by B.Tech students. It is **not** a certified medical diagnostic system and does not replace human psychiatric treatment. In any life-threatening emergency, students must contact India's National Helpline (**14416**) or local emergency services immediately.
