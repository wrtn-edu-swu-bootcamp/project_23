# OpenAI 번역 및 검색 설정 가이드

## 🤖 개요
ARTICLE 탭에서 OpenAI API를 사용하여 AI 기반 번역 및 검색 기능을 제공합니다.

## ⚡ 빠른 시작

### 1. OpenAI API Key 발급
1. [OpenAI Platform](https://platform.openai.com/)에 가입
2. API Keys 섹션에서 새 API key 생성
3. API key를 안전하게 복사

### 2. 환경 변수 설정
`.env.local` 파일에 API key 추가:

```bash
# OpenAI API (for translation and AI search)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

### 3. 패키지 설치
```bash
npm install openai
```

### 4. 서버 재시작
```bash
npm run dev
```

---

## 🌐 번역 기능

### API 엔드포인트
`POST /api/translate`

### 요청 형식
```json
{
  "text": "Title: Contemporary Art Exhibition\n\nSummary: A groundbreaking exhibition...",
  "targetLang": "ko"
}
```

### 응답 형식
```json
{
  "translation": "제목: 현대 미술 전시회\n\n요약: 획기적인 전시회...",
  "success": true
}
```

### 사용 방법
1. 기사 카드의 **🌐 번역 버튼** 클릭
2. AI가 제목과 요약을 한국어로 번역
3. 번역 완료 후 **🇰🇷 TRANSLATED** 뱃지 표시

### 모델 설정
- 기본 모델: `gpt-3.5-turbo`
- Temperature: `0.3` (정확한 번역)
- Max Tokens: `1000`

더 나은 번역 품질을 원하면 `gpt-4`로 변경 가능:
```typescript
// app/api/translate/route.ts
model: 'gpt-4', // gpt-3.5-turbo → gpt-4
```

---

## 🔍 AI 검색 기능

### API 엔드포인트
`POST /api/search-articles`

### 요청 형식
```json
{
  "query": "현대미술 전시회"
}
```

### 응답 형식
```json
{
  "articles": [
    {
      "id": "ai-1234567890-0",
      "title": "The Future of Contemporary Art",
      "summary": "Exploring new directions...",
      "thumbnail": "https://...",
      "url": "#",
      "source": "AI Recommended",
      "category": "News",
      "date": "2024-01-20"
    }
  ],
  "keywords": "contemporary art, exhibition, modern",
  "success": true
}
```

### 작동 방식
1. 사용자가 검색창에 키워드 입력 (한글/영어 모두 가능)
2. AI가 관련 영어 키워드 추출
3. AI가 관련 기사 3개 추천
4. "AI FOUND X RELATED ARTICLES" 배지 표시

### 디바운스 설정
검색 요청은 800ms 디바운스 적용:
```typescript
// components/tabs/ArticleTab.tsx
setTimeout(async () => {
  // AI 검색 실행
}, 800)
```

---

## 💰 비용 예상

### GPT-3.5-turbo 가격 (2024년 기준)
- Input: $0.0015 / 1K tokens
- Output: $0.002 / 1K tokens

### 예상 비용
- **번역 1회**: 약 $0.003-0.005 (약 ₩4-7)
- **검색 1회**: 약 $0.004-0.008 (약 ₩5-10)
- **월 1000회 사용**: 약 $7-13 (약 ₩9,000-17,000)

### GPT-4 사용 시 (더 높은 품질)
- **번역 1회**: 약 $0.015-0.030 (약 ₩20-40)
- **검색 1회**: 약 $0.020-0.040 (약 ₩26-52)

---

## 🎨 UI 기능

### ARTICLE 탭에서:
1. **🔍 검색창** - "Search articles with AI..." 플레이스홀더
2. **✨ AI 검색 중** - Sparkles 아이콘 애니메이션
3. **🌐 번역 버튼** - 각 기사 카드에 표시
4. **🇰🇷 번역 완료 뱃지** - 번역된 기사 표시
5. **AI FOUND X 배지** - AI 검색 결과 개수 표시

---

## 🔧 커스터마이징

### 번역 품질 조정
```typescript
// app/api/translate/route.ts
temperature: 0.3, // 0-1 (낮을수록 정확, 높을수록 창의적)
```

### 검색 결과 개수 변경
```typescript
// app/api/search-articles/route.ts
content: `suggest 3 relevant art articles` // 3 → 5로 변경
```

### 검색 모델 변경
```typescript
// app/api/search-articles/route.ts
model: 'gpt-4', // 더 정확한 검색
```

---

## 🐛 문제 해결

### "OPENAI_API_KEY not configured" 오류
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. API key가 올바르게 입력되었는지 확인
3. 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

### 번역이 느릴 때
1. GPT-3.5-turbo 사용 (GPT-4보다 5-10배 빠름)
2. `max_tokens` 값 줄이기
3. 네트워크 연결 확인

### API 할당량 초과
1. OpenAI 대시보드에서 사용량 확인
2. 요금제 업그레이드 또는 사용량 제한 설정
3. 번역 결과 localStorage에 캐싱 (추후 구현 가능)

### 검색 결과가 이상할 때
1. 프롬프트 조정 필요
2. `temperature` 값 낮추기 (0.5 → 0.3)
3. 더 구체적인 검색어 사용

---

## 🚀 고급 기능 (추후 구현 가능)

### 1. 번역 캐싱
```typescript
// 동일한 기사는 재번역하지 않기
const cachedTranslation = localStorage.getItem(`translation-${articleId}`)
if (cachedTranslation) return JSON.parse(cachedTranslation)
```

### 2. 배치 번역
```typescript
// 여러 기사를 한 번에 번역
const translations = await translateMultiple([article1, article2, article3])
```

### 3. 스트리밍 응답
```typescript
// 번역 결과를 실시간으로 표시
const stream = await openai.chat.completions.create({
  stream: true,
  // ...
})
```

### 4. 실제 RSS 피드 검색
```typescript
// AI 추천 대신 실제 RSS 피드 검색
import Parser from 'rss-parser'
const parser = new Parser()
const feed = await parser.parseURL('https://www.artnews.com/feed/')
```

---

## 🔒 보안 모범 사례

1. **API Key 보호**
   - `.env.local`에만 저장
   - Git에 절대 커밋하지 않기 (`.gitignore` 확인)
   - 환경변수는 서버 사이드에서만 사용

2. **Rate Limiting**
   - 사용자당 요청 횟수 제한
   - 디바운스로 불필요한 요청 방지

3. **에러 핸들링**
   - API 오류 시 사용자 친화적 메시지 표시
   - 민감한 정보 노출 방지

4. **비용 관리**
   - OpenAI 대시보드에서 사용량 모니터링
   - 월 사용량 한도 설정

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] OpenAI API Key 발급 완료
- [ ] `.env.local`에 OPENAI_API_KEY 설정
- [ ] `npm install openai` 실행
- [ ] 번역 기능 테스트 (기사 카드에서 🌐 버튼 클릭)
- [ ] 검색 기능 테스트 (검색창에 키워드 입력)
- [ ] API 사용량 모니터링 설정
- [ ] 에러 핸들링 확인
- [ ] 프로덕션 환경변수 설정

---

## 📞 참고 링크

- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
