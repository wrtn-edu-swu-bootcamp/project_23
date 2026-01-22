# Loading Screen GIF Setup

## Overview

The LoadingScreen component supports both CSS animations and custom GIF animations.

## Using Custom GIF

### 1. Add your GIF file

Place your loading animation GIF in the `public/assets/` directory:
- File name: `loading_screen.gif` (or any name you prefer)
- Recommended size: 128x128px to 256x256px
- Keep file size < 500KB for fast loading

### 2. Enable GIF in LoadingScreen

Update `app/page.tsx` to enable the GIF option:

```typescript
// Change useGif from false to true
<LoadingScreen show={isLoading} useGif={true} />

// Or specify a custom GIF path
<LoadingScreen 
  show={isLoading} 
  useGif={true} 
  gifPath="/assets/my-custom-loading.gif"
/>
```

### 3. Update Dynamic Imports (Optional)

If you want to use GIF for lazy-loaded tab components:

```typescript
const FolioTab = dynamic(() => import('@/components/tabs/FolioTab'), {
  loading: () => <LoadingScreen show={true} useGif={true} />,
})
```

## Default Behavior

By default, `useGif={false}` uses a CSS-based animation with:
- Pulsing logo circle
- Animated dots
- "Loading..." text
- No external file dependencies

## GIF Animation Guidelines

For best results, your loading GIF should:
- Be optimized for web (use tools like ezgif.com)
- Have a transparent or black background
- Loop seamlessly
- Be square (1:1 aspect ratio)
- Use modern codecs (WebP animated is also supported)

## Current Setup

```
✅ LoadingScreen component with GIF support
✅ Fallback to CSS animation
✅ Configurable GIF path
✅ Automatic fade-in/fade-out transitions
```

To use your custom GIF, simply:
1. Place it at `/public/assets/loading_screen.gif`
2. Change `useGif={false}` to `useGif={true}` in `app/page.tsx`
