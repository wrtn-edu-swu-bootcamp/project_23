# 🎨 NAVA: 프로젝트 개발 마스터 플랜

## 1. 프로젝트 개요

- **서비스명**: NAVA
- **컨셉**: 예술가를 위한 모바일 최적화 웹 브라우저 기반 아카이브 & 전문 도슨트 서비스
- **디자인 테마**: 미니멀리즘 다크 모드 (딥 퍼플/블랙 톤 #2D242D)
- **프레임**: iPhone 14 (390x844) 기준 모바일 레이아웃 최적화

## 2. 기술 스택

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend/DB**: Supabase (Database, Storage)
- **AI**: Google Gemini 1.5 Flash API (도슨트 챗봇)
- **폰트**: Pretendard (국문), Inter (영문) - Bold와 Medium 적절히 혼용

## 3. 공통 UX/UI 원칙

### 상단 헤더 배치
모바일 웹 브라우저 하단 툴바 간섭을 방지하기 위해 주요 기능 버튼(설정, 검색, 프로필)을 상단 헤더에 배치.

### 로딩 애니메이션
페이지 전환 및 데이터 저장 시 제공된 로딩화면.gif를 활용한 커스텀 로딩 화면 구현.

### 스크롤 최적화
부드러운 스크롤을 적용하되, 디자인 일관성을 위해 스크롤바는 숨김 처리.

### 인앱 웹뷰
외부 링크 클릭 시 앱 내 모달/웹뷰 형태로 열어 사용자 이탈 방지.

## 4. 탭별 상세 시나리오

### 탭 1: FOLIO (연대기 아카이브)

**레퍼런스**: 인스타그램 그리드 및 lisa m(nezu.world) 스타일

**구성**: 3열 무한 스크롤 그리드

**특징**: Sticky Header를 이용한 연도/월 구분선을 통해 작품이 연대기적으로 '축적'되는 시각적 경험 제공

#### 주요 기능
- 3열 그리드 레이아웃
- 무한 스크롤
- 연도/월별 Sticky Header
- 이미지 최적화 및 레이지 로딩

---

### 탭 2: NOTE (블로그형 기록)

**레퍼런스**: 네이버 블로그 및 구글 Blogger UX

**시나리오**:
- **작성**: 제목/본문이 구분된 에디터
- **조회**: 매거진 스타일 레이아웃 및 '위시(즐겨찾기)' 하트 버튼
- **기능**: 제목 및 본문 통합 실시간 키워드 검색 지원

#### 주요 기능
- 리치 텍스트 에디터
- 이미지 업로드 및 첨부
- 위시(즐겨찾기) 기능
- 실시간 검색 (제목 + 본문)
- 매거진 스타일 레이아웃

---

### 탭 3: PLANNER (전시 정보)

**레퍼런스**: 아트맵(Artmap) UI/UX 벤치마킹

**구성**: 상단 지역 필터 칩 + 중앙 먼슬리 캘린더 + 하단 포스터 카드 리스트

#### 주요 기능
- 지역별 필터 칩
- 월별 캘린더 뷰
- 전시 포스터 카드 리스트
- 전시 상세 정보 모달
- 캘린더 연동 (구글 캘린더 등)

---

### 탭 4: ARTICLE (뉴스레터 매거진)

**기능**: 구글 예술 뉴스레터 및 외부 RSS 연동. '위시' 기능 포함

**디자인**: 아트맵 스타일의 대형 이미지 하이라이트 배너 적용

#### 주요 기능
- RSS 피드 연동
- 구글 예술 뉴스레터 크롤링
- 위시(즐겨찾기) 기능
- 대형 이미지 하이라이트 배너
- 카테고리별 필터링

---

### 탭 5: VV (AI 도슨트)

**페르소나**: 이름은 'VV'. 유행어와 줄임말을 이해하는 힙하고 지적인 예술가 친구

**핵심 로직**: Chat History(대화 이력) 기능을 필수 구현하여 이전 대화 맥락(예: 식사 메뉴 등)을 완벽히 기억하고 대답할 것

#### 주요 기능
- Google Gemini 1.5 Flash API 연동
- 대화 히스토리 저장 및 컨텍스트 유지
- 페르소나 기반 응답 생성
- 예술 작품/전시 정보 연동
- 음성 입력/출력 (선택사항)

#### VV 페르소나 프롬프트 설정
```
당신은 'VV'입니다. 힙하고 지적인 예술가 친구로서, 유행어와 줄임말을 자연스럽게 이해하고 사용합니다.
예술에 대한 깊은 지식을 갖고 있으면서도 친근하고 편안한 대화를 나눕니다.
사용자의 이전 대화 내용을 모두 기억하고 맥락을 고려하여 답변합니다.
```

## 5. 데이터베이스 스키마 (Supabase)

### users
- id (uuid, PK)
- email (text)
- username (text)
- profile_image_url (text)
- created_at (timestamp)

### folio_items
- id (uuid, PK)
- user_id (uuid, FK)
- image_url (text)
- title (text)
- description (text)
- created_date (date)
- created_at (timestamp)

### notes
- id (uuid, PK)
- user_id (uuid, FK)
- title (text)
- content (text)
- is_wished (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### exhibitions
- id (uuid, PK)
- title (text)
- location (text)
- region (text)
- start_date (date)
- end_date (date)
- poster_url (text)
- description (text)
- website_url (text)

### articles
- id (uuid, PK)
- title (text)
- content (text)
- source (text)
- source_url (text)
- image_url (text)
- published_at (timestamp)
- is_wished (boolean)

### chat_history
- id (uuid, PK)
- user_id (uuid, FK)
- role (text) - 'user' or 'assistant'
- content (text)
- created_at (timestamp)

## 6. 개발 단계

### Phase 1: 프로젝트 세팅
- [x] Git 저장소 설정
- [ ] Next.js 프로젝트 초기화
- [ ] Tailwind CSS 설정
- [ ] Supabase 프로젝트 생성 및 연동
- [ ] 폰트 설정 (Pretendard, Inter)
- [ ] 기본 레이아웃 및 네비게이션

### Phase 2: 공통 컴포넌트
- [ ] 헤더 컴포넌트
- [ ] 탭 네비게이션
- [ ] 로딩 애니메이션
- [ ] 모달/웹뷰 컴포넌트
- [ ] 인증 시스템

### Phase 3: 각 탭 개발
- [ ] FOLIO 탭
- [ ] NOTE 탭
- [ ] PLANNER 탭
- [ ] ARTICLE 탭
- [ ] VV 탭

### Phase 4: 통합 및 최적화
- [ ] 성능 최적화
- [ ] 반응형 디자인 검증
- [ ] 테스트
- [ ] 배포

## 7. 참고 사항

### 디자인 시스템
- **Primary Color**: #2D242D (딥 퍼플/블랙)
- **Font Bold**: 제목, 강조
- **Font Medium**: 본문, 설명
- **Mobile First**: iPhone 14 (390x844) 기준

### 성능 최적화
- 이미지 레이지 로딩
- 무한 스크롤 페이지네이션
- Next.js Image 최적화
- Supabase Storage CDN 활용

### 보안
- Supabase RLS (Row Level Security) 설정
- API 키 환경 변수 관리
- HTTPS 적용
