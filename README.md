# Project Name: NAVA
**Description: Mobile-optimized Art Portfolio & Browser for Artists**

## 📱 1. Design & UX Guidelines
- **Frame**: iPhone 14 (390x844) Mobile Web Optimization.
- **Theme**: Bitmap Retro Style - Black & White with pixel-perfect borders.
- **Navigation**: Fixed Bottom Bar (FOLIO, NOTE, PLANNER, ARTICLE).
- **Typography**: **Press Start 2P** & **DotGothic16** (Pixel fonts) for retro gaming aesthetic.
- **Core UI Principles**:
  - **Top Header**: Action buttons (Settings, Search, Profile) positioned at the top to avoid mobile browser toolbar overlap.
  - **Scroll UX**: Enable smooth scrolling with custom bitmap-style scrollbars.
  - **In-app WebView**: External links must open in a modal/WebView to keep users in-app.
  - **Loading Animation**: Pixel-block style loading screen.

## 🛠️ 2. Core Features & Tech Stack
- **Tech**: Next.js 15 (App Router), Tailwind CSS, TypeScript, Supabase (DB/Storage), OpenAI API.
- **AI Integration**: **OpenAI GPT-3.5-turbo** for article translation and intelligent search.
- **Automation/API**: Integration readiness for Artsy API, Public Data APIs, and n8n workflows.

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

### Tab 4: ARTICLE (Curation & Critique) 🤖
- **Feed**: Infinite scroll with #Critique, #Interview, #News filters.
- **AI Translation**: Translate English articles to Korean using OpenAI GPT-3.5-turbo.
- **AI Search**: Real-time keyword-based article recommendations with intelligent keyword extraction.
- **AI Summary**: Article summarization and insight extraction (future feature).
- **Readability**: Ads-free "Clean View" In-app browser.

## 📁 3. Development Structure (Modular Refactoring)

```
new/
├── app/
│   ├── api/                    # API Routes
│   │   ├── culture-exhibitions/
│   │   ├── naver-news/
│   │   ├── rss-feed/
│   │   ├── translate/         # OpenAI translation API
│   │   ├── search-articles/   # AI article search API
│   │   └── n8n-ai/            # n8n AI Agent integration (optional)
│   ├── globals.css             # Global styles + Bitmap fonts
│   ├── layout.tsx              # Root layout with font setup
│   └── page.tsx                # Main page with tab switching
├── components/
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx          # Reusable header with actions
│   │   └── BottomNav.tsx       # Fixed bottom navigation
│   ├── tabs/                   # Tab-specific components
│   │   ├── FolioTab.tsx        # Portfolio/Process archive
│   │   ├── NoteTab.tsx         # Inspiration notes
│   │   ├── PlannerTab.tsx      # Exhibition planner
│   │   └── ArticleTab.tsx      # Article curation feed
│   └── ui/                     # Shared UI components
│       ├── CommonUI.tsx        # Cards, Buttons, Modals, etc.
│       ├── LoadingScreen.tsx   # Loading animation (Bitmap style)
│       ├── FolioUploadModal.tsx # FOLIO upload/edit modal
│       ├── NoteEditorModal.tsx  # NOTE editor modal
│       ├── ImageUpload.tsx      # Image upload component
│       └── ConfirmDialog.tsx    # Confirmation dialog
├── lib/
│   ├── api.ts                  # API functions & utilities
│   ├── types.ts                # TypeScript type definitions
│   ├── hooks.ts                # Custom React hooks
│   └── constants.ts            # App-wide constants & config
├── public/
│   ├── assets/
│   │   ├── logo.png
│   │   ├── loading_screen.gif  # (Optional) Custom loading GIF
│   │   └── README.md           # Asset usage guide
│   └── fonts/
│       └── README.md           # Font setup instructions
├── docs/
│   ├── API-SETUP.md            # API configuration guide
│   ├── OPENAI-SETUP.md         # OpenAI translation & search setup ⭐
│   ├── N8N-AI-SETUP.md         # n8n AI workflow setup guide (optional)
│   ├── REFACTORING-PROPOSAL.md # Architecture decisions
│   └── REFACTORING-SUMMARY.md  # Refactoring summary
├── env.example                 # Environment variables template
├── package.json
├── tailwind.config.js          # Tailwind with custom fonts
└── tsconfig.json
```

## 🚀 4. Getting Started

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   OPENAI_API_KEY=your_openai_key
   ```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## ⚙️ 5. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# Optional (for additional features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
PUBLIC_DATA_API_KEY=your_public_data_api_key

# Future Integration
N8N_WEBHOOK_URL=your_n8n_webhook_url
ARTSY_CLIENT_ID=your_artsy_client_id
ARTSY_CLIENT_SECRET=your_artsy_client_secret
```

See `env.example` for the complete template.

## 🎨 6. Customization

### Fonts

- **Pretendard** is loaded via CDN by default (see `app/globals.css`)
- For local fonts, see `public/fonts/README.md`

### Loading Animation

- Default: CSS-based animation
- To use custom GIF: See `public/assets/README.md`

### Theme Colors

Edit `tailwind.config.js`:

```js
colors: {
  'deep-purple': '#2D242D', // Change this
}
```

## 📚 7. Key Technologies

- **Next.js 15**: App Router, Server Components, Dynamic Imports
- **TypeScript**: Full type safety with custom types in `lib/types.ts`
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Lucide React**: Icon library
- **OpenAI API**: GPT-3.5-turbo for translation and AI search
- **RSS Parser**: Article feed parsing
- **Supabase**: Database and storage (ready for integration)

## 🔧 8. Development Features

### Custom Hooks

Located in `lib/hooks.ts`:
- `useLocalStorage<T>` - Type-safe localStorage management
- `useBookmarks` - Bookmark/favorite functionality
- `useSearch` - Search query state management
- `useDebounce` - Debounced values for search inputs
- `useTabState` - Tab switching with loading transitions

### Constants & Configuration

Located in `lib/constants.ts`:
- API endpoints and base URLs
- RSS feed sources
- Region and category options
- Feature flags based on environment variables
- UI constants (dimensions, durations)
- Error and success messages

### Type Safety

All data structures are typed in `lib/types.ts`:
- Tab-specific types (Folio, Note, Planner, Article)
- API response types
- Storage keys as constants

## 📖 9. Documentation

- **API Setup**: See `docs/API-SETUP.md`
- **OpenAI Setup**: See `docs/OPENAI-SETUP.md` ⭐
- **n8n AI Setup**: See `docs/N8N-AI-SETUP.md` (optional)
- **Vercel Deployment**: See `docs/VERCEL-DEPLOYMENT.md` 🚀
- **Vercel Environment Variables**: See `docs/VERCEL-ENV-SETUP.md` 🔐
- **Architecture**: See `docs/REFACTORING-PROPOSAL.md`
- **Refactoring Summary**: See `docs/REFACTORING-SUMMARY.md`
- **Font Setup**: See `public/fonts/README.md`
- **Assets Guide**: See `public/assets/README.md`

## 🚀 10. Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wrtn-edu-swu-bootcamp/project_23)

### Manual Deployment

1. **Push to GitHub** (already done ✅)
2. **Import to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import `wrtn-edu-swu-bootcamp/project_23`
3. **Configure Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   OPENAI_API_KEY=your_openai_key
   ```
4. **Deploy** 🎉

**Full Guide**: See [`docs/VERCEL-DEPLOYMENT.md`](docs/VERCEL-DEPLOYMENT.md)

## 🎯 11. Deployment Readiness

The codebase is structured for easy API integration:

- ✅ Environment variables configured
- ✅ API utility functions ready
- ✅ Feature flags for conditional functionality
- ✅ Mock data for development
- ✅ Type-safe API responses
- ✅ Error handling in place

## 📝 12. Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended rules
- **Modular Structure**: Clear separation of concerns
- **Reusable Components**: Shared UI in `components/ui/`
- **Custom Hooks**: Logic abstraction for reusability

## 🤝 13. Contributing

When adding new features:
1. Add types to `lib/types.ts`
2. Add constants to `lib/constants.ts`
3. Create reusable hooks in `lib/hooks.ts`
4. Use shared UI components from `components/ui/CommonUI.tsx`
5. Follow existing naming conventions

## 📄 14. License

This project is private and proprietary.
