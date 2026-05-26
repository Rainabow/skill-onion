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
          '양파 클릭 시 껍질이 순차 박리되고 스킬 카테고리가 공개된다.',
          '우상단 아이콘으로 사운드 ON/OFF 토글 가능 (Web Audio API 합성음).',
          '모든 레이어 완료 시 Get in Touch / View Work CTA와 ↺ peel again 버튼이 등장한다.',
        ].join(' '),
      },
    },
  },
  argTypes: {
    onViewWork: { action: 'viewWork', description: 'View Work 버튼 클릭 핸들러' },
    onGetInTouch: { action: 'getInTouch', description: 'Get in Touch 버튼 클릭 핸들러' },
  },
};

export const Default = {
  name: 'Default — 초기 상태',
  args: {},
};
