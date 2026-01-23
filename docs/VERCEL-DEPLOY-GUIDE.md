# 🚀 Vercel 배포 가이드

## 📋 **배포 전 체크리스트**

### ✅ 완료됨:
- [x] 로컬 빌드 성공 (`npm run build`)
- [x] TypeScript 에러 수정
- [x] GitHub에 모든 변경사항 푸시

---

## 🌐 **Vercel 배포 단계**

### STEP 1: Vercel 웹사이트 접속

1. **https://vercel.com** 방문
2. **GitHub 계정으로 로그인**
   - "Continue with GitHub" 클릭
   - 권한 승인

---

### STEP 2: 새 프로젝트 만들기

1. **"Add New..."** 버튼 클릭
2. **"Project"** 선택
3. **GitHub 저장소 선택**
   - `wrtn-edu-swu-bootcamp/project_23` 찾기
   - **"Import"** 클릭

---

### STEP 3: 프로젝트 설정

#### Build & Development Settings:
- **Framework Preset**: Next.js (자동 감지됨)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### Root Directory:
- **루트 디렉토리**: `.` (변경 불필요)

---

### STEP 4: 환경 변수 설정 ⚠️ **중요!**

**"Environment Variables"** 섹션에서 다음을 추가하세요:

```bash
# OpenAI API (번역 및 AI 검색)
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Gemini API (옵션 - AI 기능용)
GEMINI_API_KEY=your-gemini-key-here

# Supabase (옵션 - 데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# n8n Webhook (옵션 - 외부 n8n 사용 시)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
N8N_ARTICLE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/arthub
```

#### 주의사항:
- **최소 요구사항**: `OPENAI_API_KEY` (번역 기능용)
- 나머지는 **선택사항**
- 환경 변수는 **나중에도 추가 가능**

---

### STEP 5: 배포 시작!

1. **"Deploy"** 버튼 클릭
2. **배포 진행 상황 확인** (약 2-3분 소요)
3. **배포 완료 확인**
   - ✅ "Building" → "Completed"
   - 🎉 "Congratulations! Your project has been deployed"

---

## 🔗 **배포 후 확인사항**

### 1. 사이트 URL 확인
- Vercel이 자동으로 URL 생성
- 예: `https://project-23-xxxxx.vercel.app`

### 2. 기능 테스트
- **FOLIO 탭**: 이미지 업로드 및 저장
- **NOTE 탭**: 마크다운 편집 및 저장
- **ARTICLE 탭**: RSS 피드 로딩 확인

### 3. 에러 확인
- Vercel Dashboard → **"Logs"** 탭
- 런타임 에러 확인

---

## 🔧 **배포 후 문제 해결**

### 문제 1: "500 Internal Server Error"
**원인**: 환경 변수 누락

**해결**:
1. Vercel Dashboard → **"Settings"** → **"Environment Variables"**
2. `OPENAI_API_KEY` 추가
3. **"Redeploy"** 클릭

---

### 문제 2: "API Route Error"
**원인**: API 라우트에서 환경 변수 접근 실패

**해결**:
1. `.env.example` 파일 확인
2. 모든 필수 환경 변수 설정
3. **"Redeploy"** 클릭

---

### 문제 3: "Build Failed"
**원인**: TypeScript 또는 lint 에러

**해결**:
1. 로컬에서 `npm run build` 실행
2. 에러 수정
3. GitHub에 푸시
4. Vercel이 **자동 재배포**

---

## 📊 **환경 변수별 기능**

| 환경 변수 | 필수? | 기능 |
|----------|------|------|
| `OPENAI_API_KEY` | ✅ 필수 | 영문 기사 번역 + AI 검색 |
| `GEMINI_API_KEY` | ❌ 옵션 | n8n 워크플로우용 AI |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ 옵션 | 데이터베이스 연동 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ 옵션 | 데이터베이스 인증 |
| `N8N_WEBHOOK_URL` | ❌ 옵션 | n8n RSS 워크플로우 |
| `N8N_ARTICLE_WEBHOOK_URL` | ❌ 옵션 | n8n 아트허브 워크플로우 |

---

## 🎯 **최소 배포 (OpenAI만 사용)**

```bash
# 이것만 있으면 기본 기능 동작!
OPENAI_API_KEY=sk-proj-your-key-here
```

**동작하는 기능**:
- ✅ FOLIO 탭 (로컬 스토리지)
- ✅ NOTE 탭 (로컬 스토리지)
- ✅ ARTICLE 탭 (RSS 피드 직접 파싱)
- ✅ 번역 기능 (OpenAI)
- ✅ AI 검색 (OpenAI)

**동작 안하는 기능**:
- ❌ n8n 워크플로우 (환경 변수 설정 시 사용 가능)
- ❌ Supabase 데이터베이스 (로컬 스토리지로 대체)

---

## 🔄 **자동 배포 설정됨!**

### GitHub에 푸시하면 자동으로:
1. Vercel이 **새 커밋 감지**
2. **자동으로 빌드 시작**
3. **빌드 성공 시 자동 배포**
4. **실패 시 이메일 알림**

---

## 📱 **커스텀 도메인 연결 (옵션)**

1. Vercel Dashboard → **"Settings"** → **"Domains"**
2. 본인 도메인 입력
3. DNS 레코드 설정 (Vercel이 안내)
4. 완료!

---

## 🆘 **도움이 필요하면?**

1. **Vercel Logs 확인**: 
   - Dashboard → **"Deployments"** → 실패한 배포 클릭 → **"Build Logs"**

2. **GitHub Issues 확인**:
   - https://github.com/wrtn-edu-swu-bootcamp/project_23/issues

3. **로컬 테스트**:
   ```bash
   npm run build
   npm start
   ```

---

## ✅ **완료 체크리스트**

- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] project_23 저장소 import
- [ ] 환경 변수 설정 (`OPENAI_API_KEY` 최소)
- [ ] 첫 배포 성공
- [ ] 사이트 URL 접속 확인
- [ ] 기본 기능 테스트 (FOLIO, NOTE, ARTICLE)
- [ ] 번역 기능 테스트
- [ ] (옵션) 커스텀 도메인 연결

---

## 🎉 **성공!**

축하합니다! 이제 당신의 NAVA 앱이 전 세계에 공개되었습니다! 🌍

**배포된 사이트**: [여기에 Vercel URL 붙여넣기]

---

## 📝 **다음 단계**

1. **n8n 워크플로우 설정** (선택)
   - `docs/ARTHUB-BEGINNER-GUIDE.md` 참고
   - n8n 인스턴스 구축 후 `N8N_ARTICLE_WEBHOOK_URL` 환경 변수 추가

2. **Supabase 데이터베이스 연동** (선택)
   - 로컬 스토리지를 클라우드 DB로 전환

3. **성능 최적화**
   - Vercel Analytics 활성화
   - 이미지 최적화

4. **SEO 개선**
   - `metadata` 추가
   - sitemap.xml 생성
