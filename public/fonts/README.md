# Pretendard Font Setup

This directory should contain Pretendard font files for optimal Korean typography.

## Required Font Files

Place the following Pretendard `.woff2` files in this directory:

- `Pretendard-Regular.woff2` (weight: 400)
- `Pretendard-Medium.woff2` (weight: 500)
- `Pretendard-SemiBold.woff2` (weight: 600)
- `Pretendard-Bold.woff2` (weight: 700)

## Download Instructions

1. Visit: https://github.com/orioncactus/pretendard/releases
2. Download the latest web font package (look for `pretendard-x.x.x-web.zip`)
3. Extract the archive
4. Copy the `.woff2` files from the `web/static/woff2` folder to this directory

## Alternative: Use CDN

If you prefer to use a CDN instead of local fonts, you can update `app/layout.tsx` to use:

```typescript
// Remove localFont import and add this to globals.css:
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
```

## Current Setup

The app is configured to use local fonts with fallback to system fonts if Pretendard files are not found.

**Font Variables:**
- `--font-pretendard`: Korean text (primary)
- `--font-inter`: English text and numbers (secondary)

**Usage in Tailwind:**
- `font-pretendard`: Pretendard font
- `font-inter`: Inter font
- `font-sans`: Default (Pretendard)
