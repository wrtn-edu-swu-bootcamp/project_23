# n8n AI Agent 설정 가이드

## 🤖 개요
ARTICLE 탭에서 AI 기반 번역 및 검색 기능을 제공하기 위한 n8n workflow 설정 가이드입니다.

## 📋 필요한 것
1. **n8n 계정** - [n8n.cloud](https://n8n.cloud) 또는 self-hosted
2. **OpenAI API Key** - GPT-4 또는 GPT-3.5-turbo
3. **Webhook URL** - n8n workflow webhook endpoint

---

## 🔧 n8n Workflow 설정

### Step 1: 새 Workflow 생성
n8n 대시보드에서 새 workflow를 생성합니다.

### Step 2: Webhook 노드 추가
1. **Webhook** 노드 추가
2. HTTP Method: `POST`
3. Path: `article-ai`
4. Authentication: None (또는 필요시 설정)

### Step 3: Switch 노드로 액션 분기
1. **Switch** 노드 추가
2. Mode: `Rules`
3. Rules:
   - `action` = `translate` → 번역 플로우
   - `action` = `search_articles` → 검색 플로우

---

## 📝 번역 Workflow (translate)

### 노드 구성:
```
Webhook → Switch → OpenAI (번역) → Respond to Webhook
```

### OpenAI 노드 설정:
```javascript
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a professional translator. Translate the following text to Korean. Maintain the format with 'Title:' and 'Summary:' prefixes."
    },
    {
      "role": "user",
      "content": "{{ $json.data.text }}"
    }
  ]
}
```

### Response 형식:
```json
{
  "translation": "번역된 텍스트",
  "success": true
}
```

---

## 🔍 검색 Workflow (search_articles)

### 노드 구성:
```
Webhook → Switch → OpenAI (키워드 추출) → HTTP Request (기사 검색) → Respond to Webhook
```

### OpenAI 노드 1 (키워드 추출):
```javascript
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Extract 3-5 relevant English keywords for searching art articles based on the user's Korean or English query. Return only comma-separated keywords."
    },
    {
      "role": "user",
      "content": "{{ $json.data.query }}"
    }
  ]
}
```

### HTTP Request 노드 (RSS 피드 검색):
- URL: `https://www.artnews.com/feed/`
- Method: `GET`
- 또는 News API 사용

### OpenAI 노드 2 (결과 필터링):
사용자 쿼리와 가장 관련성 높은 기사 5개를 선별하고 한국어로 요약

### Response 형식:
```json
{
  "articles": [
    {
      "id": "unique-id",
      "title": "Article Title",
      "summary": "Article summary...",
      "thumbnail": "https://...",
      "url": "https://...",
      "source": "Art News",
      "category": "News",
      "date": "2024-01-20"
    }
  ],
  "success": true
}
```

---

## 🌐 환경변수 설정

`.env.local` 파일에 n8n webhook URL을 추가하세요:

```bash
# n8n Webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/article-ai
```

---

## 🧪 테스트

### 1. Webhook 테스트 (cURL)
```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/article-ai \
  -H "Content-Type: application/json" \
  -d '{
    "action": "translate",
    "data": {
      "text": "Title: Contemporary Art Exhibition\n\nSummary: A groundbreaking exhibition featuring emerging artists.",
      "targetLang": "ko"
    }
  }'
```

### 2. 검색 테스트
```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/article-ai \
  -H "Content-Type: application/json" \
  -d '{
    "action": "search_articles",
    "data": {
      "query": "현대미술 전시회",
      "language": "ko"
    }
  }'
```

---

## 🎨 UI 기능

### ARTICLE 탭에서:
1. **검색창에 키워드 입력** → AI가 관련 해외 기사 추천
2. **번역 버튼 (🌐) 클릭** → 영문 기사를 한국어로 번역
3. **AI 검색 결과 표시** → "AI FOUND X RELATED ARTICLES" 배지

---

## 💡 추가 개선 아이디어

### 캐싱 추가
번역 결과를 localStorage에 저장하여 재번역 방지

### 요약 기능
긴 기사를 3줄로 압축하는 "AI 요약" 버튼 추가

### 트렌드 분석
주간/월간 아트 트렌드 리포트 자동 생성

---

## 🔒 보안 고려사항

1. **Rate Limiting**: n8n workflow에 rate limit 설정
2. **API Key 보호**: 환경변수 사용, 절대 클라이언트에 노출 금지
3. **Input Validation**: 악의적인 입력 필터링
4. **CORS**: 필요시 webhook에 CORS 설정

---

## 📞 문제 해결

### 번역이 작동하지 않을 때:
- n8n workflow가 활성화되어 있는지 확인
- OpenAI API Key가 유효한지 확인
- Webhook URL이 올바른지 확인

### 검색 결과가 나오지 않을 때:
- OpenAI API 할당량 확인
- RSS 피드 URL이 유효한지 확인
- 네트워크 연결 확인

---

## 🚀 배포 시 체크리스트

- [ ] n8n workflow 활성화
- [ ] `.env.local`에 N8N_WEBHOOK_URL 설정
- [ ] OpenAI API Key 설정
- [ ] Webhook 테스트 완료
- [ ] 프로덕션 환경에서 rate limiting 설정
- [ ] 에러 핸들링 및 로깅 확인
