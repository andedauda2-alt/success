# 🛡️ ExplainAm — Nigerian AI Document Explainer & Wahala Radar

> **"No let any confusing agreement or hospital bill empty your pocket."**  
> ExplainAm takes photos of intimidating documents (tenancy agreements, digital loan apps, hospital emergency bills, and university circulars) and translates them into simple **Nigerian Pidgin, Yorùbá, Hausa, Igbo, or Simple English**. It detects predatory clauses (*Wahala Radar*), calculates total financial impact, and reads the breakdown aloud as an audio voice note ready to share on WhatsApp.

---

## 🚀 Features

1. **Multilingual for Everyday Nigerians:**
   - 🇳🇬 **Nigerian Pidgin** (e.g., *"Wahala dey! Hold body first, dem wan chop your ₦350k caution fee"*).
   - 🇳🇬 **Yorùbá** (Clear, respectful translations with warning highlights).
   - 🇳🇬 **Hausa** (Accessible northern dialect breakdowns).
   - 🇳🇬 **Igbo** (Actionable community-friendly explanations).
   - 🌍 **Simple English** (Zero legal jargon; 8th-grade readability).

2. **⚠️ Wahala Radar (Predatory Clause Detection):**
   - Automatically flags illegal 14-day rush evictions (violating Lagos Tenancy Law 2011).
   - Catches predatory 730% APR and contact-shaming threats in mobile loan apps (violating FCCPC rules).
   - Exposes unitemized hospital admission fees and withheld discharge notes.
   - Identifies illegal cash levies at departmental offices.
   - Provides **practical counter-clauses** citizens can demand before signing.

3. **🎙️ Voice Note Audio Player:**
   - Synthesizes 40–70 word conversational WhatsApp-style voice messages.
   - Powered by **Gemini Text-to-Speech** (`gemini-3.8-flash-lite-tts`) with instant browser Web Speech fallback.
   - Interactive audio player with scrub bar, waveform animation, and speed controls.

4. **📱 In-Browser Canvas Compression (Low Bandwidth):**
   - High-resolution smartphone camera captures (5MB–12MB) are automatically compressed down to ~150KB–300KB using HTML5 `<canvas>` before upload, saving up to 90% mobile data for users.

5. **💬 1-Click WhatsApp Sharing:**
   - Formats punchy WhatsApp messages with bulleted risk alerts and direct deep links (`https://wa.me/?text=...`) and native mobile `navigator.share` integration.

6. **⚡ 4 Realistic 1-Click Demo Scenarios:**
   - **Lagos Residential Tenancy Agreement** (Yaba, ₦6.35m total demand)
   - **FastCash 9ja Mobile Loan Terms** (2% daily interest, contact scraping)
   - **Specialist Hospital Emergency Bill** (₦350k callout fee)
   - **University Faculty Sundry Fees Circular** (Cash payment at HOD office)

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas image compressor.
- **Backend:** Node.js 20+, Express running on port 3000 with Vite middleware in development.
- **AI Models:**
  - **Vision & Analysis:** `gemini-3.8-flash` (with automated fallback to `gemini-flash-latest` and `gemini-3.1-flash-lite`).
  - **Follow-up Q&A:** `gemini-3.8-flash` with Nigerian legal grounding.
  - **Audio Voice Notes:** `gemini-3.8-flash-lite-tts` (Voice: *Kore*).
- **Standalone Vanilla Version:** Included in `public/index.html` and `public/vanilla.html` with zero build step dependencies.

---

## 🏃 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/explainam.git
cd explainam
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
Apache-2.0
