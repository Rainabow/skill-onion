import { OnionHeroSection } from './OnionHeroSection';

export default {
  title: 'Template/OnionHeroSection',
  component: OnionHeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: [
          'The Skill Onion 히어로 섹션 루트 컴포넌트.',
          '배경: Radial glow(중앙 빛 번짐) + SVG 등고선 레이어(양파 껍질 개념 시각화).',
          '타이포그래피: "Unpeeling my Skillset" — Un(Playfair italic 500), S(Playfair italic 900), 나머지 Outfit 900. h1 중앙 정렬.',
          '양파 클릭 시 껍질이 순차 박리되고 스킬 카테고리가 공개된다.',
          '우상단 아이콘으로 사운드 ON/OFF 토글 가능 (Web Audio API 합성음).',
          '모든 레이어 완료 시 h1 사라지고 Let\'s Connect / View Work CTA가 화면 수직 중앙에 등장. ↺ peel again으로 리셋.',
          'OnionVisualization은 React.lazy로 지연 로드되며, 로딩 중 글로우 원 placeholder가 표시된다.',
        ].join(' '),
      },
    },
  },
  argTypes: {
    onViewWork: { action: 'viewWork', description: 'View Work 버튼 클릭 핸들러' },
    onGetInTouch: { action: 'getInTouch', description: 'Let\'s Connect 버튼 클릭 핸들러' },
  },
};

export const Default = {
  name: 'Default — 초기 상태',
  args: {},
};
