# 아트허브 통합 서비스 개발 가이드

## 🎯 목표
아트허브 웹사이트의 주요 콘텐츠를 카테고리별로 정리하여 제공하는 서비스

---

## 📊 제공할 카테고리

### 1. 아카이브 (전시 정보)
- **전시게재**: 현재 진행 중인 전시
- **신규전시**: 새롭게 추가된 전시
- **예정전시**: 앞으로 열릴 전시

### 2. 큐레이션 (콘텐츠)
- **칼럼**: 전문가 칼럼
- **아트뉴스**: 미술 관련 뉴스

### 3. 아트잡 (채용 정보)
- 미술 관련 채용 공고

### 4. 평론
- 작품 평론 및 비평

### 5. 검색 기능
- 모든 카테고리 통합 검색
- 키워드 기반 콘텐츠 필터링

---

## 🏗️ 시스템 구조

```
사용자 → ArticleTab (프론트엔드)
            ↓
        API Route (/api/arthub)
            ↓
        n8n 워크플로우 (웹 스크래핑 + AI 분류)
            ↓
        Gemini AI (콘텐츠 분석 & 검색)
            ↓
        응답 데이터 → 프론트엔드 표시
```

---

## 🔧 n8n 워크플로우 구조

### 워크플로우 1: 아트허브 데이터 수집

```
[Webhook Trigger]
    ↓
[Switch: 카테고리 선택]
    ├─ archive → [HTML 스크래핑: 전시 페이지]
    ├─ curation → [HTML 스크래핑: 큐레이션 페이지]
    ├─ artjob → [HTML 스크래핑: 아트잡 페이지]
    └─ review → [HTML 스크래핑: 평론 페이지]
    ↓
[HTML 파싱 (Code 노드)]
    ↓
[AI Agent: 콘텐츠 정리 & 분류]
    ↓
[Format Response]
    ↓
[Webhook Response]
```

### 워크플로우 2: 검색 기능

```
[Webhook Trigger]
    ↓
[모든 카테고리 데이터 수집]
    ↓
[AI Agent: 검색어 매칭 & 랭킹]
    ↓
[결과 반환]
```

---

## 📝 단계별 구현 가이드

### STEP 1: 아트허브 URL 분석

각 카테고리의 URL:
- **전시게재**: `https://www.arthub.co.kr/exhibitions/ongoing`
- **신규전시**: `https://www.arthub.co.kr/exhibitions/new`
- **예정전시**: `https://www.arthub.co.kr/exhibitions/upcoming`
- **칼럼**: `https://www.arthub.co.kr/curation/columns`
- **아트뉴스**: `https://www.arthub.co.kr/curation/news`
- **아트잡**: `https://www.arthub.co.kr/artjob`
- **평론**: `https://www.arthub.co.kr/review`

### STEP 2: n8n 워크플로우 생성

#### 노드 1: Webhook (트리거)
- **Path**: `/arthub`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "action": "fetch",
    "category": "archive-ongoing" | "archive-new" | "archive-upcoming" | "curation-column" | "curation-news" | "artjob" | "review",
    "limit": 20
  }
  ```

#### 노드 2: Switch (카테고리별 분기)
- **Mode**: Expression
- **Output**: 카테고리별 분기

#### 노드 3: HTTP Request (웹 페이지 가져오기)
- **URL**: 각 카테고리 URL
- **Method**: GET
- **Response Format**: String (HTML)

#### 노드 4: Code (HTML 파싱)
```javascript
// HTML에서 콘텐츠 추출
const html = $input.first().json.data;
const category = $('Webhook').first().json.body.category;

// 정규식으로 제목, 링크, 이미지 추출
const titleRegex = /<h3[^>]*>([^<]+)<\/h3>/gi;
const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>/gi;
const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi;

const items = [];
let titleMatch, linkMatch, imgMatch;
let index = 0;

// 제목 추출
const titles = [];
while ((titleMatch = titleRegex.exec(html)) !== null && index < 20) {
  titles.push(titleMatch[1].trim());
  index++;
}

// 링크 추출
index = 0;
const links = [];
while ((linkMatch = linkRegex.exec(html)) !== null && index < 20) {
  const url = linkMatch[1];
  if (url.startsWith('/')) {
    links.push('https://www.arthub.co.kr' + url);
  } else if (url.startsWith('http')) {
    links.push(url);
  }
  index++;
}

// 데이터 조합
for (let i = 0; i < Math.min(titles.length, links.length); i++) {
  items.push({
    id: `arthub-${category}-${i}`,
    title: titles[i],
    url: links[i],
    source: 'arthub',
    category: category,
    date: new Date().toISOString(),
    language: 'ko'
  });
}

return items.map(item => ({ json: item }));
```

#### 노드 5: AI Agent (Gemini)
- **System Message**:
  ```
  당신은 아트 콘텐츠 분석 전문가입니다.
  
  역할:
  - 콘텐츠의 제목을 분석하여 요약 생성
  - 키워드 추출
  - 카테고리 세부 분류
  
  출력:
  - JSON 형식
  ```

- **Prompt**:
  ```
  다음 아트 콘텐츠를 분석해주세요:
  
  제목: {{ $json.title }}
  카테고리: {{ $json.category }}
  
  다음 JSON 형식으로 응답:
  {
    "summary": "한 줄 요약",
    "keywords": ["키워드1", "키워드2"],
    "subcategory": "세부 분류"
  }
  ```

#### 노드 6: Parse AI Response
```javascript
const article = $('Code').item.json;
const aiResponse = $input.first().json;

try {
  const responseText = aiResponse.output || aiResponse.text || '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    const aiResult = JSON.parse(jsonMatch[0]);
    
    return {
      json: {
        ...article,
        summary: aiResult.summary,
        keywords: aiResult.keywords || [],
        subcategory: aiResult.subcategory || article.category
      }
    };
  }
} catch (error) {
  console.log('Parse error:', error);
}

return { json: article };
```

#### 노드 7: Format Response
```javascript
const items = $input.all().map(item => item.json);

return [{
  json: {
    success: true,
    source: 'arthub',
    category: $('Webhook').first().json.body.category,
    items: items,
    total: items.length,
    timestamp: new Date().toISOString()
  }
}];
```

#### 노드 8: Respond to Webhook
- **Response Body**: `{{ $json }}`

---

## 💻 프론트엔드 구현

### ArticleTab 구조 개선

```
┌─────────────────────────────────┐
│  ARTICLE                        │
├─────────────────────────────────┤
│  [아트허브] [Artnet] [...]      │  ← 소스 선택
├─────────────────────────────────┤
│  ╔═════════════════════════╗    │
│  ║  아트허브 서브메뉴       ║    │
│  ║  [아카이브] [큐레이션]  ║    │
│  ║  [아트잡] [평론]        ║    │
│  ╚═════════════════════════╝    │
├─────────────────────────────────┤
│  [검색창: 키워드 입력]          │
├─────────────────────────────────┤
│  📰 콘텐츠 목록                 │
│  ┌───────────────────┐          │
│  │ [이미지]          │          │
│  │ 제목              │          │
│  │ 요약              │          │
│  │ #키워드1 #키워드2  │          │
│  └───────────────────┘          │
└─────────────────────────────────┘
```

---

## 🚀 구현 순서

### Phase 1: n8n 워크플로우 (지금)
1. ✅ 워크플로우 JSON 생성
2. ⏳ n8n에 임포트
3. ⏳ 테스트

### Phase 2: API & 프론트엔드 (다음)
1. API Route 생성
2. ArticleTab UI 개선
3. 카테고리 탭 추가
4. 검색 기능 구현

### Phase 3: 다른 소스 추가
1. Artnet 구현
2. The Art Newspaper 구현
3. 네오룩, 월간미술 구현

---

## 📌 주의사항

### 웹 스크래핑 주의점
1. **로봇 배제 표준** 확인: `https://www.arthub.co.kr/robots.txt`
2. **요청 간격** 설정: 너무 빠르게 요청하지 않기
3. **에러 처리**: 웹사이트 구조 변경 시 대응

### 대안: RSS 피드 사용
- 아트허브 RSS: `https://www.arthub.co.kr/feed/rss`
- 더 안정적이고 합법적

---

다음 단계로 실제 n8n 워크플로우 JSON을 생성하겠습니다!
