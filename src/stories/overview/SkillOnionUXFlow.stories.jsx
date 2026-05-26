import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DocumentTitle, PageContainer, SectionTitle } from '../../components/storybookDocumentation';

export default {
  title: 'Overview/The Skill Onion/02 UX Flow',
  parameters: {
    layout: 'padded',
  },
};

const scenarios = [
  {
    title: '시나리오 1: 첫 방문자 — 양파 발견',
    user: '포트폴리오를 처음 방문한 리크루터 또는 클라이언트',
    goal: '이 디자이너가 누구이고 무엇을 할 수 있는지 파악',
    flow: [
      '페이지 로드 — 3D 스타일의 레이어드 양파가 화면 중앙에 등장',
      '유저가 양파 쪽으로 커서를 이동',
      '커서가 [ PEEL ] 텍스트가 표시되는 원형 팔로워로 변환',
      '클릭 — 가장 바깥 껍질이 벗겨지는 애니메이션',
      '첫 번째 스킬 카테고리와 키워드가 fade/scramble 효과로 등장',
      '프로그레스 바 업데이트: 1 / 8 Layers Peeled',
    ],
    success: '별도의 안내 텍스트 없이 유저가 인터랙션을 즉시 이해',
    exception: '커서가 3초 이상 정지 시, 양파에 은은한 pulse 애니메이션으로 첫 클릭 유도',
  },
  {
    title: '시나리오 2: 레이어 순차 벗기기',
    user: '레이어를 하나씩 능동적으로 벗기는 방문자',
    goal: '모든 스킬 카테고리 발견',
    flow: [
      '클릭마다 껍질 벗겨짐 → 스킬 공개 → 진행 업데이트 순서로 실행',
      '각 레이어마다 새로운 카테고리명 + 키워드 목록 노출',
      '사운드가 켜진 경우 껍질 제거 시 효과음 재생',
      '프로그레스 바가 증가하며 남은 레이어 수 예측 가능',
      'isAnimating: true 락으로 애니메이션 중 더블클릭 방지',
    ],
    success: '유저가 혼란이나 불편함 없이 모든 레이어 완료',
    exception: '애니메이션 중 클릭 → 애니메이션 완료 전까지 입력 무시 또는 큐 대기',
  },
  {
    title: '시나리오 3: 코어 도달 (완료 상태)',
    user: '모든 레이어를 다 벗긴 방문자',
    goal: '최종 공개를 보고 다음 행동으로 이동',
    flow: [
      '마지막 껍질이 제거 → 양파 코어가 글로우 / 펄스 효과와 함께 노출',
      '최종 메시지 등장 (예: "You\'ve seen it all. Now let\'s build something.")',
      'CTA 버튼 2개 출현: View Work, Get in Touch',
      'CTA 아래에 작은 Reset 링크 표시',
    ],
    success: '유저가 CTA를 클릭하거나 리셋하여 재경험',
    exception: '유저가 탭을 닫는 경우 — 별도 처리 불필요',
  },
  {
    title: '시나리오 4: 리셋 및 재경험',
    user: '특정 레이어를 다시 보거나 인터랙션을 재경험하고 싶은 방문자',
    goal: '양파를 원래 상태로 되돌리고 처음부터 다시 시작',
    flow: [
      'Reset 클릭 (완료 상태에서 표시, 또는 화면 내 지속 노출 아이콘)',
      '레이어들이 역방향 애니메이션으로 재조립',
      '상태가 currentLayerIndex: 0으로 초기화',
      '인터랙션 재시작 가능',
    ],
    success: '부드러운 재조립 애니메이션, 상태 점프 없이 자연스럽게 복귀',
    exception: '벗기기 진행 중 리셋 → 현재 애니메이션 완료 후 리셋 실행',
  },
  {
    title: '시나리오 5: 모바일 탭 경험',
    user: '모바일 기기로 방문한 방문자',
    goal: '데스크톱과 동일한 껍질 벗기기 경험을 터치로 제공',
    flow: [
      '양파가 약간 작게 렌더링되어 화면 중앙에 배치',
      '커서 팔로워 없음 (데스크톱 전용) — 대신 양파 하단에 탭 힌트 레이블(Tap to peel) 표시',
      '탭으로 데스크톱과 동일한 껍질 벗겨지는 애니메이션 + 스킬 공개 시퀀스 실행',
      '프로그레스 바와 스킬 패널이 수직 스택 레이아웃으로 배치',
    ],
    success: '터치 탭이 데스크톱 클릭만큼 만족스럽게 느껴짐',
    exception: '핀치/줌 무시 — 싱글 탭만 트리거로 작동',
  },
];

const copywriting = [
  { role: 'Kicker (최상단 태그)', copy: 'The Skill Onion Project', note: '소문자 트래킹 넓게, 절제된 톤' },
  { role: 'H1 — 후보 A', copy: 'Like an Onion: Layers of Skills to Peel Back.', note: '양파 메타포 직접 명시' },
  { role: 'H1 — 후보 B', copy: 'Unpeeling my skillset', note: '동작 중심, 간결' },
  { role: 'Subtext (서브 타이틀)', copy: "I'm a UI/UX designer with depth. Scroll to peel back the layers and discover the diverse skill set I bring to the table.", note: 'H1 아래 1~2줄, 인터랙션 유도 포함' },
];

const dataModel = [
  { entity: 'Layer', fields: 'id: number, category: string, keywords: string[], colorToken: string, isRevealed: boolean', note: '레이어 1개당 객체 1개, 바깥 → 안쪽 순서' },
  { entity: 'OnionState', fields: 'currentLayerIndex: number, isComplete: boolean, isSoundEnabled: boolean, isAnimating: boolean', note: '부모 컴포넌트에서 관리하는 전역 인터랙션 상태' },
  { entity: 'ParticleConfig', fields: 'count: number, spread: number, duration: number', note: '껍질 제거 이벤트별 애니메이션 설정 — 상수로 관리' },
];

const components = [
  { name: 'FullPageContainer', role: '히어로 섹션 전체 뷰포트 래퍼', type: '재활용', path: 'components/layout/FullPageContainer.jsx' },
  { name: 'FadeTransition', role: '스킬 패널 등장 / 퇴장 전환', type: '재활용', path: 'components/motion/FadeTransition.jsx' },
  { name: 'ScrambleText', role: '키워드 텍스트 scramble 리빌 효과', type: '재활용', path: 'components/kinetic-typography/ScrambleText.jsx' },
  { name: 'MUI Switch', role: '사운드 On/Off 토글', type: '재활용', path: 'MUI 기본 컴포넌트' },
  { name: 'MUI Button', role: 'CTA 버튼 (View Work / Get in Touch)', type: '재활용', path: 'MUI 기본 컴포넌트' },
  { name: 'Indicator', role: '레이어 진행 표시 기반 컴포넌트', type: '수정', path: 'common/ui/Indicator.jsx — current / total props 및 게이지 바 variant 추가' },
  { name: 'OnionVisualization', role: 'Three.js + @react-three/fiber 기반 3D 양파 — SphereGeometry, MeshStandardMaterial (displacementMap + normalMap), 껍질 메시 분리 및 curl morph 애니메이션', type: '신규', path: '카테고리: media' },
  { name: 'CursorFollower', role: '원형 커스텀 커서 + PEEL 레이블 (데스크톱 전용)', type: '신규', path: '카테고리: motion' },
  { name: 'SkillRevealPanel', role: '껍질 제거 후 카테고리명 + 키워드 표시 패널', type: '신규', path: '카테고리: card' },
  { name: 'LayerProgressBar', role: 'N / Total Layers Peeled 게이지 바', type: '신규', path: '카테고리: data-display' },
  { name: 'OnionHeroSection', role: '루트 오케스트레이터 — 모든 서브 컴포넌트 + 상태 조합', type: '신규', path: '카테고리: templates' },
];

const typeChipColor = {
  '재활용': { color: 'success', variant: 'outlined' },
  '수정': { color: 'warning', variant: 'outlined' },
  '신규': { color: 'primary', variant: 'filled' },
};

const ia = `The Skill Onion — 히어로 섹션
├── 유틸리티 바 (우상단, 항상 표시)
│   └── 사운드 토글 (On / Off)
│
├── 양파 오브젝트 (중앙)
│   ├── 레이어 1 — 가장 바깥 껍질
│   ├── 레이어 2 ~ N
│   └── 코어 — 가장 안쪽, 마지막에 노출
│
├── 스킬 표시 패널 (양파 오른쪽 / 모바일에서는 하단)
│   ├── 카테고리명  (예: "UI / UX Design")
│   └── 키워드 목록 (예: "Figma · Wireframing · Prototyping")
│
├── 진행 인디케이터 (양파 하단)
│   └── "N / Total Layers Peeled" + 게이지 바
│
└── 완료 상태 (마지막 껍질 제거 후 스킬 패널 대체)
    ├── 최종 메시지
    ├── CTA — View Work
    ├── CTA — Get in Touch
    └── Reset 링크`;

const mermaid = `flowchart TD
    A[페이지 로드] --> B[히어로 섹션 렌더링 / 전체 레이어 적층]
    B --> C{3초 이상 idle?}
    C -->|Yes| D[양파 pulse 힌트 애니메이션]
    C -->|No| E{유저 인터랙션}
    D --> E
    E -->|데스크톱 호버| F[커서 → 원형 PEEL 팔로워로 변환]
    E -->|모바일| G[탭 힌트 레이블 표시]
    F --> H[클릭]
    G --> H[탭]
    H --> I{isAnimating?}
    I -->|Yes| J[입력 무시 / 큐 대기]
    I -->|No| K[isAnimating: true 설정]
    K --> L[최외곽 껍질 벗겨지는 애니메이션]
    L --> M[스킬 카테고리 + 키워드 fade/scramble 등장]
    M --> N[프로그레스 바 증가 N / Total Layers]
    N --> O[isAnimating: false 해제]
    O --> P{마지막 레이어?}
    P -->|No| E
    P -->|Yes| Q[코어 노출 / glow + pulse 효과]
    Q --> R[최종 메시지 등장]
    R --> S[CTA 버튼 출현 View Work · Get in Touch]
    S --> T{유저 액션}
    T -->|View Work| U[포트폴리오로 이동]
    T -->|Get in Touch| V[연락처로 이동]
    T -->|Reset| W[레이어 역방향 재조립 애니메이션]
    W --> B`;

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="UX Flow"
        status="Draft"
        note="유저 시나리오 · 플로우 다이어그램 · 컴포넌트 리스트"
        brandName="The Skill Onion"
        systemName="Project Planning"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          UX Flow
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          인터랙션 흐름, 유저 시나리오, 정보 구조, 컴포넌트 계획을 정의한다.
        </Typography>

        {/* 유저 시나리오 */}
        <SectionTitle title="유저 시나리오" />
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3, mb: 4 } }>
          { scenarios.map((s, i) => (
            <Box key={ i } sx={ { border: '1px solid', borderColor: 'divider', p: 2.5 } }>
              <Typography variant="subtitle1" sx={ { fontWeight: 700, mb: 1.5 } }>{ s.title }</Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, width: 80, verticalAlign: 'top' } }>사용자</TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ s.user }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, verticalAlign: 'top' } }>목표</TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ s.goal }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, verticalAlign: 'top' } }>플로우</TableCell>
                      <TableCell>
                        <Box component="ol" sx={ { pl: 2, m: 0, '& li': { fontSize: 13, mb: 0.5 } } }>
                          { s.flow.map((step, j) => <li key={ j }>{ step }</li>) }
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, verticalAlign: 'top' } }>성공 조건</TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ s.success }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, verticalAlign: 'top' } }>예외 상황</TableCell>
                      <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ s.exception }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )) }
        </Box>

        {/* UX 플로우 다이어그램 */}
        <SectionTitle title="UX 플로우 다이어그램" description="Mermaid flowchart — 핵심 인터랙션 분기 시각화" />
        <Box
          component="pre"
          sx={ {
            p: 2.5,
            mb: 4,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            fontSize: 12,
            fontFamily: 'monospace',
            overflowX: 'auto',
            whiteSpace: 'pre',
            lineHeight: 1.7,
          } }
        >
          { mermaid }
        </Box>

        {/* 타이포그래피 및 카피라이팅 */}
        <SectionTitle title="타이포그래피 및 카피라이팅" description="H1 후보 A / B 중 최종 선택은 Visual Direction 단계에서 결정" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 180 } }>역할</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>카피</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 220 } }>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { copywriting.map((row, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontWeight: 600, fontSize: 12 } }>{ row.role }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.copy }</TableCell>
                  <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ row.note }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 정보 구조 IA */}
        <SectionTitle title="정보 구조 (IA)" description="페이지 내 UI 영역 계층 구조" />
        <Box
          component="pre"
          sx={ {
            p: 2.5,
            mb: 4,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            fontSize: 13,
            fontFamily: 'monospace',
            lineHeight: 1.8,
          } }
        >
          { ia }
        </Box>

        {/* 데이터 모델 */}
        <SectionTitle title="데이터 모델" description="프론트엔드 관점의 상태/엔티티 중심" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 140 } }>엔티티</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>주요 필드</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 280 } }>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { dataModel.map((row, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontFamily: 'monospace', fontWeight: 700, fontSize: 13 } }>{ row.entity }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ row.fields }</TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ row.note }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 컴포넌트 리스트 */}
        <SectionTitle title="컴포넌트 리스트" description="기존 디자인 시스템 재활용 우선. 재활용 → 수정 → 신규 순." />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 180 } }>컴포넌트</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>역할</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>구분</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>경로 / 비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { components.map((c, i) => {
                const chip = typeChipColor[c.type] || {};

                return (
                  <TableRow key={ i }>
                    <TableCell sx={ { fontFamily: 'monospace', fontWeight: 600, fontSize: 13 } }>{ c.name }</TableCell>
                    <TableCell sx={ { fontSize: 13 } }>{ c.role }</TableCell>
                    <TableCell>
                      <Chip
                        label={ c.type }
                        size="small"
                        color={ chip.color }
                        variant={ chip.variant }
                        sx={ { fontSize: 11, height: 22 } }
                      />
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>{ c.path }</TableCell>
                  </TableRow>
                );
              }) }
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
