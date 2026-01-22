# API 설정 가이드

NAVA 프로젝트에 사용되는 API들의 키 발급 및 설정 방법입니다.

## 📋 필요한 API 목록

### 필수 (핵심 기능)
1. **Supabase** (데이터베이스 & 스토리지) - 무료 플랜 가능
2. **Google Gemini API** (AI 요약) - 무료(제한적)

### 선택 (ARTICLE 탭 기능 향상)
3. **네이버 검색 API** (한국 뉴스) - 무료
4. **News API** (글로벌 뉴스) - 무료(제한적)
5. **공공데이터포털** (한국 전시회 정보) - 무료

### 미래 통합 준비
6. **Artsy API** (미술 작품 데이터)
7. **n8n Webhook** (자동화 워크플로우)

---

## 1. Supabase 설정 (필수)

### 발급 방법:
1. https://supabase.com/ 접속
2. "Start your project" 클릭 → GitHub 로그인
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Name: NAVA
   - Database Password: 안전한 비밀번호 생성
   - Region: Northeast Asia (Seoul) 선택
5. 프로젝트 생성 완료 (1-2분 소요)
6. 왼쪽 메뉴 "Settings" → "API" 클릭
7. **Project URL**과 **anon public** 키 복사

### .env.local에 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 2. Google Gemini API (필수)

### 발급 방법:
1. https://makersuite.google.com/app/apikey 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. **API Key** 복사

### .env.local에 추가:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**무료 할당량**: 60 requests/minute, 충분히 사용 가능

---

## 3. 네이버 검색 API (선택)

### 발급 방법:
1. https://developers.naver.com/ 접속
2. 우측 상단 "Application" → "애플리케이션 등록" 클릭
3. 애플리케이션 정보 입력:
   - 애플리케이션 이름: NAVA
   - 사용 API: 검색 (뉴스 검색)
   - 환경 추가: WEB 설정 → `http://localhost:3000`
4. 등록 후 **Client ID**와 **Client Secret** 복사

### .env.local에 추가:
```env
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

**무료 할당량**: 25,000 requests/day

---

## 4. News API (선택)

### 발급 방법:
1. https://newsapi.org/ 접속
2. "Get API Key" 클릭
3. 회원가입 (이메일, 비밀번호)
4. 대시보드에서 **API Key** 복사

### .env.local에 추가:
```env
NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here
```

**참고**: 무료 플랜은 개발 환경에서만 사용 가능합니다 (100 requests/day).

---

## 5. 공공데이터포털 API (선택)

### 발급 방법:
1. https://www.data.go.kr/ 접속
2. 회원가입 후 로그인
3. 검색창에 "공연전시정보조회서비스" 검색
4. "문화체육관광부_공연전시정보조회서비스" 선택
5. "활용신청" 클릭 → "일반 인증키(Encoding)" 선택
6. 약 1-2일 후 승인 완료 (마이페이지에서 확인)
7. 승인 후 **일반 인증키(Encoding)** 복사

### .env.local에 추가:
```env
PUBLIC_DATA_API_KEY=your_api_key_here
```

**참고**: 승인까지 1-2일 소요되므로 미리 신청하세요!

---

## 6. Artsy API (미래 통합)

Artsy API는 미술 작품, 아티스트, 갤러리 정보에 접근할 수 있는 API입니다.

### 발급 방법:
1. https://developers.artsy.net/ 접속
2. "Request API Access" 클릭
3. 신청서 작성 (프로젝트 설명 필요)
4. 승인 후 Client ID와 Client Secret 발급

### .env.local에 추가:
```env
ARTSY_CLIENT_ID=your_client_id
ARTSY_CLIENT_SECRET=your_client_secret
```

---

## 7. n8n Webhook (미래 통합)

n8n은 자동화 워크플로우 도구입니다. 이미지 처리, 데이터 동기화 등에 활용할 수 있습니다.

### 설정 방법:
1. n8n 인스턴스 설정 (self-hosted 또는 n8n.cloud)
2. Webhook 노드 추가
3. Webhook URL 복사

### .env.local에 추가:
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

---

## 🚀 설정 완료 후

### 1. 전체 `.env.local` 파일 예시

```env
# 필수
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# 선택 (ARTICLE 탭)
NAVER_CLIENT_ID=your_naver_id
NAVER_CLIENT_SECRET=your_naver_secret
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
PUBLIC_DATA_API_KEY=your_public_data_key

# 미래 통합
N8N_WEBHOOK_URL=your_n8n_webhook_url
ARTSY_CLIENT_ID=your_artsy_id
ARTSY_CLIENT_SECRET=your_artsy_secret
```

### 2. 개발 서버 재시작
```bash
npm run dev
```

### 3. 기능 플래그 확인

프로젝트는 API 키 존재 여부에 따라 자동으로 기능을 활성화/비활성화합니다.

`lib/constants.ts`에서 확인 가능:
```typescript
export const FEATURES = {
  ENABLE_AI_SUMMARY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  ENABLE_NAVER_NEWS: !!process.env.NAVER_CLIENT_ID,
  ENABLE_ARTSY_API: !!process.env.ARTSY_CLIENT_ID,
  ENABLE_N8N_INTEGRATION: !!process.env.N8N_WEBHOOK_URL,
}
```

---

## ⚠️ 중요 사항

### 1. 보안
- **API 키는 절대 GitHub에 커밋하지 마세요!**
- `.env.local` 파일은 `.gitignore`에 자동으로 포함되어 있습니다.
- 프로덕션 배포 시 Vercel/Netlify 환경 변수에 키를 추가하세요.

### 2. 무료 API 사용량 제한
- **Supabase**: 500MB 데이터베이스, 1GB 파일 스토리지
- **Gemini**: 60 requests/minute
- **네이버**: 25,000 requests/day
- **News API**: 100 requests/day (개발 전용)
- **공공데이터**: 1,000 requests/day

### 3. 대체 방안 (API 키 없이도 작동)
- **RSS 피드**: API 키 없이 작동 (Article 탭의 기본 데이터 소스)
- **Mock 데이터**: 개발 모드에서는 mock 데이터 자동 사용
- 프로젝트는 API 키 없이도 기본 기능은 모두 사용 가능

---

## 📞 문제 해결

### API가 작동하지 않을 때:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 정확한지 확인 (대소문자 구분!)
3. 개발 서버를 재시작했는지 확인
4. 브라우저 콘솔(F12)에서 에러 메시지 확인
5. API 키의 사용량 제한을 초과하지 않았는지 확인

### CORS 에러가 발생할 때:
- API 요청은 `/api/` 라우트를 통해 서버 측에서 실행됩니다.
- 클라이언트 측에서 직접 API를 호출하지 마세요.

### 승인 대기 중일 때:
- 공공데이터포털 API는 승인이 필요하므로, 그동안 RSS 피드를 사용하세요.
- RSS 피드는 별도 설정 없이 바로 작동합니다.

---

## 📚 추가 리소스

- **Supabase 문서**: https://supabase.com/docs
- **Gemini API 문서**: https://ai.google.dev/docs
- **네이버 API 가이드**: https://developers.naver.com/docs/search/news/
- **News API 문서**: https://newsapi.org/docs
- **공공데이터포털 가이드**: https://www.data.go.kr/

---

## 🎯 배포 시 체크리스트

배포 전에 다음을 확인하세요:

- [ ] Supabase 프로젝트 생성 및 키 설정
- [ ] Gemini API 키 발급
- [ ] 배포 플랫폼(Vercel/Netlify)에 환경 변수 추가
- [ ] API 키 사용량 모니터링 설정
- [ ] Supabase RLS(Row Level Security) 정책 설정
- [ ] 프로덕션 도메인을 API 허용 목록에 추가
