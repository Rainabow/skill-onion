import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { AnimatePresence, motion } from 'framer-motion';
import { CursorFollower } from '../motion/CursorFollower';
import { SkillRevealPanel } from '../card/SkillRevealPanel';
import { skillLayers } from '../../data/skillLayers';
import { playPeelSound } from '../../utils/peelSound';

/** Three.js 청크를 메인 번들에서 분리.
 *  모듈 로드 즉시 preload 시작 — Suspense가 렌더를 시도하기 전에 다운로드가 진행됨.
 *  React.lazy는 동일한 Promise를 재사용하므로 중복 요청 없음. */
const _onionPreload = import('../media/OnionVisualization');
const OnionVisualization = lazy(() =>
  _onionPreload.then((m) => ({ default: m.OnionVisualization }))
);

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
 * 레이아웃: h1 상단 풀너비 / 양파 화면 중앙 절대 배치 / 서브텍스트·스킬패널 하단 중앙.
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
  const cursorAreaRef = useRef(null);

  const currentLayer = layers[peeledCount] || null;
  const hasStarted = peeledCount > 0;

  const handleClick = useCallback(() => {
    if (isAnimating || isComplete) return;
    if (isSoundEnabled) playPeelSound();
    setIsAnimating(true);
  }, [isAnimating, isComplete, isSoundEnabled]);

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
        height: '100svh',
        background: '#080808',
        overflow: 'hidden',
      } }
    >
      {/* Radial Glow — 양파 뒤 빛 번짐 */}
      <Box
        sx={ {
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 160% 120% at 50% 55%, rgba(255,255,255,0.10) 0%, transparent 75%)',
            'radial-gradient(ellipse 80% 60% at 50% 58%, rgba(255,255,255,0.07) 0%, transparent 65%)',
          ].join(', '),
          zIndex: 0,
          pointerEvents: 'none',
        } }
      />

      {/* 커스텀 커서 팔로워 — 양파 중앙 영역에서만 활성화 */}
      <CursorFollower
        targetRef={ cursorAreaRef }
        label="PEEL"
        isDisabled={ isAnimating || isComplete }
      />

      {/* 사운드 토글 — 우상단 고정 */}
      <IconButton
        size="small"
        onClick={ () => setIsSoundEnabled((v) => !v) }
        sx={ {
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 32 },
          zIndex: 10,
          color: isSoundEnabled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
          '&:hover': { color: 'rgba(255,255,255,0.85)', backgroundColor: 'transparent' },
        } }
      >
        { isSoundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" /> }
      </IconButton>

      {/* h1 — 상단 풀너비 */}
      <Box
        sx={ {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          px: { xs: 2.5, md: 5 },
          pt: { xs: 2, md: 2.5 },
          zIndex: 2,
          pointerEvents: 'none',
        } }
      >
        <AnimatePresence mode="wait">
          { !isComplete ? (
            <motion.div
              key="h1"
              initial={ { opacity: 0, y: -12 } }
              animate={ { opacity: 1, y: 0 } }
              exit={ { opacity: 0, transition: { duration: 0.25 } } }
              transition={ { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
            >
              <Typography
                variant="h2"
                sx={ {
                  fontWeight: 900,
                  color: 'common.white',
                  lineHeight: 0.88,
                  fontSize: 'clamp(2rem, 9.5vw, 10rem)',
                  letterSpacing: '-0.03em',
                  textAlign: 'center',
                } }
              >
                <Box
                    component="span"
                    sx={ {
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      fontWeight: 500,
                    } }
                  >Un</Box>peeling my <Box
                    component="span"
                    sx={ {
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      fontWeight: 900,
                    } }
                  >S</Box>killset
              </Typography>
            </motion.div>
          ) : null }
        </AnimatePresence>
      </Box>

      {/* 양파 — 화면 중앙 절대 배치 */}
      <Box
        ref={ onionRef }
        sx={ {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        } }
      >
        <Suspense
          fallback={
            <Box
              sx={ {
                width: 'clamp(200px, 38vmin, 480px)',
                height: 'clamp(260px, 54vmin, 640px)',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.07) 0%, transparent 70%)',
                animation: 'onion-pulse 2s ease-in-out infinite',
                '@keyframes onion-pulse': {
                  '0%, 100%': { opacity: 0.4 },
                  '50%': { opacity: 0.8 },
                },
              } }
            />
          }
        >
          <motion.div
            style={ { width: '100%', height: '100%' } }
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.35, ease: 'easeOut' } }
          >
            <OnionVisualization
              layers={ layers }
              peeledCount={ peeledCount }
              isAnimating={ isAnimating }
              onPeelComplete={ handlePeelComplete }
              onClick={ handleClick }
              height="100%"
              sx={ { width: '100%' } }
            />
          </motion.div>
        </Suspense>
      </Box>

      {/* 커서 감지 영역 — 양파가 실제로 보이는 중앙 영역만 */}
      <Box
        ref={ cursorAreaRef }
        sx={ {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(200px, 38vmin, 480px)',
          height: 'clamp(260px, 54vmin, 640px)',
          pointerEvents: 'none',
          zIndex: 1,
        } }
      />

      {/* 클릭 힌트 — 양파 하단 근처 */}
      <AnimatePresence>
        { !hasStarted && !isComplete && (
          <motion.div
            style={ {
              position: 'absolute',
              bottom: '20%',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 3,
              pointerEvents: 'none',
            } }
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
              } }
            >
              Click to peel
            </Typography>
          </motion.div>
        ) }
      </AnimatePresence>

      {/* 스킬 패널 왼쪽 — 카테고리명 (데스크탑) */}
      <AnimatePresence>
        { hasStarted && !isComplete && currentLayer && (
          <motion.div
            key={ `left-${peeledCount}` }
            initial={ { opacity: 0, x: -20 } }
            animate={ { opacity: isAnimating ? 0 : 1, x: isAnimating ? -20 : 0 } }
            exit={ { opacity: 0, x: -20 } }
            transition={ { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
            style={ {
              position: 'absolute',
              right: 'calc(50% + 27vw)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              textAlign: 'right',
              maxWidth: 220,
              pointerEvents: 'none',
            } }
          >
            <Box sx={ { display: { xs: 'none', md: 'block' } } }>
              <Typography
                variant="caption"
                sx={ {
                  display: 'block',
                  mb: 1,
                  color: currentLayer.color,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  fontSize: 11,
                } }
              >
                LAYER { peeledCount } / { layers.length }
              </Typography>
              <Typography
                variant="h5"
                sx={ { fontWeight: 700, color: 'common.white', lineHeight: 1.2 } }
              >
                { currentLayer.category }
              </Typography>
            </Box>
          </motion.div>
        ) }
      </AnimatePresence>

      {/* 스킬 패널 오른쪽 — 키워드 칩 (데스크탑) */}
      <AnimatePresence>
        { hasStarted && !isComplete && currentLayer && (
          <motion.div
            key={ `right-${peeledCount}` }
            initial={ { opacity: 0, x: 20 } }
            animate={ { opacity: isAnimating ? 0 : 1, x: isAnimating ? 20 : 0 } }
            exit={ { opacity: 0, x: 20 } }
            transition={ { duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: 0.05 } }
            style={ {
              position: 'absolute',
              left: 'calc(50% + 27vw)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              maxWidth: 220,
              pointerEvents: 'none',
            } }
          >
            <Box
              sx={ {
                display: { xs: 'none', md: 'flex' },
                flexWrap: 'wrap',
                gap: 1,
              } }
            >
              { currentLayer.keywords.map((kw) => (
                <motion.div
                  key={ kw }
                  initial={ { opacity: 0, scale: 0.85 } }
                  animate={ { opacity: 1, scale: 1 } }
                  transition={ { duration: 0.3, ease: 'easeOut' } }
                >
                  <Box
                    component="span"
                    sx={ {
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: 500,
                    } }
                  >
                    { kw }
                  </Box>
                </motion.div>
              )) }
            </Box>
          </motion.div>
        ) }
      </AnimatePresence>

      {/* 하단 중앙 — 서브텍스트(초기) / 스킬패널(모바일) */}
      <Box
        sx={ {
          position: 'absolute',
          bottom: { xs: 32, md: 48 },
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 3, md: 6 },
          zIndex: 2,
        } }
      >
        <AnimatePresence mode="wait">
          { !isComplete && (
            <motion.div
              key="bottom-main"
              initial={ { opacity: 0, y: 16 } }
              animate={ { opacity: 1, y: 0 } }
              exit={ { opacity: 0, transition: { duration: 0.3 } } }
              transition={ { duration: 0.5, ease: 'easeOut' } }
              style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 } }
            >
              { !hasStarted && (
                <Typography
                  variant="h6"
                  sx={ {
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    lineHeight: 1.7,
                    maxWidth: 480,
                    textAlign: 'center',
                  } }
                >
                  Great UX goes deeper than the surface — click to peel back the layers and explore my design capabilities.
                </Typography>
              ) }
              {/* 모바일 전용 — 데스크탑은 좌우 패널로 표시 */}
              { hasStarted && currentLayer && (
                <Box sx={ { display: { xs: 'block', md: 'none' } } }>
                  <SkillRevealPanel
                    category={ currentLayer.category }
                    keywords={ currentLayer.keywords }
                    accentColor={ currentLayer.color }
                    isVisible={ !isAnimating }
                    layerNumber={ peeledCount }
                    totalLayers={ layers.length }
                  />
                </Box>
              ) }
            </motion.div>
          ) }
        </AnimatePresence>
      </Box>

      {/* 완료 CTA — 항상 화면 중앙 고정. 하단 섹션과 컨테이너 분리하여
          peel again 시 exit 애니메이션이 중앙에서 재생되도록 함. */}
      <Box
        sx={ {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 3, md: 6 },
          zIndex: 2,
          pointerEvents: isComplete ? 'auto' : 'none',
        } }
      >
        <AnimatePresence>
          { isComplete && (
            <motion.div
              key="complete"
              variants={ completionVariants }
              initial="hidden"
              animate="visible"
              exit={ { opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: 'easeIn' } } }
              style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 } }
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
                    textAlign: 'center',
                    display: 'block',
                  } }
                >
                  You&apos;ve peeled it all.
                </Typography>
              </motion.div>

              <motion.div variants={ completionItemVariants }>
                <Typography
                  variant="h3"
                  sx={ {
                    fontWeight: 700,
                    color: 'common.white',
                    lineHeight: 1.15,
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  } }
                >
                  No more tears, just great UX.
                </Typography>
              </motion.div>

              <motion.div
                variants={ completionItemVariants }
                style={ { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' } }
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
                  Let&apos;s Connect
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
