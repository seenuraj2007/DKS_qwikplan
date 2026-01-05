# DKS QwikPlan 🚀

A next-generation **AI Content Script Generator** built for creators, marketers, and small businesses. Instantly generates **ready-to-post scripts** (video hooks + spoken audio, or complete text posts) tailored to your niche, platform, and goals.






## 🌟 Features

-   **AI-Powered Content Generation:** Creates **complete post scripts** in seconds (video scripts with scenes/audio OR ready-to-copy text posts)
-   **Platform-Optimized:** Instagram Reels, TikTok, Twitter/X, LinkedIn, Facebook, YouTube - **platform-specific formats**
-   **Copy-Ready Output:** Hook, Script, Caption, CTA, Hashtags - **one-click copy**
-   **User Authentication & Usage Tracking:** monthly credit limits (Free: 50 credits)
-   **History & Download:** Save strategies + CSV export
-   **Responsive Dashboard:** Beautiful Tailwind UI with real-time usage display
-   **Smart Pro Tips:** Platform-specific optimization advice

## 🎯 What's New in v2.0

```
✨ Replaced 7-day plans with SINGLE high-converting post scripts
✨ Video platforms get full [Scene] + "Spoken Audio" scripts  
✨ Text platforms get complete ready-to-post copy
✨ Individual copy buttons for Hook/Script/Caption/CTA
✨ Enhanced error handling & JSON validation
```



## 📸 Demo

```
[Add GIF/video of modal with script output]
Niche: "Coffee Shop" → Platform: "Instagram Reels" → 
"Hook: Tired gamer? [Scene: energy drink] Script: Full 15s video..."
```

## 🚀 Quick Start

### Prerequisites
```
Node.js 18+
```

### 1. Clone & Install
```bash
git clone https://github.com/seenuraj2007/kds_qwikplan.git
cd kds_qwikplan
npm install
```

### 2. Environment Setup
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GROQ_API_KEY=your_groq_key
```

### 4. Run
```bash
npm run dev
```

**Live Demo:** [http://localhost:3000](http://localhost:3000)

## 📁 File Structure

```
app/
├── api/generate/route.ts     # AI Script generation (Groq + JSON mode)
├── dashboard/
│   ├── page.tsx             # Main UI
│   └── components/
│       ├── ResultModal.tsx  # New script display + copy buttons
│       ├── UsageCard.tsx    # Credit tracking
│       └── WelcomeAnimation.tsx
├── lib/supabaseClient.ts    # Auth helpers
└── globals.css              # Tailwind + animations
```

## 🎮 How It Works

1. **Input:** Niche + Platform + Goal
2. **AI Magic:** Groq generates platform-optimized JSON
3. **Output:** Copy-ready script with Hook/Script/CTA
4. **Save:** Auto-saves to your history

```
Example Input: "Coffee Shop" + "Instagram Reels" + "Drive Sales"
Example Output: Full 15s Reel script with [Scenes] + "Audio" + Caption
```

## 🔧 API Endpoints

```
POST /api/generate
Body: { niche, platform, goal, audience? }
Headers: Authorization: Bearer <token>
Response: { hook, script, caption, cta, hashtags, ... }
```

## 🚀 Deploy

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Environment Variables:** Add all `.env.local` vars to Vercel dashboard.

## 🤝 Contributing

```
1. Fork repo
2. `git checkout -b feature/cool-feature`
3. `npm run dev` + test
4. `npm test` (add tests!)
5. PR to `main`
```

## 📄 License

MIT License - see `LICENSE`

## 👨‍💻 Author

**Seenuraj2007**  
[GitHub](https://github.com/seenuraj2007) | [Portfolio](https://seenuraj.com)

***

⭐ **Star this repo if it helps your content game!** 🚀

```
#DKSQwikPlan #AICopywriter #ContentGenerator #SocialMediaAI
```
