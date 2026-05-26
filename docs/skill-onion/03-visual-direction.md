# The Skill Onion — Visual Direction

---

## 톤앤매너

- **키워드**: Dark Luxury / Tactile 3D / Cinematic
- **설명**: 배경은 깊은 다크, 오브젝트(양파)만 빛을 받는다. 인터랙션의 쾌감이 시각 피드백의 핵심 — 3D 오브젝트의 볼륨감과 껍질이 날아가는 시네마틱한 연출로 강한 첫인상을 만든다.

---

## 컬러 방향

> 이 섹션은 기본 테마(라이트 모드)와 독립된 **다크 모드 아일랜드**로 동작한다.
> 아래 색상은 전역 테마 변경이 아닌, `OnionHeroSection` 내부의 로컬 `sx` 오버라이드로 적용한다.

### 배경 & 서피스

| 용도 | 값 | 적용 방식 | 근거 |
|------|----|----------|------|
| 섹션 배경 | `#080808` | 로컬 sx | 순수 검정보다 따뜻한 다크. 레퍼런스 3장 모두 이 계열 |
| 카드 / 패널 서피스 | `rgba(255,255,255,0.04)` | 로컬 sx | 배경 대비 미세한 레이어 구분, 과도하지 않게 |
| 구분선 / 보더 | `rgba(255,255,255,0.1)` | 로컬 sx | 절제된 선 처리 |

### 텍스트 (다크 배경 위)

| 용도 | 값 | 근거 |
|------|----|------|
| 1차 텍스트 (H1, 카테고리명) | `#FFFFFF` | 최대 대비, 핵심 정보 강조 |
| 2차 텍스트 (Subtext, 키워드 칩) | `rgba(255,255,255,0.7)` | 위계 분리 |
| 3차 텍스트 (Kicker, 진행 카운터) | `rgba(255,255,255,0.4)` | 보조 정보, 눈에 띄지 않게 |

### 양파 레이어 컬러 (기존 `skillLayers.js` 확정값)

| 레이어 | 카테고리 | 메인 컬러 | 이미시브 컬러 |
|--------|---------|---------|------------|
| 1 (최외곽) | UI / UX Design | `#3D1A08` | `#7A3010` |
| 2 | Visual Design | `#6B2D0F` | `#A0441A` |
| 3 | Design System | `#8B4A1A` | `#C06828` |
| 4 | Frontend | `#7A5C1A` | `#B08020` |
| 5 | Motion & Interaction | `#5C6B1A` | `#8A9A28` |
| 6 | Research & Strategy | `#3D6B2A` | `#5A9A3A` |
| 7 | Collaboration | `#2A6B3D` | `#3A9A5A` |
| 8 (최내부) | Core Identity | `#D8EAA0` | `#B8D460` |

### 포인트 컬러 (CTA / 완료 상태 강조)

| 용도 | 값 | 근거 |
|------|----|------|
| View Work 버튼 (outlined) | border `rgba(255,255,255,0.5)`, text `#FFFFFF` | 절제된 화이트 아웃라인 |
| Get in Touch 버튼 (filled) | `#FFFFFF`, text `#080808` | 반전 CTA로 시선 집중 |
| 완료 글로우 / 코어 pulse | `rgba(216,234,160,0.3)` | 최내부 레이어 컬러의 확산 |

---

## 타이포그래피 방향

> 현재 테마 헤딩 폰트: **Outfit** (geometric sans-serif) — 전역 설정 유지, 추가 폰트 없음.

### 글로벌 테마 변경 없이 섹션 로컬로 처리

| 요소 | 현재 테마 설정 | The Skill Onion 적용값 | 적용 방식 |
|------|--------------|----------------------|---------|
| **Kicker** | `overline` (0.75rem, uppercase, tracking 0.08em) | 동일 사용, color `rgba(255,255,255,0.4)` | 테마 variant 재사용 |
| **H1** | Outfit 900, 2.5rem, tracking -0.02em | Outfit 900, `clamp(2.8rem, 5vw, 5rem)`, color `#FFFFFF` | 섹션 내 sx (fontSize만 오버라이드) |
| **Subtext** | `body1` 1rem, lineHeight 1.6 | 동일 사용, color `rgba(255,255,255,0.7)`, max-width 440px | 테마 variant 재사용 |
| **카테고리명** | `h5` Outfit 700, 1.25rem | 동일 사용, color `#FFFFFF` | 테마 variant 재사용 |
| **키워드 칩** | `body2` 0.875rem | monospace 12px, weight 500 | 로컬 sx (monospace 강조) |
| **진행 카운터** | `caption` 0.75rem | 동일, monospace, color `rgba(255,255,255,0.4)` | 로컬 sx |

---

## 간격 및 레이아웃

- **spacing 기본 단위**: 테마 기본 8px 유지
- **섹션 최소 높이**: `100svh` (모바일 주소창 고려)
- **콘텐츠 패딩**: 데스크톱 `px: 6~8 (48~64px)`, 모바일 `px: 3 (24px)`

### 데스크톱 레이아웃 (md 이상, 900px+)

```
┌─────────────────────────────────────────────────┐
│ [사운드 토글]                          [우상단]  │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │                  │  │ Kicker               │  │
│  │  OnionVisuali-   │  │ H1 (대형 serif)      │  │
│  │  zation          │  │ Subtext              │  │
│  │  (55% 너비)      │  │                      │  │
│  │                  │  │ ── 첫 껍질 후 ──     │  │
│  │                  │  │ SkillRevealPanel     │  │
│  └──────────────────┘  └──────────────────────┘  │
│  LayerProgressBar                                 │
│  (양파 하단 중앙 정렬)                            │
└─────────────────────────────────────────────────┘
```

- 좌(양파) : 우(텍스트) = **55% : 45%**
- 양파 캔버스 최대 높이: `480px`, 너비 100% of 컬럼
- SkillRevealPanel은 초기 숨김 → 첫 peel 이후 FadeTransition으로 등장

### 모바일 레이아웃 (sm 미만, 600px-)

```
┌─────────────────────────┐
│ [사운드 토글]   [우상단] │
│                          │
│   OnionVisualization     │
│   (화면 너비 100%)       │
│   height: 320px          │
│                          │
│   LayerProgressBar       │
│                          │
│   SkillRevealPanel       │
│   (수직 스택)            │
└─────────────────────────┘
```

### 반응형 브레이크포인트 전략

| 포인트 | 값 | 변화 내용 |
|--------|-----|---------|
| `xs → sm` | 0 ~ 600px | 수직 스택, 양파 height 320px, 커서 팔로워 비활성 |
| `sm → md` | 600 ~ 900px | 수직 스택 유지, 양파 height 400px |
| `md+` | 900px+ | 좌우 수평 분리 레이아웃, 커서 팔로워 활성 |

---

## 3D 오브젝트 비주얼 가이드

### 조명 설정 (현재 `OnionVisualization.jsx` 기준)

| 라이트 | 타입 | position | intensity | color | 역할 |
|--------|------|----------|-----------|-------|------|
| Ambient | `ambientLight` | — | `0.18` | 기본 | 전체 기저광 |
| Key Light | `directionalLight` | `[-3, 5, 3]` | `2.2` | `#FFF5E0` | 주 조명, 좌상단 |
| Rim Light | `directionalLight` | `[4, 2, -5]` | `0.5` | `#B0C8FF` | 우측 쿨톤 림 |
| Fill Light | `directionalLight` | `[0, -4, 2]` | `0.15` | `#FFF0D0` | 하단 fill |

- Key Light의 따뜻한 톤(`#FFF5E0`) ↔ Rim Light의 쿨톤(`#B0C8FF`) 대비가 입체감 핵심
- Rim Light는 배경과 오브젝트 경계 분리에 기여

### 양파 머티리얼 방향

- `roughness`: 외곽 레이어 `0.85~0.9` (거친 껍질 질감) → 내부로 갈수록 `0.5~0.6` (부드러운 속살)
- `metalness`: 전 레이어 `0.0~0.05` (유기물, 금속감 없음)
- `transparent: true`, 각 레이어 `opacity: 1.0` (애니메이션 중에만 감소)

---

## 레퍼런스

| # | 파일 | 참고 포인트 |
|---|------|------------|
| 1 | `src/assets/reference/Screenshot 2026-05-26 at 5.16.50 pm.png` | 딥 블랙 배경 위 단색 3D 오브젝트, 플로팅 연출, 좌우 분리 레이아웃 |
| 2 | `src/assets/reference/Screenshot 2026-05-26 at 5.18.45 pm.png` | 어두운 배경 위 3D 글로브, 림 라이트로 배경 분리, Bold sans 헤드라인 |
| 3 | `src/assets/reference/Screenshot 2026-05-26 at 5.24.32 pm.png` | Editorial serif 대형 H1, 우측 faceted 3D 큐브, 미세한 바닥 빛 줄기 |

---

## 변경 필요 토큰 요약

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 | 변경 방식 |
|-----------|--------|--------|----------|---------|
| `palette.background.default` | `#FFFFFF` | 유지 | 전역 | — |
| `palette.primary.main` | `#0000FF` | 유지 | 전역 | — |
| `typography.h1.fontFamily` | `"Outfit", ...` | 유지 | 전역 | — |
| `typography.h1.fontWeight` | `900` | 유지 | 전역 | — |
| Hero H1 fontSize | `2.5rem` | `clamp(2.8rem, 5vw, 5rem)` | `OnionHeroSection` 내 H1 한정 | 로컬 sx 오버라이드 |
| Hero 배경 | `#FFFFFF` | `#080808` | `OnionHeroSection` 섹션 배경 | 로컬 sx 오버라이드 |

> 전역 테마 파일(`src/styles/themes/default.js`) 수정 없음.
> 모든 변경은 `OnionHeroSection.jsx` 내 로컬 sx로 처리하여 기존 디자인 시스템에 영향을 주지 않는다.
