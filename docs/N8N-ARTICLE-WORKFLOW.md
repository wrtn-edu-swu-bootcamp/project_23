# n8n Article 기능 워크플로우 가이드

## 📋 목표
각 뉴스 소스(Artnet, Art Newspaper, 아트허브, 네오룩, 월간미술)의 최신 뉴스/칼럼/관련 글을 자동으로 수집하고 처리합니다.

---

## 🔧 워크플로우 구조

### 워크플로우 1: RSS 피드 수집 & 처리

```
[Webhook Trigger] 
    ↓
[HTTP Request - RSS Feed]
    ↓
[RSS Parser]
    ↓
[OpenAI - Content Analysis]
    ↓
[OpenAI - Translation (한→영 or 영→한)]
    ↓
[Format Response]
    ↓
[Webhook Response]
```

---

## 🛠️ 단계별 설정

### 1️⃣ Webhook 노드 설정

**노드**: Webhook  
**Path**: `/article-rss`  
**HTTP Method**: POST  
**Authentication**: None (또는 API Key)

**예상 Request Body**:
```json
{
  "sourceId": "artnet",
  "limit": 20
}
```

---

### 2️⃣ HTTP Request 노드 - RSS 가져오기

**노드**: HTTP Request  
**Method**: GET  
**URL**: `{{ $json.feedUrl }}`

**Expression으로 URL 매핑**:
```javascript
{
  "artnet": "https://news.artnet.com/feed",
  "artnewspaper": "https://www.theartnewspaper.com/rss",
  "arthub": "https://www.arthub.co.kr/feed/rss",
  "neolook": "https://neolook.com/rss",
  "monthlyart": "https://monthlyart.com/feed"
}[$json.body.sourceId]
```

---

### 3️⃣ RSS Parser 노드 (Code 노드)

**노드**: Code  
**Language**: JavaScript

```javascript
const Parser = require('rss-parser');
const parser = new Parser();

// Get RSS XML from previous node
const rssXml = $input.first().json.data;

// Parse RSS
const feed = await parser.parseString(rssXml);

// Extract articles
const articles = feed.items.map((item, index) => ({
  id: item.guid || `${$json.body.sourceId}-${index}`,
  title: item.title || '',
  summary: item.contentSnippet || item.description || '',
  url: item.link || '',
  source: feed.title || $json.body.sourceId,
  sourceId: $json.body.sourceId,
  date: item.pubDate || item.isoDate || new Date().toISOString(),
  thumbnail: item.enclosure?.url || item['media:thumbnail']?.$?.url || '',
  category: item.categories?.[0] || 'General',
  language: $json.body.sourceId.includes('art') && 
            !['arthub', 'neolook', 'monthlyart'].includes($json.body.sourceId) 
            ? 'en' : 'ko'
}));

// Limit results
const limit = $json.body.limit || 20;
return articles.slice(0, limit);
```

---

### 4️⃣ OpenAI - Content Analysis (선택)

**노드**: OpenAI  
**Operation**: Message a Model  
**Model**: gpt-4o-mini

**Prompt**:
```
다음 아트 뉴스를 분석하고 카테고리를 지정해주세요:

제목: {{ $json.title }}
내용: {{ $json.summary }}

다음 카테고리 중 하나를 선택:
- Exhibition (전시)
- Auction (경매)
- Art Market (아트 마켓)
- Artist Profile (아티스트)
- Review (비평)
- News (일반 뉴스)

응답 형식: {"category": "카테고리명", "tags": ["태그1", "태그2"]}
```

---

### 5️⃣ OpenAI - Translation

**노드**: OpenAI  
**Operation**: Message a Model  
**Model**: gpt-4o-mini

**Condition**: `{{ $json.language === 'en' }}`

**Prompt**:
```
다음 영어 아트 뉴스를 한국어로 자연스럽게 번역해주세요:

제목: {{ $json.title }}
요약: {{ $json.summary }}

응답 형식:
{
  "translatedTitle": "번역된 제목",
  "translatedSummary": "번역된 요약"
}
```

---

### 6️⃣ Format Response 노드 (Code)

**노드**: Code  
**Language**: JavaScript

```javascript
// Combine all articles with translations
const articles = $input.all().map(item => {
  const article = item.json;
  
  // If translation exists, add it
  if (article.translatedTitle) {
    return {
      ...article,
      translatedTitle: article.translatedTitle,
      translatedSummary: article.translatedSummary
    };
  }
  
  return article;
});

return [{
  json: {
    success: true,
    sourceId: $('Webhook').first().json.body.sourceId,
    articles: articles,
    total: articles.length,
    timestamp: new Date().toISOString()
  }
}];
```

---

### 7️⃣ Webhook Response 노드

**노드**: Respond to Webhook  
**Response Code**: 200  
**Response Body**: `{{ $json }}`

---

## 🚀 프론트엔드 연동

### API 함수 업데이트 (`lib/api.ts`)

```typescript
export async function fetchArticlesBySource(sourceId: string, limit: number = 20) {
  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, limit })
    });
    
    if (!response.ok) throw new Error('Failed to fetch articles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return null;
  }
}
```

### Next.js API Route (`app/api/articles/route.ts`)

```typescript
import { NextResponse } from 'next/server';

const N8N_ARTICLE_WEBHOOK = process.env.N8N_ARTICLE_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, limit = 20 } = body;

    if (!N8N_ARTICLE_WEBHOOK) {
      return NextResponse.json(
        { error: 'N8N webhook URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(N8N_ARTICLE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, limit })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
```

---

## 🌐 RSS Feed URLs

```javascript
const RSS_FEEDS = {
  // International
  artnet: "https://news.artnet.com/feed",
  artnewspaper: "https://www.theartnewspaper.com/rss",
  
  // Korea
  arthub: "https://www.arthub.co.kr/feed/rss",
  neolook: "https://neolook.com/rss",
  monthlyart: "https://monthlyart.com/feed"
};
```

---

## 📊 워크플로우 2: 검색 기능 (선택)

### 구조
```
[Webhook] → [Get All RSS] → [OpenAI Search] → [Response]
```

### OpenAI 검색 프롬프트
```
사용자 검색어: {{ $json.query }}

다음 아트 뉴스들 중에서 검색어와 가장 관련있는 상위 10개를 선택하고 관련도 점수를 매겨주세요:

{{ $json.articles }}

응답 형식:
[
  {
    "articleId": "...",
    "relevanceScore": 0.95,
    "reason": "검색어와 관련된 이유"
  }
]
```

---

## 🔒 환경 변수 설정

`.env.local`에 추가:
```bash
# n8n Webhook URLs
N8N_ARTICLE_WEBHOOK_URL=http://localhost:5678/webhook/article-rss

# OpenAI (이미 설정되어 있음)
OPENAI_API_KEY=your_openai_api_key
```

---

## ✅ 테스트 방법

### 1. n8n에서 워크플로우 활성화

### 2. Postman/Thunder Client로 테스트
```bash
POST http://localhost:5678/webhook/article-rss
Content-Type: application/json

{
  "sourceId": "artnet",
  "limit": 10
}
```

### 3. 프론트엔드에서 테스트
```javascript
// ArticleTab.tsx에서
const loadArticles = async (sourceId: string) => {
  setIsLoading(true);
  const result = await fetchArticlesBySource(sourceId, 20);
  if (result?.articles) {
    setArticles(result.articles);
  }
  setIsLoading(false);
};
```

---

## 🎯 예상 응답 형식

```json
{
  "success": true,
  "sourceId": "artnet",
  "articles": [
    {
      "id": "artnet-12345",
      "title": "Major Auction Sees Record Sales",
      "translatedTitle": "주요 경매에서 기록적인 판매 달성",
      "summary": "Christie's evening sale...",
      "translatedSummary": "크리스티 이브닝 세일...",
      "url": "https://news.artnet.com/...",
      "source": "Artnet News",
      "sourceId": "artnet",
      "category": "Auction",
      "date": "2026-01-23T10:00:00Z",
      "thumbnail": "https://...",
      "language": "en",
      "tags": ["auction", "christie's", "art market"]
    }
  ],
  "total": 20,
  "timestamp": "2026-01-23T15:30:00Z"
}
```

---

## 💡 추가 기능 아이디어

1. **캐싱**: Redis로 30분간 캐시
2. **스케줄링**: n8n Schedule Trigger로 매시간 자동 업데이트
3. **알림**: 새로운 중요 뉴스 발견 시 알림
4. **트렌딩**: 조회수/북마크 수 기반 인기 글 추천
5. **AI 요약**: 긴 글을 3줄 요약

---

이제 이 가이드에 따라 n8n 워크플로우를 만들어보세요! 🚀
