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
  title: 'Overview/The Skill Onion/01 Project Summary',
  parameters: {
    layout: 'padded',
  },
};

const coreFeatures = [
  { id: 1, name: '입체 양파 렌더링', desc: 'CSS/SVG 기반 레이어드 그라데이션으로 3D감 있는 양파 비주얼 구현', priority: '필수' },
  { id: 2, name: '껍질 벗기기 인터랙션', desc: '클릭/탭 시 최외곽 껍질이 벗겨지는 애니메이션', priority: '필수' },
  { id: 3, name: '스킬 키워드 오픈', desc: '껍질이 제거될 때마다 해당 레이어의 스킬셋 키워드가 등장하는 전환 애니메이션', priority: '필수' },
  { id: 4, name: '커서 팔로워', desc: '양파 오브젝트 호버 시 커서가 원형으로 변하고 [ PEEL ] 텍스트가 따라다님', priority: '필수' },
  { id: 5, name: '프로그레스 바', desc: '양파 옆/하단에 N / 총겹수 Layers 인디케이터 또는 게이지 바 표시', priority: '필수' },
  { id: 6, name: '완료 상태', desc: '모든 껍질을 다 벗기면 최종 메시지 + CTA (View Work / Let\'s Connect) 노출', priority: '필수' },
  { id: 7, name: '사운드 이펙트', desc: '껍질 제거 시 바스락 효과음 재생 + 우상단 On/Off 토글 버튼 — 기본값: Off', priority: '선택' },
  { id: 8, name: '리셋 기능', desc: '완료 후 또는 언제든 양파를 원래대로 되돌릴 수 있는 리셋 트리거', priority: '선택' },
];

const skillLayers = [
  { layer: '1 (최외곽)', category: 'Soft Skills',           keywords: 'Communication · Empathy · Collaboration · Growth Mindset' },
  { layer: '2',          category: 'Product Thinking',      keywords: 'Problem Solver · Detail-Oriented · Perpetually Curious' },
  { layer: '3',          category: 'Visual Design',         keywords: 'Typography · Colour Systems · Layout · Brand Consistency' },
  { layer: '4',          category: 'Design System',         keywords: 'Component Library · Design Tokens · Storybook · Documentation' },
  { layer: '5',          category: 'AI-Enhanced Workflow',  keywords: 'Prompt Engineering · AI-assisted Design · LLM Integration' },
  { layer: '6',          category: 'UX Research',           keywords: 'User Interviews · Usability Testing · Prototyping · User Flows · Journey Mapping' },
  { layer: '7',          category: 'Accessibility',          keywords: 'WCAG · Inclusive Design · Colour Contrast · Keyboard Navigation' },
  { layer: '8 (최내부)', category: 'UX Strategy',           keywords: 'Competitive Analysis · Data-Driven · Stakeholder Alignment' },
];

const inScope = [
  '단일 히어로 섹션 (1 페이지 단위 컴포넌트)',
  'React 기반 인터랙션 및 상태 관리 (레이어 인덱스)',
  'Three.js + @react-three/fiber 기반 3D 양파 렌더링 (볼륨감, 질감, 메시 변형)',
  'Framer Motion 기반 껍질 fly-away 타이밍 제어',
  '커스텀 커서 팔로워 (데스크톱 전용)',
  '프로그레스 인디케이터 (게이지 바 또는 텍스트 카운터)',
  '사운드 이펙트 + On/Off 토글 (선택 기능)',
  '반응형 지원 (모바일 탭 / 데스크톱 클릭)',
  'Storybook 스토리 문서화',
];

const outOfScope = [
  '백엔드 / 데이터베이스 연동',
  '다국어 지원 (한국어 버전 없음)',
  '포트폴리오 전체 페이지 구현 (히어로 섹션만)',
];

const constraints = [
  '기존 MUI 디자인 시스템 토큰 준수',
  '퍼포먼스: 애니메이션이 렌더링 성능을 저하시키지 않아야 함',
  '접근성: 키보드 트리거 (Space/Enter) 지원 고려',
  '언어: Australian English 전용',
];

const successCriteria = [
  '방문자가 모든 레이어를 끝까지 벗기는 완료율 > 70% (체감 목표)',
  '첫 클릭까지 유도 시간 < 3초 (힌트 없이도 자연스러운 어포던스)',
  '모바일/데스크톱 모두 버벅임 없이 애니메이션 재생',
];

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="Project Summary"
        status="Draft"
        note="포트폴리오 히어로 섹션 — 인터랙티브 양파 스킬 공개"
        brandName="The Skill Onion"
        systemName="Project Planning"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          The Skill Onion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          까도 까도 매력이 나오는 인터랙티브 포트폴리오 히어로 섹션 — 양파를 벗길 때마다 디자이너의 스킬셋이 한 겹씩 드러난다.
        </Typography>

        {/* 배경 및 목적 */}
        <SectionTitle title="배경 및 목적" />
        <Box component="ul" sx={ { pl: 3, mb: 4, '& li': { mb: 1 } } }>
          <li><Typography variant="body2"><strong>문제</strong>: 기존 포트폴리오의 스킬 섹션은 정적 텍스트/배지 나열 → 방문자 기억에 잘 남지 않음</Typography></li>
          <li><Typography variant="body2"><strong>기회</strong>: 클릭(탭)이라는 능동적 행동 + 명확한 시각 피드백(애니메이션) = 도파민 루프 형성</Typography></li>
          <li><Typography variant="body2"><strong>기대 효과①</strong>: 방문자가 "직접 양파를 까본" 체험을 통해 스킬 목록을 능동적으로 인지</Typography></li>
          <li><Typography variant="body2"><strong>기대 효과②</strong>: UI/UX 디자이너로서 인터랙션 설계 능력과 프론트엔드 이해도를 작품 자체로 증명</Typography></li>
          <li><Typography variant="body2"><strong>기대 효과③</strong>: 리크루터/클라이언트에게 차별화된 첫인상 각인</Typography></li>
        </Box>

        {/* 핵심 기능 */}
        <SectionTitle title="핵심 기능" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 32 } }>#</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 160 } }>기능</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>설명</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 72 } }>우선순위</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { coreFeatures.map((f) => (
                <TableRow key={ f.id }>
                  <TableCell sx={ { color: 'text.secondary' } }>{ f.id }</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>{ f.name }</TableCell>
                  <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ f.desc }</TableCell>
                  <TableCell>
                    <Chip
                      label={ f.priority }
                      size="small"
                      color={ f.priority === '필수' ? 'primary' : 'default' }
                      variant={ f.priority === '필수' ? 'filled' : 'outlined' }
                      sx={ { fontSize: 11, height: 22 } }
                    />
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 스킬 레이어 구성안 */}
        <SectionTitle
          title="스킬 레이어 구성안"
          description="레이어 수: 8겹 (최외곽 UI/UX Design → 최내부 AI-enhanced Workflow)."
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>레이어 (겉→속)</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 200 } }>스킬 카테고리</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>키워드 예시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { skillLayers.map((row) => (
                <TableRow key={ row.layer }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ row.layer }</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>{ row.category }</TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ row.keywords }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 대상 사용자 */}
        <SectionTitle title="대상 사용자" />
        <Box component="ul" sx={ { pl: 3, mb: 4, '& li': { mb: 1 } } }>
          <li><Typography variant="body2"><strong>주요 사용자</strong>: 리크루터 (채용 담당자) — 포트폴리오 첫 화면에서 강한 인상을 받아야 하는 대상</Typography></li>
          <li><Typography variant="body2"><strong>보조 사용자</strong>: 클라이언트 / 협업 파트너 — 역량 범위를 빠르게 파악하고 싶은 대상</Typography></li>
          <li><Typography variant="body2"><strong>보조 사용자</strong>: 동료 디자이너 — 인터랙션 레퍼런스 또는 구현 방식에서 영감을 얻고자 하는 대상</Typography></li>
        </Box>

        {/* 기술적 범위 */}
        <SectionTitle title="기술적 범위" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>구분</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { inScope.map((item, i) => (
                <TableRow key={ `in-${i}` }>
                  { i === 0 && (
                    <TableCell rowSpan={ inScope.length } sx={ { fontWeight: 600, color: 'success.main', verticalAlign: 'top' } }>
                      포함
                    </TableCell>
                  ) }
                  <TableCell sx={ { fontSize: 13 } }>{ item }</TableCell>
                </TableRow>
              )) }
              { outOfScope.map((item, i) => (
                <TableRow key={ `out-${i}` }>
                  { i === 0 && (
                    <TableCell rowSpan={ outOfScope.length } sx={ { fontWeight: 600, color: 'error.main', verticalAlign: 'top' } }>
                      제외
                    </TableCell>
                  ) }
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ item }</TableCell>
                </TableRow>
              )) }
              { constraints.map((item, i) => (
                <TableRow key={ `con-${i}` }>
                  { i === 0 && (
                    <TableCell rowSpan={ constraints.length } sx={ { fontWeight: 600, color: 'warning.main', verticalAlign: 'top' } }>
                      제약사항
                    </TableCell>
                  ) }
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ item }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 성공 기준 */}
        <SectionTitle title="성공 기준" />
        <Box component="ul" sx={ { pl: 3, mb: 4, '& li': { mb: 1 } } }>
          { successCriteria.map((c, i) => (
            <li key={ i }><Typography variant="body2">{ c }</Typography></li>
          )) }
        </Box>
      </PageContainer>
    </>
  ),
};
