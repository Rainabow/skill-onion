import Box from '@mui/material/Box';
import { SkillRevealPanel } from './SkillRevealPanel';
import { skillLayers } from '../../data/skillLayers';

export default {
  title: 'Custom Component/SkillRevealPanel',
  component: SkillRevealPanel,
  tags: ['autodocs'],
  argTypes: {
    category: { control: 'text', description: '스킬 카테고리명' },
    keywords: { control: 'object', description: '키워드 배열' },
    accentColor: { control: 'color', description: '카테고리 강조 색상' },
    isVisible: { control: 'boolean', description: '패널 표시 여부' },
    layerNumber: { control: { type: 'number', min: 1 }, description: '현재 레이어 번호' },
    totalLayers: { control: { type: 'number', min: 1 }, description: '전체 레이어 수' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Default = {
  args: {
    category: skillLayers[0].category,
    keywords: skillLayers[0].keywords,
    accentColor: skillLayers[0].color,
    isVisible: true,
    layerNumber: 1,
    totalLayers: skillLayers.length,
  },
  render: (args) => (
    <Box sx={ { p: 4, backgroundColor: '#111', minHeight: 200 } }>
      <SkillRevealPanel { ...args } />
    </Box>
  ),
};

export const AllLayers = {
  render: () => (
    <Box
      sx={ {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 3,
        p: 4,
        backgroundColor: '#111',
      } }
    >
      { skillLayers.map((layer, i) => (
        <Box key={ layer.id } sx={ { p: 2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1 } }>
          <SkillRevealPanel
            category={ layer.category }
            keywords={ layer.keywords }
            accentColor={ layer.color }
            isVisible
            layerNumber={ i + 1 }
            totalLayers={ skillLayers.length }
          />
        </Box>
      )) }
    </Box>
  ),
};
