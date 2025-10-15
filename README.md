# Tech for Impact 이음길 Front Repository

## 실행 방법

````bash
pnpm i        # 패키지 설치
pnpm dev      # 로컬 개발 서버 실행 (http://localhost:5173)
pnpm build    # 프로덕션 빌드\```
````

## 주요 라이브러리

- **React 19** — UI 구성
- **Vite 7** — 번들러 및 개발 서버
- **TypeScript 5.9** — 정적 타입 시스템
- **Emotion (@emotion/react, @emotion/styled)** — 스타일링
- **React Query (@tanstack/react-query)** — 서버 상태 관리
- **Zustand** — 클라이언트 상태 관리
- **Axios** — HTTP 통신
- **React Router 7** — 라우팅
- **vite-plugin-svgr** — SVG → React 컴포넌트 변환

## Project Structure (FSD)

페이지가 아니라 **기능 단위(Feature)**로 조직. 공용 모듈은 shared로, 앱 전역 설정은 app에 둠.

```
src/
├── app/                    # 앱 전역 레벨(Provider, Router, Theme, GlobalStyle)
│   ├── providers/          # ReactQuery, Router, Theme 등 전역 Provider
│   ├── routes/             # 라우팅 구성
│   ├── styles/             # 글로벌 스타일, reset, theme tokens
│   └── app.tsx             #
│
├── pages/                  # 라우트 엔트리(페이지 단위)
│   └── dashboard/               # 예) /dashboard
│       ├── ui              # 페이지 컴포넌트 모음
│       └── features        # 페이지 내 기능 모음
│
├── shared/                 # 재사용 가능한 cross-cutting 리소스
│   ├── api/                # axios 인스턴스, API 클라이언트
│   ├── components/         # 범용 UI 컴포넌트(Button, Header, Input 등)
│   ├── hooks/              # 범용 hooks(useToggle, useDebounce 등)
│   ├── lib/                # 유틸/헬퍼(date, strings, storage 등)
│   ├── store/              # 전역/크로스 도메인 zustand store
│   ├── types/              # 공용 타입 정의
│   └── assets/             # 정적 리소스(svg, images)
│
└── main.tsx                # 앱 부트스트랩(Provider 묶음, Router 마운트)

```

## 코드 스타일 및 Git Hooks

- **Prettier**: 코드 포맷統일 (`.prettierrc`)
- **Husky + lint-staged**: 커밋 시 변경된 파일만 자동 포맷

```bash
pnpm format        # 전체 포맷 적용
pnpm format:check  # 포맷 검증
```
