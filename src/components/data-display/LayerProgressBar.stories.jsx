import Box from '@mui/material/Box';
import { LayerProgressBar } from './LayerProgressBar';

export default {
  title: 'Custom Component/LayerProgressBar',
  component: LayerProgressBar,
  tags: ['autodocs'],
  argTypes: {
    peeledCount: { control: { type: 'number', min: 0, max: 8 }, description: '벗겨진 레이어 수' },
    totalLayers: { control: { type: 'number', min: 1, max: 10 }, description: '전체 레이어 수' },
    label: { control: 'text', description: '레이블 텍스트' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: '크기' },
    activeColor: { control: 'color', description: '활성 진행 색상' },
    inactiveColor: { control: 'color', description: '비활성 트랙 색상' },
    hasAnimation: { control: 'boolean', description: '애니메이션 활성화 여부' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Default = {
  args: {
    peeledCount: 3,
    totalLayers: 8,
    label: 'Layers Peeled',
    size: 'md',
    hasAnimation: true,
  },
  render: (args) => (
    <Box sx={ { p: 4, backgroundColor: '#111', maxWidth: 360 } }>
      <LayerProgressBar { ...args } />
    </Box>
  ),
};

export const AllStages = {
  render: () => (
    <Box sx={ { p: 4, backgroundColor: '#111', display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 360 } }>
      { [0, 2, 4, 6, 8].map((count) => (
        <LayerProgressBar key={ count } peeledCount={ count } totalLayers={ 8 } />
      )) }
    </Box>
  ),
};
