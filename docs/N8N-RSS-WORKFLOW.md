# n8n RSS Feed & AI Search Workflow 설정 가이드

## 🎨 개요
ARTICLE 탭에서 여러 아트 뉴스 소스의 RSS 피드를 가져오고 AI 기반 검색을 제공하는 n8n workflow입니다.

---

## 📋 Workflow 구조

```
Webhook (POST)
    ↓
  Switch (action 분기)
    ↓
├─ fetch_feed → RSS Parser → Format Articles → Respond
│
└─ search → RSS Parser → OpenAI Filter → Respond
```

---

## 🔧 Workflow 설정

### 1️⃣ **Webhook 노드 설정**

**설정:**
- HTTP Method: `POST`
- Path: `rss-articles`
- Authentication: None

**요청 예시:**
```json
{
  "action": "fetch_feed",
  "sourceId": "artnet",
  "query": "contemporary art" // (search 시에만)
}
```

---

### 2️⃣ **Switch 노드 - Action 분기**

**Mode:** Rules

**Rule 1 - Fetch Feed:**
```
{{ $json.body.action }} = "fetch_feed"
```

**Rule 2 - Search:**
```
{{ $json.body.action }} = "search"
```

---

## 📡 Branch 1: Fetch Feed (RSS 피드 가져오기)

### Step 1: Set Node - RSS URL 가져오기

**Name:** Get RSS URL

```javascript
const sources = {
  'artnet': 'https://news.artnet.com/feed',
  'artnewspaper': 'https://www.theartnewspaper.com/rss',
  'arthub': 'https://www.arthub.co.kr/rss/allArticle.xml',
  'neolook': 'https://www.neolook.com/rss',
  'monthlyart': 'https://www.monthlyart.com/rss'
};

const sourceId = $json.body.sourceId || 'artnet';
const rssUrl = sources[sourceId] || sources['artnet'];

return {
  json: {
    rssUrl,
    sourceId
  }
};
```

### Step 2: RSS Feed Read 노드

**Name:** Parse RSS Feed

**설정:**
- URL: `{{ $json.rssUrl }}`

또는 **HTTP Request** 노드 사용:
- Method: `GET`
- URL: `{{ $json.rssUrl }}`
- Response Format: `String`

그 다음 **XML** 노드로 파싱:
- Property Name: `data`
- Options: Include XML Node Attributes

### Step 3: Code 노드 - Format Articles

**Name:** Format Articles

```javascript
const items = [];

// RSS 피드 항목 파싱
const feedItems = $input.all();

for (const item of feedItems) {
  const entry = item.json;
  
  // RSS 표준 필드 처리
  const article = {
    id: entry.guid || entry.link || `article-${Date.now()}-${Math.random()}`,
    title: entry.title || 'Untitled',
    summary: entry.description || entry.content || '',
    thumbnail: entry.enclosure?.url || entry['media:content']?.url || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
    url: entry.link || '#',
    source: entry.source || $('Get RSS URL').item.json.sourceId,
    sourceId: $('Get RSS URL').item.json.sourceId,
    category: 'News',
    date: entry.pubDate || entry.published || new Date().toISOString(),
    language: $('Get RSS URL').item.json.sourceId.includes('art') ? 'EN' : 'KR'
  };
  
  items.push({ json: article });
}

// 최신순으로 정렬
items.sort((a, b) => new Date(b.json.date) - new Date(a.json.date));

// 최대 20개만 반환
return items.slice(0, 20);
```

### Step 4: Respond to Webhook

**Response Body:**
```javascript
{
  "articles": {{ $json }},
  "success": true,
  "source": "{{ $('Get RSS URL').item.json.sourceId }}",
  "count": {{ $json.length }}
}
```

---

## 🔍 Branch 2: Search (AI 기반 검색)

### Step 1: Set Node - 검색 설정

**Name:** Prepare Search

```javascript
const sources = {
  'artnet': 'https://news.artnet.com/feed',
  'artnewspaper': 'https://www.theartnewspaper.com/rss',
  'arthub': 'https://www.arthub.co.kr/rss/allArticle.xml',
  'neolook': 'https://www.neolook.com/rss',
  'monthlyart': 'https://www.monthlyart.com/rss'
};

const sourceId = $json.body.sourceId;
const query = $json.body.query || '';

// sourceId가 있으면 해당 소스만, 없으면 모든 소스 검색
const rssUrls = sourceId 
  ? [sources[sourceId]]
  : Object.values(sources);

return rssUrls.map(url => ({
  json: { rssUrl: url, query }
}));
```

### Step 2: Loop Over Items (RSS URLs)

각 URL에 대해 RSS 파싱 수행

### Step 3: RSS Feed Read

Branch 1과 동일

### Step 4: OpenAI 노드 - 관련 기사 필터링

**Name:** AI Filter Articles

**Model:** `gpt-3.5-turbo`

**System Message:**
```
You are an art news filter. Given a list of article titles and summaries, 
select the most relevant articles based on the search query.
Return the article IDs of the top 10 most relevant articles as a JSON array.
```

**User Message:**
```javascript
Query: {{ $('Prepare Search').item.json.query }}

Articles:
{{ $json.map((item, i) => `${i}. ${item.title} - ${item.summary.substring(0, 200)}`).join('\n') }}

Return only article indices (numbers) as JSON array, e.g., [0, 3, 5, 7]
```

**Options:**
- Temperature: `0.3`
- Max Tokens: `200`
- Response Format: `JSON`

### Step 5: Code 노드 - Filter & Format

**Name:** Apply Filter

```javascript
const allArticles = $('RSS Feed Read').all();
const selectedIndices = JSON.parse($json.message.content);

const filteredArticles = selectedIndices
  .map(index => allArticles[index])
  .filter(item => item !== undefined)
  .map(item => ({
    json: {
      id: item.json.guid || item.json.link,
      title: item.json.title,
      summary: item.json.description,
      thumbnail: item.json.enclosure?.url || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
      url: item.json.link,
      source: item.json.source || 'RSS Feed',
      category: 'News',
      date: item.json.pubDate || new Date().toISOString(),
      language: item.json.source?.includes('art') ? 'EN' : 'KR'
    }
  }));

return filteredArticles;
```

### Step 6: Respond to Webhook

**Response Body:**
```javascript
{
  "articles": {{ $json }},
  "success": true,
  "query": "{{ $('Prepare Search').item.json.query }}",
  "count": {{ $json.length }}
}
```

---

## 🧪 테스트

### 피드 가져오기 테스트:
```bash
curl -X POST http://localhost:5678/webhook/rss-articles \
  -H "Content-Type: application/json" \
  -d '{"action":"fetch_feed","sourceId":"artnet"}'
```

### 검색 테스트:
```bash
curl -X POST http://localhost:5678/webhook/rss-articles \
  -H "Content-Type: application/json" \
  -d '{"action":"search","query":"contemporary art","sourceId":"artnet"}'
```

---

## 🎯 환경 설정

### `.env.local` 파일:
```bash
N8N_WEBHOOK_URL=http://localhost:5678/webhook/rss-articles
OPENAI_API_KEY=sk-proj-xxxxx
```

---

## 💡 추가 기능 (선택사항)

### 1. 캐싱
RSS 피드를 일정 시간 캐싱하여 API 호출 절약

### 2. 이미지 추출
`og:image` 메타 태그에서 썸네일 추출

### 3. 카테고리 자동 분류
OpenAI로 기사 카테고리 자동 분류 (Critique/Interview/News)

### 4. 번역 통합
영문 기사를 자동으로 한국어로 번역

---

## 🐛 문제 해결

### RSS 피드가 안 가져와질 때:
- URL이 올바른지 확인
- CORS 문제: n8n이 프록시 역할
- RSS 포맷 확인 (Atom vs RSS 2.0)

### AI 필터링이 잘 안될 때:
- 프롬프트 개선
- Temperature 조정
- 더 많은 컨텍스트 제공

---

## 📊 비용 예상

- **GPT-3.5-turbo**: 검색 1회당 약 ₩10-20
- **RSS 파싱**: 무료
- **월 예상 비용** (1000회 검색): 약 ₩10,000-20,000

---

완벽합니다! 이제 ARTICLE 탭이 AI 기반 아트 뉴스 큐레이션 시스템으로 업그레이드되었습니다! 🎨✨
