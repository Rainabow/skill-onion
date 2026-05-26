import { useRef } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import ScrambleText from '../kinetic-typography/ScrambleText';

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const chipContainerVariants = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * SkillRevealPanel 컴포넌트
 *
 * 양파 껍질 제거 후 스킬 카테고리명과 키워드 목록을 표시하는 패널.
 * AnimatePresence로 카테고리 전환 시 부드러운 교체 애니메이션을 제공한다.
 *
 * Props:
 * @param {string} category - 스킬 카테고리명 [Required]
 * @param {Array} keywords - 키워드 문자열 배열 [Required]
 * @param {string} accentColor - 카테고리 강조 색상 (hex) [Optional, 기본값: '#7ABB6A']
 * @param {boolean} isVisible - 패널 표시 여부 [Optional, 기본값: true]
 * @param {number} layerNumber - 현재 레이어 번호 (표시용) [Optional]
 * @param {number} totalLayers - 전체 레이어 수 (표시용) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <SkillRevealPanel
 *   category="UI / UX Design"
 *   keywords={['Figma', 'Wireframing', 'Prototyping']}
 *   accentColor="#3A7B2A"
 *   layerNumber={1}
 *   totalLayers={8}
 * />
 */
function SkillRevealPanel({
  category,
  keywords = [],
  accentColor = '#7ABB6A',
  isVisible = true,
  layerNumber,
  totalLayers,
  sx = {},
}) {
  const prevCategoryRef = useRef(category);

  return (
    <Box sx={ { minWidth: 240, ...sx } }>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={ category }
            variants={ panelVariants }
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 레이어 카운터 */}
            { layerNumber != null && totalLayers != null && (
              <Typography
                variant="caption"
                sx={ {
                  display: 'block',
                  mb: 1,
                  color: accentColor,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  fontSize: 11,
                } }
              >
                LAYER { layerNumber } / { totalLayers }
              </Typography>
            ) }

            {/* 카테고리명 */}
            <Box sx={ { mb: 2 } }>
              <ScrambleText
                text={ category }
                duration={ 600 }
                isInitialScramble={ category !== prevCategoryRef.current }
                variant="h5"
                sx={ { fontWeight: 700, color: 'common.white', lineHeight: 1.2 } }
              />
            </Box>

            {/* 키워드 칩 */}
            <motion.div
              variants={ chipContainerVariants }
              initial="hidden"
              animate="visible"
              style={ { display: 'flex', flexWrap: 'wrap', gap: 8 } }
            >
              { keywords.map((kw) => (
                <motion.div key={ kw } variants={ chipVariants }>
                  <Chip
                    label={ kw }
                    size="small"
                    sx={ {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: 500,
                      height: 28,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.14)',
                      },
                    } }
                  />
                </motion.div>
              )) }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export { SkillRevealPanel };
