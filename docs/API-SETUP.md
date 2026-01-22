# API 설정 가이드

NAVA 프로젝트에 사용되는 API들의 키 발급 및 설정 방법입니다.

## 📋 필요한 API 목록

1. **네이버 검색 API** (한국 뉴스) - 무료
2. **News API** (글로벌 뉴스) - 무료(제한적)
3. **공공데이터포털** (한국 전시회 정보) - 무료
4. **Google Gemini API** (AI 챗봇) - 무료(제한적)

---

## 1. 네이버 검색 API 발급 (무료)

### 발급 방법:
1. https://developers.naver.com/ 접속
2. 우측 상단 "Application" → "애플리케이션 등록" 클릭
3. 애플리케이션 정보 입력:
   - 애플리케이션 이름: NAVA
   - 사용 API: 검색 (뉴스 검색)
   - 환경 추가: WEB 설정 → `http://localhost:3000`
4. 등록 후 **Client ID**와 **Client Secret** 복사

### .env.local에 추가:
```
NEXT_PUBLIC_NAVER_CLIENT_ID=발급받은_Client_ID
NEXT_PUBLIC_NAVER_CLIENT_SECRET=발급받은_Client_Secret
```

---

## 2. News API 발급 (무료 - 100 requests/day)

### 발급 방법:
1. https://newsapi.org/ 접속
2. "Get API Key" 클릭
3. 회원가입 (이메일, 비밀번호)
4. 대시보드에서 **API Key** 복사

### .env.local에 추가:
```
NEXT_PUBLIC_NEWS_API_KEY=발급받은_API_Key
```

**참고**: 무료 플랜은 개발 환경에서만 사용 가능합니다.

---

## 3. 공공데이터포털 - 문화체육관광부 API (무료)

### 발급 방법:
1. https://www.data.go.kr/ 접속
2. 회원가입 후 로그인
3. 검색창에 "공연전시정보조회서비스" 검색
4. "문화체육관광부_공연전시정보조회서비스" 선택
5. "활용신청" 클릭 → "일반 인증키(Encoding)" 선택
6. 약 1-2일 후 승인 완료 (마이페이지에서 확인)
7. 승인 후 **일반 인증키(Encoding)** 복사

### .env.local에 추가:
```
NEXT_PUBLIC_CULTURE_API_KEY=발급받은_인증키
```

**참고**: 승인까지 1-2일 소요되므로 미리 신청하세요!

---

## 4. Google Gemini API (무료 - 60 requests/minute)

### 발급 방법:
1. https://makersuite.google.com/app/apikey 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. **API Key** 복사

### .env.local에 추가:
```
NEXT_PUBLIC_GEMINI_API_KEY=발급받은_API_Key
```

---

## 🚀 설정 완료 후

### 1. `.env.local` 파일 확인
프로젝트 루트에 `.env.local` 파일이 있는지 확인하고, 위에서 발급받은 키들을 모두 입력합니다.

### 2. 개발 서버 재시작
```bash
npm run dev
```

### 3. 테스트
- **ARTICLE 페이지**: 검색 기능 테스트
- **PLANNER 페이지**: 전시회 정보 확인
- **VV 페이지**: AI 챗봇 대화 테스트

---

## ⚠️ 중요 사항

1. **API 키는 절대 GitHub에 커밋하지 마세요!**
   - `.env.local` 파일은 `.gitignore`에 자동으로 포함되어 있습니다.

2. **무료 API 사용량 제한**
   - 네이버: 25,000 requests/day
   - News API: 100 requests/day (개발 환경)
   - Gemini: 60 requests/minute
   - 공공데이터: 1,000 requests/day

3. **대체 방안 (API 키 없이 사용)**
   - RSS 피드는 API 키 없이 작동합니다.
   - 현재 Article 페이지는 RSS 피드를 기본으로 사용합니다.

---

## 📞 문제 해결

### API가 작동하지 않을 때:
1. `.env.local` 파일의 키가 정확한지 확인
2. 개발 서버를 재시작했는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. API 키의 사용량 제한을 초과하지 않았는지 확인

### 승인 대기 중일 때:
- 공공데이터포털 API는 승인이 필요하므로, 그동안 RSS 피드를 사용하세요.
- RSS 피드는 별도 설정 없이 바로 작동합니다.
