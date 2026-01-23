# 🎓 아트허브 n8n 워크플로우 - 초보자 완벽 가이드

> **목표**: 아트허브의 전시, 큐레이션, 아트잡, 평론 정보를 AI로 분석하여 제공하는 서비스 만들기

---

## 📚 목차
1. [준비물](#1-준비물)
2. [n8n에 워크플로우 임포트하기](#2-n8n에-워크플로우-임포트하기)
3. [Gemini AI 설정하기](#3-gemini-ai-설정하기)
4. [워크플로우 테스트하기](#4-워크플로우-테스트하기)
5. [프론트엔드 연결하기](#5-프론트엔드-연결하기)
6. [문제 해결](#6-문제-해결)

---

## 1. 준비물

### ✅ 필요한 것들
- [x] n8n 설치 완료 (이미 완료!)
- [x] n8n 실행 중 (`http://localhost:5678`)
- [ ] **Google Gemini API Key** (아래에서 발급)

### 🔑 Gemini API Key 발급 받기

1. **Google AI Studio 접속**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **"Create API Key" 버튼 클릭**

3. **프로젝트 선택** (또는 새로 만들기)

4. **API Key 복사** (나중에 사용!)
   ```
   예시: AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 2. n8n에 워크플로우 임포트하기

### STEP 1: n8n 열기
```
브라우저에서: http://localhost:5678
```

### STEP 2: 워크플로우 임포트
1. **왼쪽 상단 "+" 버튼** 클릭
2. **"Import from File"** 선택
3. 파일 선택:
   ```
   C:\Users\jsech\OneDrive\바탕 화면\new\docs\n8n-arthub-workflow.json
   ```
4. **"Import"** 버튼 클릭

### STEP 3: 화면 확인
다음과 같은 노드들이 보여야 합니다:
```
1️⃣ Webhook 시작
  ↓
2️⃣ 카테고리 URL 설정
  ↓
3️⃣ 웹페이지 가져오기
  ↓
4️⃣ 콘텐츠 추출
  ↓
5️⃣ AI 분석 (Gemini)  ← 🔴 여기에 빨간 점이 있을 수 있음 (정상!)
  ↓
6️⃣ AI 응답 파싱
  ↓
7️⃣ 최종 응답 포맷
  ↓
8️⃣ 응답 반환
```

---

## 3. Gemini AI 설정하기

### STEP 1: Credential 생성

1. **n8n 우측 상단** → **톱니바퀴 아이콘 (Settings)** 클릭
2. **"Credentials"** 탭 클릭
3. **"New Credential"** 버튼 클릭
4. 검색창에 **"gemini"** 입력
5. **"Google Gemini API"** 선택

### STEP 2: API Key 입력

```
┌─────────────────────────────────────┐
│ Google Gemini API                   │
├─────────────────────────────────────┤
│                                     │
│ Name: My Gemini Key                 │  ← 원하는 이름 입력
│                                     │
│ API Key: AIzaSyC-xxxxx...           │  ← 복사한 API Key 붙여넣기
│                                     │
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

6. **"Save"** 버튼 클릭
7. ✅ Credential 저장 완료!

### STEP 3: AI Agent 노드에 Credential 연결

1. 워크플로우로 돌아가기
2. **"5️⃣ AI 분석 (Gemini)"** 노드 클릭
3. 노드 설정창이 오른쪽에 나타남
4. **"Chat Model"** 섹션 찾기
5. **"Add Chat Model"** 클릭
6. **"Google Gemini Chat Model"** 선택

```
┌─────────────────────────────────────┐
│ Google Gemini Chat Model            │
├─────────────────────────────────────┤
│                                     │
│ Credential: [My Gemini Key ▼]      │  ← 방금 만든 Credential 선택
│                                     │
│ Model Name: gemini-pro              │  ← 그대로 두기
│                                     │
└─────────────────────────────────────┘
```

7. 설정창 닫기 (X 버튼)

### STEP 4: 워크플로우 저장

1. **우측 상단 "Save"** 버튼 클릭
2. 이름 입력: `아트허브 통합 서비스`
3. **"Save"** 확인

### STEP 5: 워크플로우 활성화

1. **우측 상단 토글 버튼** (Inactive → Active)
2. ✅ 활성화 완료!

---

## 4. 워크플로우 테스트하기

### STEP 1: Webhook URL 확인

1. **"1️⃣ Webhook 시작"** 노드 클릭
2. **"Production URL"** 복사
   ```
   예시: http://localhost:5678/webhook/arthub
   ```

### STEP 2: PowerShell에서 테스트

```powershell
# 테스트 요청 보내기
$body = @{
    category = "archive-ongoing"
    limit = 5
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5678/webhook/arthub" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# 결과 확인
$response | ConvertTo-Json -Depth 10
```

### STEP 3: 결과 확인

성공하면 다음과 같은 응답이 나옵니다:
```json
{
  "success": true,
  "source": "arthub",
  "category": "archive-ongoing",
  "categoryName": "진행중인 전시",
  "items": [
    {
      "id": "arthub-archive-ongoing-0",
      "title": "개선된 제목",
      "summary": "AI가 생성한 3줄 요약",
      "keywords": ["키워드1", "키워드2", "키워드3"],
      "contentType": "전시",
      "url": "https://www.arthub.co.kr/detail/0",
      ...
    }
  ],
  "stats": {
    "total": 5,
    "aiProcessed": 5
  }
}
```

### STEP 4: 다른 카테고리 테스트

```powershell
# 칼럼 테스트
$body = @{ category = "curation-column"; limit = 3 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5678/webhook/arthub" -Method POST -ContentType "application/json" -Body $body

# 아트잡 테스트
$body = @{ category = "artjob"; limit = 3 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5678/webhook/arthub" -Method POST -ContentType "application/json" -Body $body
```

---

## 5. 프론트엔드 연결하기

### STEP 1: API Route 생성

파일 생성: `app/api/arthub/route.ts`

```typescript
import { NextResponse } from 'next/server'

const N8N_ARTHUB_WEBHOOK = process.env.N8N_ARTHUB_WEBHOOK_URL || 'http://localhost:5678/webhook/arthub'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, limit = 10 } = body

    const response = await fetch(N8N_ARTHUB_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, limit })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Arthub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch arthub data' },
      { status: 500 }
    )
  }
}
```

### STEP 2: 환경 변수 추가

`.env.local` 파일에 추가:
```bash
N8N_ARTHUB_WEBHOOK_URL=http://localhost:5678/webhook/arthub
```

### STEP 3: API 함수 추가

`lib/api.ts`에 추가:
```typescript
export async function fetchArthubContent(category: string, limit: number = 10) {
  try {
    const response = await fetch('/api/arthub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, limit })
    })
    
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Arthub fetch error:', error)
    return null
  }
}
```

---

## 6. 문제 해결

### ❓ Credential 연결이 안 돼요!

**증상**: AI Agent 노드에 빨간 점이 계속 있음

**해결**:
1. AI Agent 노드 클릭
2. Chat Model 섹션에서 **"Edit Chat Model"** 클릭
3. Credential 다시 선택
4. 저장

### ❓ 워크플로우가 실행 안 돼요!

**확인사항**:
1. ✅ 워크플로우가 **Active** 상태인가?
2. ✅ Webhook URL이 맞나?
3. ✅ n8n이 실행 중인가?

**n8n 재시작**:
```powershell
# 기존 n8n 종료
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process

# n8n 재시작
n8n
```

### ❓ AI 응답이 이상해요!

**System Message 수정**:
1. "5️⃣ AI 분석 (Gemini)" 노드 클릭
2. **"System Message"** 섹션 찾기
3. 프롬프트 수정
4. 저장 후 다시 테스트

### ❓ 실제 웹사이트 데이터가 필요해요!

**HTML 파싱 구현**:

"4️⃣ 콘텐츠 추출" 노드의 코드를 실제 HTML 파싱 코드로 교체:

```javascript
const html = $input.first().json.data || '';
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const items = [];
$('.exhibition-item').each((i, elem) => {
  if (i >= limit) return false;
  
  items.push({
    id: `arthub-${Date.now()}-${i}`,
    title: $(elem).find('.title').text().trim(),
    url: 'https://www.arthub.co.kr' + $(elem).find('a').attr('href'),
    thumbnail: $(elem).find('img').attr('src'),
    ...
  });
});

return items.map(item => ({ json: item }));
```

---

## 🎉 완료!

축하합니다! 이제 아트허브 통합 서비스가 작동합니다!

### 다음 단계:
- [ ] 실제 HTML 파싱 구현
- [ ] ArticleTab UI 개선
- [ ] 검색 기능 추가
- [ ] 다른 소스 (Artnet, The Art Newspaper) 추가

---

## 📞 도움이 필요하면?

1. **n8n 실행 로그 확인**:
   - n8n 터미널에서 에러 메시지 확인

2. **워크플로우 실행 내역**:
   - n8n 왼쪽 메뉴 → "Executions"

3. **각 노드별 데이터 확인**:
   - 노드 클릭 → "Show Execution Data"

---

**🚀 성공을 기원합니다!**
