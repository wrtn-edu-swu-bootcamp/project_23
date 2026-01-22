# Project Name: NAVA
**Art-focused Mobile Web Portfolio & Browser App**

## 1. Design Guidelines
- **Frame**: Optimized for iPhone 14 (390x844 px).
- **Theme**: Minimalism, Black & White / Deep Purple (#2D242D) tones for artistic sensibility.
- **Navigation**: Fixed Bottom Navigation Bar with 5 Tabs (FOLIO, NOTE, PLANNER, ARTICLE, VV).
- **Typography**: 
  - Korean: Pretendard
  - English/Numbers: Inter
  - Usage: Strategic mix of Bold and Medium weights.

## 2. Technical Stack
- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend/DB**: Supabase (Database, Storage).
- **AI**: Google Gemini 1.5 Flash API (Art Docent Chatbot).
- **Icons**: Lucide-react.

## 3. Common UX/UI Principles
- **Top Header Layout**: Place essential functional buttons (Settings, Search, Profile) in the top header to avoid interference with mobile browser toolbars.
- **Loading Animation**: Implement custom loading screens using `loading_screen.gif` during page transitions and data saving.
- **Scroll Optimization**: Enable smooth scrolling but hide the scrollbar for a clean UI.
- **In-app WebView**: External links (from Articles) must open within an in-app modal or WebView to keep users within the app.

## 4. Tab Specifications

### Tab 1: FOLIO (Chronological Archive)
- **Concept**: Visualizing the 'accumulation' of artistic work.
- **Features**: Media recording (Photos/Videos) with 3-column infinite scroll grid.
- **UI Details**: Sticky Headers for Year/Month separators, Floating Upload Button.

### Tab 2: NOTE (Blog-style Records)
- **Reference**: Naver Blog / Google Blogger UX.
- **Features**: 
  - Editor: Distinct Title and Body input fields.
  - Viewer: Magazine-style layout with a 'Wish' (Favorite) heart button.
  - Search: Real-time integrated search for both titles and body content.

### Tab 3: PLANNER (Exhibition Guide)
- **Reference**: Artmap (Artmap) UI/UX benchmarking.
- **Components**: Top region filter chips (Seoul, Gyeonggi, etc.) + Monthly Calendar + Bottom list of exhibition poster cards.
- **Tech**: FullCalendar library & Public Exhibition Data API.

### Tab 4: ARTICLE (Art Magazine)
- **Features**: Integrated feed from Google Art Newsletters & External RSS. Includes 'Wish' function.
- **Design**: Artmap-style Hero Section with large highlight banners.

### Tab 5: VV (AI Art Docent)
- **Persona**: 'VV' - A hip, intellectual artist friend who understands slang and context.
- **Requirement**: **Chat History** must be implemented. VV must remember previous context (e.g., "What I ate for lunch yesterday").

## 5. Project Structure
- `/components`: Reusable UI components (Nav, Cards, Inputs).
- `/app`: Next.js App Router (Page routes for each tab).
- `/lib`: Client configurations for Supabase & Gemini API.
- `/api`: Server-side API Routes for AI communication.
- `/assets`: Project images and assets (logo, loading screen, etc.).
