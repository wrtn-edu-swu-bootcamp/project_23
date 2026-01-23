# 🚀 Vercel에 배포하기

## 방법 1: 웹 브라우저로 배포 (가장 쉬움!) 👍

### 1단계: Vercel 웹사이트 접속
👉 **지금 바로 이 링크 클릭**: https://vercel.com/new/clone?repository-url=https://github.com/wrtn-edu-swu-bootcamp/project_23

### 2단계: GitHub로 로그인
- "Continue with GitHub" 클릭
- GitHub 계정으로 로그인

### 3단계: 저장소 import
- 자동으로 `project_23` 저장소 인식
- "Import" 버튼 클릭

### 4단계: 환경 변수 설정 ⚠️ **중요!**

**필수 환경 변수 3개를 입력하세요:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [당신의 Supabase URL]
Environments: ✅ Production, ✅ Preview

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [당신의 Supabase Anon Key]
Environments: ✅ Production, ✅ Preview

Name: OPENAI_API_KEY
Value: [당신의 OpenAI API Key]
Environments: ✅ Production, ✅ Preview
```

### 5단계: 배포!
- **"Deploy"** 버튼 클릭
- 3-5분 대기 ☕
- 완료! 🎉

---

## 방법 2: Vercel CLI로 배포

### 1단계: Vercel CLI 설치

```powershell
npm install -g vercel
```

### 2단계: 로그인

```powershell
vercel login
```

### 3단계: 프로젝트로 이동

```powershell
$desktop = [Environment]::GetFolderPath('Desktop')
cd "$desktop\new"
```

### 4단계: 배포

```powershell
# 테스트 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 5단계: 환경 변수 추가

```powershell
# Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Supabase Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# OpenAI Key
vercel env add OPENAI_API_KEY
```

각 명령 실행 후:
1. 값 입력
2. 환경 선택: **Production**, **Preview** 선택

### 6단계: 재배포

```powershell
vercel --prod
```

---

## 🎯 배포 후 확인

### 1. 배포 URL 확인
Vercel이 제공하는 URL (예: `https://project-23-xyz.vercel.app`)

### 2. 기능 테스트
- ✅ FOLIO 탭 열기
- ✅ NOTE 탭 열기
- ✅ ARTICLE 탭에서 RSS 피드 확인
- ✅ AI 번역 버튼 클릭 테스트

### 3. 문제가 있다면?
- Vercel 대시보드 → Project → Deployments → Logs 확인
- 환경 변수가 올바르게 설정되었는지 확인

---

## 📞 도움이 필요하다면?

- **Vercel 배포 가이드**: [docs/VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)
- **환경 변수 설정**: [docs/VERCEL-ENV-SETUP.md](./VERCEL-ENV-SETUP.md)

---

## ⚡ 빠른 시작 (추천!)

**가장 빠른 방법은 웹 브라우저로 배포하는 것입니다:**

1. 👉 https://vercel.com/new 접속
2. GitHub 로그인
3. `project_23` import
4. 환경 변수 3개 입력
5. Deploy 클릭!

**끝!** 🎉
