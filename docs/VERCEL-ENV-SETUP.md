# 🔐 Vercel 환경 변수 설정 가이드

## 빠른 시작

Vercel 배포 시 **반드시** 아래 환경 변수를 설정해야 합니다.

---

## ✅ 필수 환경 변수

### 1. Supabase (데이터베이스)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

### 2. OpenAI (AI 번역 & 검색)
```
OPENAI_API_KEY=sk-...your-openai-key
```

---

## 🔧 선택 환경 변수

### 3. Google Gemini (AI 대안)
```
NEXT_PUBLIC_GEMINI_API_KEY=AIza...your-gemini-key
```

### 4. Naver API (뉴스 검색)
```
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-client-secret
```

### 5. News API (국제 뉴스)
```
NEXT_PUBLIC_NEWS_API_KEY=your-newsapi-key
```

### 6. 공공데이터 API (전시 정보)
```
PUBLIC_DATA_API_KEY=your-public-data-key
```

### 7. n8n Webhook (AI 워크플로우)
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/arthub
N8N_ARTICLE_WEBHOOK_URL=http://localhost:5678/webhook/article-ai
```

⚠️ **주의**: n8n은 로컬 개발 전용입니다. Vercel에서는 OpenAI API를 직접 사용합니다.

---

## 📝 Vercel에서 환경 변수 추가하는 방법

### 방법 1: 배포 전 설정 (추천)

1. Vercel에서 프로젝트 import
2. **"Configure Project"** 화면에서
3. **Environment Variables** 섹션 확장
4. 각 변수 입력:
   ```
   Name: OPENAI_API_KEY
   Value: sk-...your-key
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```
5. **Deploy** 클릭

### 방법 2: 배포 후 설정

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** 탭
3. **Environment Variables** 메뉴
4. **Add** 버튼 클릭
5. 변수 입력 후 **Save**
6. **Deployments** → **Redeploy** (재배포 필요)

---

## 🎯 환경별 설정

### Production (프로덕션)
- 실제 서비스용
- 유효한 API 키 필수

### Preview (미리보기)
- Pull Request 테스트용
- Production과 동일하게 설정 권장

### Development (개발)
- 로컬 개발용
- 테스트 API 키 사용 가능

---

## 🔒 보안 주의사항

### ✅ DO (해야 할 것)
- Vercel 대시보드에서만 환경 변수 관리
- 팀원과 안전하게 공유 (1Password, Notion 등)
- 정기적으로 API 키 갱신

### ❌ DON'T (하지 말 것)
- `.env.local` 파일을 Git에 커밋
- 환경 변수를 코드에 하드코딩
- 공개 채널에 API 키 공유

---

## 🧪 환경 변수 테스트

배포 후 각 기능을 테스트하세요:

```
✅ FOLIO 탭 - 이미지 업로드 (Supabase)
✅ NOTE 탭 - 노트 저장 (Supabase)
✅ ARTICLE 탭 - RSS 피드 로딩
✅ AI 번역 - 영문 기사 번역 (OpenAI)
✅ AI 검색 - 키워드 검색 (OpenAI)
```

---

## 📞 API 키 발급 방법

### OpenAI API
1. [platform.openai.com](https://platform.openai.com/signup) 가입
2. **API Keys** 메뉴
3. **Create new secret key**
4. 키 복사 (다시 볼 수 없음!)

### Supabase
1. [supabase.com](https://supabase.com) 가입
2. 새 프로젝트 생성
3. **Settings** → **API**
4. `URL`과 `anon` 키 복사

### Google Gemini
1. [ai.google.dev](https://ai.google.dev) 접속
2. **Get API Key** 클릭
3. 키 생성 및 복사

---

## 🚨 문제 해결

### "Environment variable not found"
- Vercel 대시보드에서 변수가 추가되었는지 확인
- 변수 이름 오타 확인
- 재배포 실행

### "Invalid API key"
- API 키가 유효한지 확인
- 만료되지 않았는지 확인
- 사용량 제한 초과 여부 확인

### "CORS error"
- API 키가 서버 사이드에서만 사용되는지 확인
- `NEXT_PUBLIC_` 접두사 확인 (클라이언트용)

---

## 📋 체크리스트

배포 전:
- [ ] 필수 환경 변수 3개 준비 완료
- [ ] API 키 유효성 확인
- [ ] `.env.local`이 `.gitignore`에 포함

Vercel 설정:
- [ ] Production 환경 변수 추가
- [ ] Preview 환경 변수 추가 (선택)
- [ ] Development 환경 변수 추가 (선택)

배포 후:
- [ ] 각 기능 테스트 완료
- [ ] 에러 로그 확인
- [ ] API 사용량 모니터링

---

## 💡 꿀팁

### 환경 변수 일괄 복사
```bash
# .env.local 내용을 복사해서
# Vercel에 붙여넣기 (Bulk Add)

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

### 로컬과 동일하게 유지
```bash
# Vercel CLI로 환경 변수 다운로드
vercel env pull .env.local
```

---

**준비 완료되었나요? 이제 Vercel에 배포하세요!** 🚀

자세한 배포 가이드: [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)
