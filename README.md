# Project Name: NAVA
**Description: Mobile-optimized Art Portfolio & Browser for Artists**

## ?? 1. Design & UX Guidelines
- **Frame**: iPhone 14 (390x844) Mobile Web Optimization.
- **Theme**: Minimalism, Black & White / Deep Purple (#2D242D).
- **Navigation**: Fixed Bottom Bar (FOLIO, NOTE, PLANNER, ARTICLE).
- **Typography**: **Pretendard** (KR), **Inter** (EN/Num) - Mix of Bold and Medium.
- **Core UI Principles**:
  - **Top Header**: Action buttons (Settings, Search, Profile) positioned at the top to avoid mobile browser toolbar overlap.
  - **Scroll UX**: Enable smooth scrolling for overflowing content with hidden scrollbars.
  - **In-app WebView**: External links must open in a modal/WebView to keep users in-app.
  - **Loading Animation**: Custom loading screen using `loading_screen.gif` for all transitions and saves.

## ??? 2. Core Features & Tech Stack
- **Tech**: Next.js (App Router), Tailwind CSS, Supabase (DB/Storage), Gemini 1.5 Flash API.
- **Automation/API**: Integration readiness for Artsy API, Public Data APIs, and **n8n Agent AI**.

### Tab 1: FOLIO (Process Archive)
- **Upload**: Support for Multi-upload (Images & MP4 Videos).
- **Auto-Sort**: File metadata-based chronological classification (Year/Month).
- **UI**: Sticky headers for chronology, Toggleable Grid (2-column vs 3-column).
- **View**: Fullscreen dark modal for detailed inspection; Caption editing support.

### Tab 2: NOTE (Inspiration Log)
- **Editor**: Auto-save drafts, Markdown support (Bold, Underline, Quotes).
- **Search**: Instant real-time filtering (Title + Body).
- **Management**: Bookmark (Wish) functionality with a dedicated collection view.
- **Social**: Export notes as stylized image cards for Instagram sharing.

### Tab 3: PLANNER (Exhibition Management - Artmap Style)
- **Filtering**: Regional quick-jump chips + Monthly Calendar view.
- **Details**: D-Day countdowns for closing dates, Map links (Google/Naver).
- **Personal**: Sync exhibitions to a private planner; "Visited" check-in history.

### Tab 4: ARTICLE (Curation & Critique)
- **Feed**: Infinite scroll with #Critique, #Interview, #News filters.
- **AI Summary**: Gemini 1.5 Flash provides 3-line Korean summaries for global articles.
- **Readability**: Ads-free "Clean View" In-app browser.

## ?? 3. Development Structure (Modular Refactoring)
- `/components/tabs/`: Individual tab logic (FolioTab.tsx, NoteTab.tsx, etc.)
- `/components/layout/`: Shared Header and BottomNav.
- `/components/ui/`: Shared components like LoadingScreen, Modals, and Buttons.

## ?? 4. Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## ?? 5. Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
