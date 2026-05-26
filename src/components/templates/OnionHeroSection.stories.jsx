import { OnionHeroSection } from './OnionHeroSection';

export default {
  title: 'Template/OnionHeroSection',
  component: OnionHeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    onViewWork: { action: 'viewWork', description: 'View Work 버튼 클릭 핸들러' },
    onGetInTouch: { action: 'getInTouch', description: 'Get in Touch 버튼 클릭 핸들러' },
  },
};

export const Default = {
  args: {},
};
