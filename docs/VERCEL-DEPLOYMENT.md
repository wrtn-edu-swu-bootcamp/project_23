# 🚀 Vercel 배포 가이드

## 📝 배포 준비

### 1. GitHub 저장소 확인
- ✅ 저장소: `https://github.com/wrtn-edu-swu-bootcamp/project_23`
- ✅ 브랜치: `main`
- ✅ 최신 코드 push 완료

---

## 🌐 Vercel 배포 방법

### 방법 1: Vercel 웹사이트에서 배포 (추천) 👍

#### STEP 1: Vercel 로그인
1. [vercel.com](https://vercel.com) 접속
2. **"Continue with GitHub"** 클릭
3. GitHub 계정으로 로그인

#### STEP 2: 새 프로젝트 생성
1. **"Add New..." → "Project"** 클릭
2. **"Import Git Repository"** 선택
3. GitHub 저장소 검색: `wrtn-edu-swu-bootcamp/project_23`
4. **"Import"** 클릭

#### STEP 3: 프로젝트 설정
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### STEP 4: 환경 변수 설정 ⚠️ **중요!**

**Required (필수):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

**Optional (선택):**
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
PUBLIC_DATA_API_KEY=your_public_data_api_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

#### STEP 5: 배포
- **"Deploy"** 버튼 클릭
- 3-5분 대기 ☕
- 배포 완료! 🎉

---

### 방법 2: Vercel CLI로 배포

#### STEP 1: Vercel CLI 설치
```bash
npm install -g vercel
```

#### STEP 2: 로그인
```bash
vercel login
```

#### STEP 3: 배포
```bash
# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

#### STEP 4: 환경 변수 추가
```bash
# 대화형으로 환경 변수 추가
vercel env add OPENAI_API_KEY
```

또는 웹 대시보드에서 추가:
1. `https://vercel.com/dashboard` 접속
2. 프로젝트 선택
3. **Settings → Environment Variables** 이동
4. 환경 변수 추가

---

## 🔐 환경 변수 보안

### 주의사항
- ⚠️ **절대 `.env.local` 파일을 Git에 커밋하지 마세요!**
- ✅ `.gitignore`에 `.env*.local`이 포함되어 있는지 확인
- ✅ Vercel 대시보드에서만 환경 변수 관리

### Vercel에서 환경 변수 추가 방법
1. Project Settings → Environment Variables
2. **Name**, **Value** 입력
3. **Production**, **Preview**, **Development** 환경 선택
4. **Save** 클릭

---

## 🌍 배포 후 확인사항

### 1. 배포 URL 확인
```
Production: https://project-23-xyz.vercel.app
```

### 2. 기능 테스트
- ✅ FOLIO: 이미지 업로드 및 저장
- ✅ NOTE: 노트 작성 및 검색
- ✅ ARTICLE: RSS 피드 로딩
- ✅ AI 번역: OpenAI API 연동 확인
- ✅ AI 검색: 키워드 검색 기능 확인

### 3. 에러 확인
- Vercel 대시보드 → Project → Deployments → Logs
- 런타임 에러 확인: Functions → Logs

---

## 🔄 자동 배포 설정

### GitHub 연동 (기본 활성화)
- `main` 브랜치에 push할 때마다 자동 배포
- Pull Request 생성 시 Preview 배포 생성

### 배포 트리거 설정
1. Project Settings → Git
2. **Production Branch**: `main`
3. **Auto Deploy**: ✅ 활성화

---

## 🐛 배포 문제 해결

### 1. 빌드 에러
```
Error: Cannot find module 'xyz'
```
**해결**: `package.json`에 필요한 패키지 확인 및 추가

### 2. 환경 변수 에러
```
Error: OPENAI_API_KEY is not defined
```
**해결**: Vercel 대시보드에서 환경 변수 추가 후 재배포

### 3. 이미지 최적화 에러
```
Error: Image optimization requires a valid API key
```
**해결**: `next.config.js`에서 이미지 최적화 설정 확인

### 4. 함수 타임아웃
```
Error: Function execution timed out
```
**해결**: 
- Vercel Pro 플랜 업그레이드 (60초 제한)
- 또는 코드 최적화

---

## 📊 Vercel 대시보드 활용

### Analytics
- **Web Vitals**: 성능 지표 확인
- **Visitors**: 방문자 통계
- **Top Pages**: 인기 페이지 분석

### Logs
- **Function Logs**: API 실행 로그
- **Build Logs**: 빌드 과정 로그
- **Runtime Logs**: 런타임 에러 로그

### Domains
- 커스텀 도메인 연결
- SSL 자동 설정

---

## 🎯 배포 최적화 팁

### 1. 빌드 캐싱
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### 2. Edge Functions 활용
- API 응답 속도 개선
- 지역별 캐싱

### 3. Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
}
```

---

## 📞 지원

### Vercel 문서
- [Next.js 배포 가이드](https://vercel.com/docs/frameworks/nextjs)
- [환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [커스텀 도메인](https://vercel.com/docs/concepts/projects/custom-domains)

### 프로젝트 문서
- [API 설정](./API-SETUP.md)
- [OpenAI 설정](./OPENAI-SETUP.md)
- [n8n 워크플로우](./N8N-AI-SETUP.md)

---

## ✅ 배포 체크리스트

배포 전 확인:

- [ ] `.gitignore`에 `.env*.local` 포함
- [ ] `package.json` 의존성 확인
- [ ] GitHub 저장소 최신 상태
- [ ] 로컬에서 `npm run build` 성공
- [ ] 환경 변수 목록 준비

Vercel 설정:

- [ ] GitHub 연동 완료
- [ ] 필수 환경 변수 추가
- [ ] 선택 환경 변수 추가 (필요 시)
- [ ] 배포 성공 확인

배포 후 테스트:

- [ ] 메인 페이지 로딩
- [ ] 각 탭 기능 동작
- [ ] API 호출 성공
- [ ] 이미지 로딩 확인
- [ ] 모바일 반응형 확인

---

## 🎉 배포 완료!

프로덕션 URL: `https://your-project.vercel.app`

축하합니다! 이제 전 세계 어디서나 앱에 접속할 수 있습니다! 🌍
