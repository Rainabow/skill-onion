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
import { skillLayers } from '../../data/skillLayers';

export default {
  title: 'Overview/The Skill Onion/03 Visual Direction',
  parameters: {
    layout: 'padded',
  },
};

const toneKeywords = ['Dark Luxury', 'Tactile 3D', 'Cinematic'];

const bgColors = [
  { label: '섹션 배경', value: '#080808', text: '#FFFFFF', desc: '딥 블랙. 순수 검정보다 따뜻한 톤' },
  { label: '카드 / 패널 서피스', value: 'rgba(255,255,255,0.04)', text: '#FFFFFF', bg: '#080808', desc: '배경 대비 미세한 레이어 구분' },
  { label: '구분선 / 보더', value: 'rgba(255,255,255,0.1)', text: '#FFFFFF', bg: '#080808', desc: '절제된 선 처리' },
];

const textColors = [
  { label: '1차 텍스트', value: '#FFFFFF', usage: 'H1, 카테고리명' },
  { label: '2차 텍스트', value: 'rgba(255,255,255,0.7)', usage: 'Subtext, 키워드 칩' },
  { label: '3차 텍스트', value: 'rgba(255,255,255,0.4)', usage: 'Kicker, 진행 카운터' },
];

const onionLayers = skillLayers.map((l, i) => ({
  layer: i === 0 ? '1 (최외곽)' : i === skillLayers.length - 1 ? `${i + 1} (최내부)` : `${i + 1}`,
  category: l.category,
  color: l.color,
  emissive: l.emissiveColor,
}));

const ctaColors = [
  { label: 'View Work (outlined)', border: 'rgba(255,255,255,0.5)', bg: 'transparent', text: '#FFFFFF', desc: '절제된 화이트 아웃라인' },
  { label: 'Get in Touch (filled)', border: 'none', bg: '#FFFFFF', text: '#080808', desc: '반전 CTA, 시선 집중' },
  { label: '완료 글로우', border: 'none', bg: 'rgba(216,234,160,0.3)', text: '#FFFFFF', desc: '최내부 레이어 컬러 확산' },
];

const typography = [
  { element: 'Kicker', current: 'overline · 0.75rem · uppercase · tracking 0.08em', applied: '동일 사용 · color rgba(255,255,255,0.4)', method: '테마 variant 재사용' },
  { element: 'H1', current: 'Outfit 900 · 2.5rem · tracking -0.02em', applied: 'Outfit 900 · clamp(2.8rem, 5vw, 5rem) · color #FFFFFF', method: '섹션 내 sx (fontSize만 오버라이드)' },
  { element: 'Subtext', current: 'body1 · 1rem · lineHeight 1.6', applied: '동일 사용 · color rgba(255,255,255,0.7) · max-width 440px', method: '테마 variant 재사용' },
  { element: '카테고리명', current: 'h5 · Outfit 700 · 1.25rem', applied: '동일 사용 · color #FFFFFF', method: '테마 variant 재사용' },
  { element: '키워드 칩', current: 'body2 · 0.875rem', applied: 'monospace · 12px · weight 500', method: '로컬 sx' },
  { element: '진행 카운터', current: 'caption · 0.75rem', applied: 'monospace · color rgba(255,255,255,0.4)', method: '로컬 sx' },
];

const lights = [
  { name: 'Ambient', type: 'ambientLight', position: '—', intensity: '0.18', color: '#FFFFFF', role: '전체 기저광' },
  { name: 'Key Light', type: 'directionalLight', position: '[-3, 5, 3]', intensity: '2.2', color: '#FFF5E0', role: '주 조명 · 좌상단 (따뜻한 톤)' },
  { name: 'Rim Light', type: 'directionalLight', position: '[4, 2, -5]', intensity: '0.5', color: '#B0C8FF', role: '우측 림 · 배경 분리 (쿨톤)' },
  { name: 'Fill Light', type: 'directionalLight', position: '[0, -4, 2]', intensity: '0.15', color: '#FFF0D0', role: '하단 fill · 그림자 완화' },
];

const tokenChanges = [
  { token: 'palette.background.default', current: '#FFFFFF', next: '유지', target: '전역', method: '—' },
  { token: 'palette.primary.main', current: '#0000FF', next: '유지', target: '전역', method: '—' },
  { token: 'typography.h1.fontFamily', current: '"Outfit", ...', next: '유지', target: '전역', method: '—' },
  { token: 'typography.h1.fontWeight', current: '900', next: '유지', target: '전역', method: '—' },
  { token: 'Hero H1 fontSize', current: '2.5rem', next: 'clamp(2.8rem, 5vw, 5rem)', target: 'OnionHeroSection 내 H1', method: '로컬 sx 오버라이드' },
  { token: 'Hero 배경', current: '#FFFFFF', next: '#080808', target: 'OnionHeroSection 섹션 배경', method: '로컬 sx 오버라이드' },
];

const desktopLayout = `┌─────────────────────────────────────────────────┐
│ [사운드 토글]                          [우상단]  │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │                  │  │ Kicker               │  │
│  │  OnionVisuali-   │  │ H1 (Outfit 900)      │  │
│  │  zation          │  │ Subtext              │  │
│  │  (55% 너비)      │  │                      │  │
│  │                  │  │ ── 첫 껍질 후 ──     │  │
│  │                  │  │ SkillRevealPanel     │  │
│  └──────────────────┘  └──────────────────────┘  │
│  LayerProgressBar (양파 하단 중앙 정렬)           │
└─────────────────────────────────────────────────┘`;

const mobileLayout = `┌─────────────────────────┐
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
└─────────────────────────┘`;

const breakpoints = [
  { range: 'xs → sm (0 ~ 600px)', changes: '수직 스택 · 양파 height 320px · 커서 팔로워 비활성' },
  { range: 'sm → md (600 ~ 900px)', changes: '수직 스택 유지 · 양파 height 400px' },
  { range: 'md+ (900px+)', changes: '좌우 수평 분리 레이아웃 · 커서 팔로워 활성' },
];

const references = [
  { file: 'Screenshot 2026-05-26 at 5.16.50 pm.png', src: '/src/assets/reference/Screenshot 2026-05-26 at 5.16.50 pm.png', points: '딥 블랙 배경 위 단색 3D 오브젝트 · 플로팅 연출 · 좌우 분리 레이아웃' },
  { file: 'Screenshot 2026-05-26 at 5.18.45 pm.png', src: '/src/assets/reference/Screenshot 2026-05-26 at 5.18.45 pm.png', points: '어두운 배경 위 3D 글로브 · 림 라이트로 배경 분리 · Bold sans 헤드라인' },
  { file: 'Screenshot 2026-05-26 at 5.24.32 pm.png', src: '/src/assets/reference/Screenshot 2026-05-26 at 5.24.32 pm.png', points: '우측 faceted 3D 오브젝트 · 미세한 바닥 빛 줄기 · 대형 산세리프 H1' },
];

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="Visual Direction"
        status="Draft"
        note="톤앤매너 · 컬러 · 타이포그래피 · 레이아웃 · 3D 비주얼 가이드"
        brandName="The Skill Onion"
        systemName="Project Planning"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Visual Direction
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          The Skill Onion 히어로 섹션의 비주얼 언어를 정의한다. 전역 테마 수정 없이 섹션 로컬 sx 오버라이드로 처리한다.
        </Typography>

        {/* 톤앤매너 */}
        <SectionTitle title="톤앤매너" />
        <Box sx={ { display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 } }>
          { toneKeywords.map((kw) => (
            <Chip key={ kw } label={ kw } variant="outlined" color="primary" sx={ { fontWeight: 700, fontSize: 13 } } />
          )) }
        </Box>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          배경은 깊은 다크, 오브젝트(양파)만 빛을 받는다. 인터랙션의 쾌감이 시각 피드백의 핵심 — 3D 오브젝트의 볼륨감과 껍질이 날아가는 시네마틱한 연출로 강한 첫인상을 만든다.
        </Typography>

        {/* 컬러 방향 — 배경 & 서피스 */}
        <SectionTitle
          title="컬러 방향"
          description="다크 모드 아일랜드 — 전역 테마와 독립. OnionHeroSection 내부 로컬 sx로 적용."
        />

        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1.5 } }>배경 & 서피스</Typography>
        <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 } }>
          { bgColors.map((c) => (
            <Box key={ c.label } sx={ { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 } }>
              <Box
                sx={ {
                  width: '100%',
                  height: 72,
                  backgroundColor: c.bg || c.value,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } }
              >
                <Box sx={ { width: '60%', height: 32, backgroundColor: c.value, border: '1px solid rgba(255,255,255,0.2)' } } />
              </Box>
              <Typography variant="caption" sx={ { fontWeight: 700 } }>{ c.label }</Typography>
              <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.secondary' } }>{ c.value }</Typography>
              <Typography variant="caption" color="text.secondary">{ c.desc }</Typography>
            </Box>
          )) }
        </Box>

        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1.5 } }>텍스트 (다크 배경 위)</Typography>
        <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 } }>
          { textColors.map((c) => (
            <Box
              key={ c.label }
              sx={ {
                p: 2,
                backgroundColor: '#080808',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 180,
                flex: 1,
              } }
            >
              <Typography sx={ { color: c.value, fontWeight: 700, fontSize: 20, mb: 0.5 } }>Aa</Typography>
              <Typography variant="caption" sx={ { color: 'rgba(255,255,255,0.5)', display: 'block' } }>{ c.label }</Typography>
              <Typography variant="caption" sx={ { color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block' } }>{ c.value }</Typography>
              <Typography variant="caption" sx={ { color: 'rgba(255,255,255,0.3)', display: 'block' } }>{ c.usage }</Typography>
            </Box>
          )) }
        </Box>

        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1.5 } }>양파 레이어 컬러 (외곽 → 내부)</Typography>
        <Box sx={ { display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' } }>
          { onionLayers.map((l) => (
            <Box key={ l.layer } sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 64 } }>
              <Box sx={ { width: 48, height: 48, backgroundColor: l.color, border: '1px solid rgba(255,255,255,0.1)' } } />
              <Typography variant="caption" sx={ { fontFamily: 'monospace', fontSize: 10, textAlign: 'center' } }>{ l.color }</Typography>
            </Box>
          )) }
        </Box>
        <TableContainer sx={ { mb: 3 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>레이어</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>카테고리</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>메인 컬러</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>이미시브</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { onionLayers.map((l) => (
                <TableRow key={ l.layer }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ l.layer }</TableCell>
                  <TableCell sx={ { fontWeight: 600, fontSize: 13 } }>{ l.category }</TableCell>
                  <TableCell>
                    <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                      <Box sx={ { width: 16, height: 16, backgroundColor: l.color, border: '1px solid', borderColor: 'divider', flexShrink: 0 } } />
                      <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>{ l.color }</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                      <Box sx={ { width: 16, height: 16, backgroundColor: l.emissive, border: '1px solid', borderColor: 'divider', flexShrink: 0 } } />
                      <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>{ l.emissive }</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1.5 } }>포인트 컬러 (CTA / 완료 상태)</Typography>
        <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 } }>
          { ctaColors.map((c) => (
            <Box
              key={ c.label }
              sx={ {
                p: 2,
                backgroundColor: '#080808',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 180,
                flex: 1,
              } }
            >
              <Box
                sx={ {
                  px: 2,
                  py: 1,
                  mb: 1.5,
                  backgroundColor: c.bg,
                  border: c.border !== 'none' ? `1px solid ${c.border}` : 'none',
                  display: 'inline-block',
                } }
              >
                <Typography sx={ { color: c.text, fontSize: 13, fontWeight: 600 } }>{ c.label }</Typography>
              </Box>
              <Typography variant="caption" sx={ { color: 'rgba(255,255,255,0.4)', display: 'block' } }>{ c.desc }</Typography>
            </Box>
          )) }
        </Box>

        {/* 타이포그래피 방향 */}
        <SectionTitle
          title="타이포그래피 방향"
          description="Outfit (geometric sans-serif) 전역 설정 유지. 추가 폰트 없음."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>요소</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>현재 테마 설정</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>The Skill Onion 적용값</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 160 } }>적용 방식</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { typography.map((row, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontWeight: 700, fontSize: 13 } }>{ row.element }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ row.current }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.applied }</TableCell>
                  <TableCell>
                    <Chip
                      label={ row.method }
                      size="small"
                      variant={ row.method === '테마 variant 재사용' ? 'outlined' : 'filled' }
                      color={ row.method === '테마 variant 재사용' ? 'default' : 'primary' }
                      sx={ { fontSize: 10, height: 20 } }
                    />
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 레이아웃 */}
        <SectionTitle title="간격 및 레이아웃" description="spacing 기본 단위 8px 유지 · 섹션 최소 높이 100svh" />
        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1 } }>데스크톱 (md+ · 900px+)</Typography>
        <Box
          component="pre"
          sx={ {
            p: 2.5,
            mb: 3,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            fontSize: 12,
            fontFamily: 'monospace',
            lineHeight: 1.7,
            overflowX: 'auto',
          } }
        >
          { desktopLayout }
        </Box>
        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1 } }>모바일 (sm- · 600px-)</Typography>
        <Box
          component="pre"
          sx={ {
            p: 2.5,
            mb: 3,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            fontSize: 12,
            fontFamily: 'monospace',
            lineHeight: 1.7,
          } }
        >
          { mobileLayout }
        </Box>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 200 } }>브레이크포인트</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>변화 내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { breakpoints.map((b, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ b.range }</TableCell>
                  <TableCell sx={ { fontSize: 13 } }>{ b.changes }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 3D 오브젝트 비주얼 가이드 */}
        <SectionTitle title="3D 오브젝트 비주얼 가이드" description="OnionVisualization.jsx 조명 설정 기준" />
        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1.5 } }>조명 설정</Typography>
        <TableContainer sx={ { mb: 3 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>라이트</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 140 } }>타입</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 110 } }>position</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>intensity</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>color</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>역할</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { lights.map((l) => (
                <TableRow key={ l.name }>
                  <TableCell sx={ { fontWeight: 700, fontSize: 13 } }>{ l.name }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ l.type }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ l.position }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ l.intensity }</TableCell>
                  <TableCell>
                    <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
                      <Box sx={ { width: 16, height: 16, backgroundColor: l.color, border: '1px solid', borderColor: 'divider', flexShrink: 0 } } />
                      <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>{ l.color }</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ l.role }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="subtitle2" sx={ { fontWeight: 700, mb: 1 } }>머티리얼 방향</Typography>
        <Box component="ul" sx={ { pl: 3, mb: 4, '& li': { mb: 0.75 } } }>
          <li><Typography variant="body2"><strong>roughness</strong>: 외곽 레이어 0.85~0.9 (거친 껍질) → 내부로 갈수록 0.5~0.6 (부드러운 속살)</Typography></li>
          <li><Typography variant="body2"><strong>metalness</strong>: 전 레이어 0.0~0.05 (유기물, 금속감 없음)</Typography></li>
          <li><Typography variant="body2"><strong>transparent: true</strong> · opacity 1.0 유지 (peel 애니메이션 중에만 감소)</Typography></li>
          <li><Typography variant="body2">Key Light 따뜻한 톤 (#FFF5E0) ↔ Rim Light 쿨톤 (#B0C8FF) 대비가 입체감의 핵심</Typography></li>
        </Box>

        {/* 레퍼런스 */}
        <SectionTitle title="레퍼런스" />
        <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 } }>
          { references.map((r, i) => (
            <Box key={ i } sx={ { flex: '1 1 240px', border: '1px solid', borderColor: 'divider' } }>
              <Box
                component="img"
                src={ r.src }
                alt={ `Reference ${i + 1}` }
                sx={ { width: '100%', height: 160, objectFit: 'cover', display: 'block' } }
              />
              <Box sx={ { p: 1.5 } }>
                <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.secondary', display: 'block', mb: 0.5, fontSize: 10 } }>
                  { r.file }
                </Typography>
                <Typography variant="caption" color="text.secondary">{ r.points }</Typography>
              </Box>
            </Box>
          )) }
        </Box>

        {/* 변경 필요 토큰 요약 */}
        <SectionTitle
          title="변경 필요 토큰 요약"
          description="전역 테마 파일(default.js) 수정 없음. 모든 변경은 OnionHeroSection 내 로컬 sx로 처리."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>토큰 경로</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 160 } }>현재값</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 200 } }>변경값</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>적용 대상</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 140 } }>변경 방식</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { tokenChanges.map((t, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ t.token }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ t.current }</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={ {
                        fontFamily: 'monospace',
                        fontWeight: t.next !== '유지' ? 700 : 400,
                        color: t.next !== '유지' ? 'primary.main' : 'text.secondary',
                      } }
                    >
                      { t.next }
                    </Typography>
                  </TableCell>
                  <TableCell sx={ { fontSize: 13 } }>{ t.target }</TableCell>
                  <TableCell>
                    { t.method !== '—' ? (
                      <Chip label={ t.method } size="small" color="primary" variant="outlined" sx={ { fontSize: 10, height: 20 } } />
                    ) : (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    ) }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
