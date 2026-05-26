import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { OnionVisualization } from './OnionVisualization';
import { skillLayers } from '../../data/skillLayers';

export default {
  title: 'Custom Component/OnionVisualization',
  component: OnionVisualization,
  tags: ['autodocs'],
  argTypes: {
    peeledCount: {
      control: { type: 'number', min: 0, max: skillLayers.length },
      description: '벗겨진 레이어 수. 현재 최외곽 레이어만 렌더되며 내부 레이어는 flesh로 대체.',
    },
    isAnimating: {
      control: 'boolean',
      description: 'peel 애니메이션 진행 여부. true 시 현재 레이어 세그먼트가 순차 이탈.',
    },
    height: {
      control: 'text',
      description: 'Canvas 높이 (CSS 값)',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    peeledCount: 0,
    isAnimating: false,
    height: '480px',
  },
  render: (args) => (
    <Box sx={ { backgroundColor: '#080808', p: 2 } }>
      <OnionVisualization
        { ...args }
        layers={ skillLayers }
        onPeelComplete={ () => {} }
        onClick={ () => {} }
      />
    </Box>
  ),
};

function InteractiveDemo() {
  const [peeledCount, setPeeledCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating || peeledCount >= skillLayers.length) return;
    setIsAnimating(true);
  };

  const handlePeelComplete = () => {
    setPeeledCount((p) => p + 1);
    setIsAnimating(false);
  };

  const handleReset = () => {
    setPeeledCount(0);
    setIsAnimating(false);
  };

  return (
    <Box
      sx={ {
        backgroundColor: '#080808',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
      } }
    >
      <OnionVisualization
        layers={ skillLayers }
        peeledCount={ peeledCount }
        isAnimating={ isAnimating }
        onPeelComplete={ handlePeelComplete }
        onClick={ handleClick }
        height="480px"
        sx={ { width: '100%', maxWidth: 480 } }
      />
      <Typography
        variant="body2"
        sx={ { color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' } }
      >
        { peeledCount } / { skillLayers.length } layers peeled
        { isAnimating ? ' · animating…' : peeledCount >= skillLayers.length ? ' · complete' : ' · click to peel' }
      </Typography>
      <Box sx={ { display: 'flex', gap: 2 } }>
        <Button
          variant="outlined"
          onClick={ handleClick }
          disabled={ isAnimating || peeledCount >= skillLayers.length }
          sx={ { borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' } }
        >
          Peel
        </Button>
        <Button
          variant="text"
          onClick={ handleReset }
          sx={ { color: 'rgba(255,255,255,0.3)' } }
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}

export const Interactive = {
  name: 'Interactive — 클릭해서 껍질 벗기기',
  render: () => <InteractiveDemo />,
};

export const LayerPreview = {
  name: 'Layer Preview — 특정 레이어에서 시작',
  args: {
    peeledCount: 3,
    isAnimating: false,
    height: '480px',
  },
  render: (args) => (
    <Box sx={ { backgroundColor: '#080808', p: 2 } }>
      <OnionVisualization
        { ...args }
        layers={ skillLayers }
        onPeelComplete={ () => {} }
        onClick={ () => {} }
      />
    </Box>
  ),
};
