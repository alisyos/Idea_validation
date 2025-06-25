# 🚀 아이디어 검증 AI

GPT-4.1과 웹 검색 기능을 활용한 지능형 비즈니스 아이디어 검증 서비스입니다.

## ✨ 주요 기능

- **GPT-4.1 모델 활용**: 최신 OpenAI GPT-4.1 모델을 사용한 정확한 분석
- **웹 검색 기반 분석**: 실시간 시장 데이터와 트렌드를 활용한 검증
- **종합적인 분석**: 시장성, 차별성, 리스크, 실현 가능성을 다각도로 분석
- **모던 UI/UX**: Tailwind CSS를 활용한 반응형 디자인
- **Vercel 최적화**: 배포에 최적화된 Next.js 구조

## 📊 분석 항목

### 1. 시장성 분석
- 시장 규모 추정 (연간 매출, CAGR)
- 타깃 고객 세분화
- 해결하는 Pain Point 분석

### 2. 차별성 분석
- 고유 가치 제안 (USP)
- 경쟁사 비교 분석
- 강점 및 약점 도출

### 3. 리스크 분석
- **기술 리스크**: 데이터 편향, 인프라 장애 등
- **시장 리스크**: 수요 불확실성, 경쟁 심화 등
- **규제 리스크**: 법규, 인증 제도 등
- **재무 리스크**: 자금 부족, 현금 흐름 등

### 4. 실현 가능성
- 1-5점 척도 평가
- 기술적 난이도 및 자원 요구사항 분석
- 구체적인 실행 근거 및 제언

### 5. 권장 조치
- 우선순위별 액션 아이템 제시
- 최대 3가지 구체적인 개선 방안

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4.1 with Function Calling
- **Deployment**: Vercel

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 OpenAI API 키를 설정하세요:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
├── components/          # React 컴포넌트
│   ├── IdeaForm.tsx    # 아이디어 입력 폼
│   └── ValidationResult.tsx # 검증 결과 표시
├── pages/
│   ├── api/
│   │   └── validate-idea.ts # OpenAI API 연동
│   ├── _app.tsx        # Next.js App 컴포넌트
│   └── index.tsx       # 메인 페이지
├── styles/
│   └── globals.css     # 전역 스타일
├── types/
│   └── index.ts        # TypeScript 타입 정의
└── ...
```

## 🌐 Vercel 배포

1. Vercel 계정에 로그인
2. GitHub 레포지토리 연결
3. 환경 변수 설정 (`OPENAI_API_KEY`)
4. 자동 배포 완료

## 📝 사용 방법

1. **아이디어 입력**: 상세하고 구체적인 비즈니스 아이디어를 입력하세요
2. **AI 분석**: GPT-4.1이 웹 검색을 통해 최신 시장 정보를 수집하여 분석합니다
3. **결과 확인**: 종합적인 검증 결과를 시각적으로 확인하세요
4. **액션 아이템**: 제시된 권장 조치를 바탕으로 아이디어를 개선하세요

## ⚠️ 주의사항

- 본 서비스는 참고용으로 제공되며, 실제 비즈니스 결정 시 전문가와 상담하시기 바랍니다
- OpenAI API 사용량에 따라 비용이 발생할 수 있습니다
- 분석 결과는 AI 모델의 추론에 기반하므로 절대적인 지표가 아닙니다

## 🔧 개발 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## 📞 지원

문제가 발생하거나 개선 제안이 있으시면 이슈를 생성해주세요.

---

Made with ❤️ using GPT-4.1 and Next.js 