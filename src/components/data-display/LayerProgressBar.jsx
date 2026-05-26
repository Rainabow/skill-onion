import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Indicator } from '../../common/ui/Indicator';

/**
 * LayerProgressBar 컴포넌트
 *
 * 현재 벗겨진 레이어 수를 게이지 바와 프랙션 카운터로 함께 표시한다.
 * 기존 Indicator(fraction + progress variant)를 조합한 컴포넌트.
 *
 * Props:
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수 [Required]
 * @param {number} totalLayers - 전체 레이어 수 [Required]
 * @param {string} label - 하단 레이블 텍스트 [Optional, 기본값: 'Layers Peeled']
 * @param {string} size - 크기 ('sm' | 'md' | 'lg') [Optional, 기본값: 'md']
 * @param {string} activeColor - 활성 색상 [Optional, 기본값: 'rgba(255,255,255,0.9)']
 * @param {string} inactiveColor - 비활성 트랙 색상 [Optional, 기본값: 'rgba(255,255,255,0.15)']
 * @param {boolean} hasAnimation - 애니메이션 활성화 [Optional, 기본값: true]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <LayerProgressBar peeledCount={3} totalLayers={8} />
 */
function LayerProgressBar({
  peeledCount,
  totalLayers,
  label = 'Layers Peeled',
  size = 'md',
  activeColor = 'rgba(255,255,255,0.9)',
  inactiveColor = 'rgba(255,255,255,0.15)',
  hasAnimation = true,
  sx = {},
}) {
  const safeCount = Math.max(0, Math.min(peeledCount, totalLayers));

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        ...sx,
      } }
    >
      {/* 프랙션 + 레이블 */}
      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }>
        <Typography
          variant="caption"
          sx={ {
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          } }
        >
          { label }
        </Typography>
        <Indicator
          total={ totalLayers }
          current={ safeCount === 0 ? 0 : safeCount - 1 }
          variant="fraction"
          size={ size }
          activeColor={ activeColor }
          inactiveColor={ 'rgba(255,255,255,0.4)' }
          hasAnimation={ hasAnimation }
        />
      </Box>

      {/* 게이지 바 */}
      <Indicator
        total={ totalLayers }
        current={ safeCount === 0 ? 0 : safeCount - 1 }
        variant="progress"
        size={ size }
        activeColor={ activeColor }
        inactiveColor={ inactiveColor }
        hasAnimation={ hasAnimation }
        sx={ { maxWidth: '100%', width: '100%' } }
      />
    </Box>
  );
}

export { LayerProgressBar };
