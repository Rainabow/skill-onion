import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CursorFollower } from './CursorFollower';

export default {
  title: 'Custom Component/CursorFollower',
  component: CursorFollower,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '마우스를 따라다니는 원형 커스텀 커서.',
          'targetRef 영역 밖에서는 커서 원이 완전히 숨겨지고(opacity 0),',
          'targetRef 위에서만 원이 확장되며 label 텍스트가 등장한다.',
          'useSpring 없이 useMotionValue 직접 바인딩으로 즉각 반응하며,',
          'scale/opacity 전환만 framer-motion variants가 담당한다.',
          '터치 기기 또는 isDisabled=true 시 렌더링되지 않는다.',
        ].join(' '),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'targetRef 호버 시 커서 내부에 표시할 텍스트' },
    isDisabled: { control: 'boolean', description: '커서 전체 비활성화. true 시 컴포넌트 자체가 null 반환.' },
  },
};

export const Default = {
  render: (args) => {
    const boxRef = useRef(null);

    return (
      <Box
        sx={ {
          width: '100%',
          height: 400,
          backgroundColor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        } }
      >
        <CursorFollower targetRef={ boxRef } { ...args } />
        <Box
          ref={ boxRef }
          sx={ {
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: '#1E3A1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          } }
        >
          <Typography variant="body2" sx={ { color: 'rgba(255,255,255,0.5)' } }>
            hover me
          </Typography>
        </Box>
      </Box>
    );
  },
  args: {
    label: 'PEEL',
    isDisabled: false,
  },
};
