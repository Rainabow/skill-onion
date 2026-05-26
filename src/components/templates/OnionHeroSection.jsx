import { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { AnimatePresence, motion } from 'framer-motion';
import { CursorFollower } from '../motion/CursorFollower';
import { SkillRevealPanel } from '../card/SkillRevealPanel';
import { LayerProgressBar } from '../data-display/LayerProgressBar';
import { OnionVisualization } from '../media/OnionVisualization';
import { skillLayers } from '../../data/skillLayers';

const completionVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
  },
};

const completionItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.06, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 2.4, ease: 'easeInOut', repeat: Infinity },
  },
};

/**
 * OnionHeroSection 컴포넌트
 *
 * The Skill Onion 포트폴리오 히어로 섹션 루트 컴포넌트.
 * 모든 서브 컴포넌트 (OnionVisualization, SkillRevealPanel,
 * LayerProgressBar, CursorFollower)를 조합하고 인터랙션 상태를 관리한다.
 *
 * Props:
 * @param {Array} layers - 레이어 데이터 배열 [Optional, 기본값: skillLayers]
 * @param {function} onViewWork - "View Work" CTA 클릭 핸들러 [Optional]
 * @param {function} onGetInTouch - "Get in Touch" CTA 클릭 핸들러 [Optional]
 *
 * Example usage:
 * <OnionHeroSection
 *   onViewWork={() => navigate('/work')}
 *   onGetInTouch={() => navigate('/contact')}
 * />
 */
function OnionHeroSection({
  layers = skillLayers,
  onViewWork,
  onGetInTouch,
}) {
  const [peeledCount, setPeeledCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const onionRef = useRef(null);

  const currentLayer = layers[peeledCount] || null;
  const hasStarted = peeledCount > 0;

  const handleClick = useCallback(() => {
    if (isAnimating || isComplete) return;
    setIsAnimating(true);
    // TODO: isSoundEnabled && playPeelSound();
  }, [isAnimating, isComplete]);

  const handlePeelComplete = useCallback(() => {
    const next = peeledCount + 1;
    setPeeledCount(next);
    setIsAnimating(false);
    if (next >= layers.length) {
      setIsComplete(true);
    }
  }, [peeledCount, layers.length]);

  const handleReset = useCallback(() => {
    setPeeledCount(0);
    setIsAnimating(false);
    setIsComplete(false);
  }, []);

  return (
    <Box
      sx={ {
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        backgroundColor: '#080808',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        overflow: 'hidden',
      } }
    >
      {/* 커스텀 커서 팔로워 */}
      <CursorFollower
        targetRef={ onionRef }
        label="PEEL"
        isDisabled={ isAnimating || isComplete }
      />

      {/* 사운드 토글 — 우상단 고정 */}
      <Box
        sx={ {
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 32 },
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        } }
      >
        <IconButton
          size="small"
          onClick={ () => setIsSoundEnabled((v) => !v) }
          sx={ { color: 'rgba(255,255,255,0.45)', '&:hover': { color: 'rgba(255,255,255,0.85)' } } }
        >
          { isSoundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" /> }
        </IconButton>
        <Switch
          checked={ isSoundEnabled }
          onChange={ (e) => setIsSoundEnabled(e.target.checked) }
          size="small"
          sx={ {
            '& .MuiSwitch-thumb': { backgroundColor: isSoundEnabled ? '#fff' : 'rgba(255,255,255,0.3)' },
            '& .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.15) !important' },
          } }
        />
      </Box>

      {/* 좌측 — 양파 + 진행 바 */}
      <Box
        ref={ onionRef }
        sx={ {
          flex: { xs: 'none', md: '0 0 55%' },
          width: { xs: '100%', md: '55%' },
          height: { xs: '50svh', md: '100svh' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 6, md: 0 },
        } }
      >
        <OnionVisualization
          layers={ layers }
          peeledCount={ peeledCount }
          isAnimating={ isAnimating }
          onPeelComplete={ handlePeelComplete }
          onClick={ handleClick }
          height="420px"
          sx={ { width: '100%', maxWidth: 480 } }
        />

        {/* 초기 상태 — 클릭 힌트 */}
        <AnimatePresence>
          { !hasStarted && !isComplete && (
            <motion.div
              variants={ pulseVariants }
              animate="animate"
              exit={ { opacity: 0 } }
            >
              <Typography
                variant="caption"
                sx={ {
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontSize: 11,
                  mt: 1,
                  display: 'block',
                  textAlign: 'center',
                } }
              >
                Click to peel
              </Typography>
            </motion.div>
          ) }
        </AnimatePresence>

        {/* 진행 바 */}
        { hasStarted && !isComplete && (
          <LayerProgressBar
            peeledCount={ peeledCount }
            totalLayers={ layers.length }
            sx={ {
              mt: 3,
              width: '100%',
              maxWidth: 360,
              px: { xs: 3, md: 2 },
            } }
          />
        ) }
      </Box>

      {/* 우측 — 텍스트 + 스킬 패널 */}
      <Box
        sx={ {
          flex: { xs: 'none', md: '0 0 45%' },
          width: { xs: '100%', md: '45%' },
          px: { xs: 4, md: 6 },
          py: { xs: 4, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
        } }
      >
        <AnimatePresence mode="wait">
          { !isComplete ? (
            <motion.div
              key="main"
              initial={ { opacity: 0 } }
              animate={ { opacity: 1 } }
              exit={ { opacity: 0, transition: { duration: 0.3 } } }
              style={ { display: 'flex', flexDirection: 'column', gap: 24 } }
            >
              {/* Kicker */}
              <Typography
                variant="overline"
                sx={ {
                  color: 'rgba(255,255,255,0.4)',
                  display: 'block',
                } }
              >
                The Skill Onion Project
              </Typography>

              {/* H1 */}
              <Typography
                variant="h2"
                sx={ {
                  fontWeight: 900,
                  color: 'common.white',
                  lineHeight: 1.1,
                  fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                } }
              >
                Like an Onion: Layers of Skills to Peel Back.
              </Typography>

              {/* Subtext */}
              { !hasStarted && (
                <Typography
                  variant="body1"
                  sx={ { color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 440 } }
                >
                  I&apos;m a UI/UX designer with depth. Click to peel back the layers and
                  discover the diverse skill set I bring to the table.
                </Typography>
              ) }

              {/* 스킬 패널 */}
              { hasStarted && currentLayer && (
                <SkillRevealPanel
                  category={ currentLayer.category }
                  keywords={ currentLayer.keywords }
                  accentColor={ currentLayer.color }
                  isVisible={ !isAnimating }
                  layerNumber={ peeledCount }
                  totalLayers={ layers.length }
                />
              ) }
            </motion.div>
          ) : (
            /* 완료 상태 */
            <motion.div
              key="complete"
              variants={ completionVariants }
              initial="hidden"
              animate="visible"
              style={ { display: 'flex', flexDirection: 'column', gap: 24 } }
            >
              <motion.div variants={ completionItemVariants }>
                <Typography
                  variant="caption"
                  sx={ {
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontSize: 11,
                  } }
                >
                  You made it to the core.
                </Typography>
              </motion.div>

              <motion.div variants={ completionItemVariants }>
                <Typography
                  variant="h3"
                  sx={ { fontWeight: 700, color: 'common.white', lineHeight: 1.15 } }
                >
                  You&apos;ve seen it all. Now let&apos;s build something.
                </Typography>
              </motion.div>

              <motion.div
                variants={ completionItemVariants }
                style={ { display: 'flex', gap: 12, flexWrap: 'wrap' } }
              >
                <Button
                  variant="contained"
                  onClick={ onGetInTouch }
                  sx={ {
                    backgroundColor: 'common.white',
                    color: '#080808',
                    fontWeight: 700,
                    px: 3,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.85)' },
                  } }
                >
                  Get in Touch
                </Button>
                <Button
                  variant="outlined"
                  onClick={ onViewWork }
                  sx={ {
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 700,
                    px: 3,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.8)',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                    },
                  } }
                >
                  View Work
                </Button>
              </motion.div>

              <motion.div variants={ completionItemVariants }>
                <Button
                  variant="text"
                  onClick={ handleReset }
                  sx={ {
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    '&:hover': { color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent' },
                  } }
                >
                  ↺ peel again
                </Button>
              </motion.div>
            </motion.div>
          ) }
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export { OnionHeroSection };
