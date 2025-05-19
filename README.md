
# 🏗️ SSS Construction Reports (Enhanced Version)

This is the **AI-powered**, modernized version of the internal field reporting tool originally built for engineering and construction teams. It allows foremen to log daily activities, materials, equipment, and photos — while admins manage and export client-ready reports.

Built for speed, scalability, and future SaaS deployment.

---

## 🚀 Key Features

### ✅ Role-Based Access
- **Foreman View:** Submit daily reports, auto-generate summaries, and view report history.
- **Admin View:** Access all reports, manage users, export PDF summaries, and monitor progress.

### ✅ Offline-First Daily Log Form
- Foremen can draft reports **even without internet** using localStorage caching.
- Drafts sync and clear when submission succeeds.

### ✅ AI Report Summarization
- Integrated with **Genkit / Gemini / OpenAI**
- Summarizes daily entries into structured QA reports
- Prompt-driven backend flows for flexibility

### ✅ PDF Export
- One-click generation of clean PDF reports using `jsPDF`
- Includes materials, progress, issues, and AI summary
- Embeds timestamps and is ready for client delivery

### ✅ Modular Architecture
- Uses **Next.js App Router** with per-role layout folders (`/admin`, `/foreman`)
- Reusable ShadCN-based UI components (`/components/ui`)
- Clean `lib/`, `hooks/`, and `contexts/` structure

### ✅ Developer Tooling
- ESLint + Prettier + Husky (pre-commit) for clean code
- Mock Firebase layer for local demo without real backend

---

## 🧪 Differences from the Original

| Feature                          | Original                     | Enhanced Version                         |
|----------------------------------|------------------------------|-------------------------------------------|
| **Routing**                      | Flat pages                   | App Router with scoped layouts            |
| **Auth/Role Handling**           | Firebase only                | Mockable for local demo, middleware-ready |
| **AI Report Summary**            | ❌ Not included              | ✅ Genkit/Gemini integration              |
| **Offline Support**              | ❌                          | ✅ via localStorage                       |
| **PDF Export**                   | ❌                          | ✅ With `jsPDF`                           |
| **UI Components**                | Basic                        | Unified ShadCN-style system               |
| **Dev Tooling**                  | Minimal                      | Full ESLint + Prettier + Husky            |

---

## 🧰 Project Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/sss-construction-reports.git
cd sss-construction-reports
npm install
```

### 2. Add Local Environment File

```bash
cp .env.local.example .env.local
```

You can either:
- Use **fake values** (for local testing without Firebase)
- Or insert real Firebase values if available

---

## 🧪 Local Demo (No Firebase Required)

This version includes mocked Firebase services. You can:

- Skip login entirely
- Automatically load the admin dashboard
- Use the form + AI summary + PDF export features offline

To demo:
```bash
npm run dev
```

Visit `http://localhost:3000` or `http://localhost:9002` depending on your port.

---

## 🔧 Firebase Setup (Optional)

> ⚠️ Note: This project runs fully without Firebase for demo purposes. However, to enable full production capabilities (auth, file upload, real-time database), follow the steps below.

### 1. Create a Firebase Project

- Go to [https://console.firebase.google.com](https://console.firebase.google.com)
- Create a new project

### 2. Register a Web App

- Inside Project Settings → General → Add App → Web
- Copy the `firebaseConfig` snippet

### 3. Fill in `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123xyz
```

### 4. Swap `lib/firebase.ts` and `lib/auth.ts`

- Comment out the mocked ones and replace with the real Firebase SDK calls (already scaffolded in the repo)

---

## 📁 Project Structure

```
src/
├── ai/                   # Genkit prompt workflows
├── app/                 # App Router pages & layouts
│   ├── admin/           # Admin dashboard & pages
│   └── foreman/         # Foreman dashboard & forms
├── components/          # Shared and UI components
├── contexts/            # Global state/context
├── hooks/               # Custom React hooks
├── lib/                 # Firebase, AI, PDF, auth logic
├── types/               # TypeScript types
```

---

## 🧱 Built With

- [Next.js 15 (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Google GenAI / Genkit](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

---

## 📝 License

This project is private and intended for internal or commercial SaaS development.  
Not for redistribution without permission.
