import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CursorFollower } from './CursorFollower';

export default {
  title: 'Custom Component/CursorFollower',
  component: CursorFollower,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '호버 시 커서 내부에 표시할 텍스트' },
    isDisabled: { control: 'boolean', description: '커서 비활성화 여부' },
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
