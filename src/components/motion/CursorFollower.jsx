import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

const CURSOR_SIZE = 88;
const SPRING_CONFIG = { stiffness: 500, damping: 35, mass: 0.5 };

const labelVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.75, transition: { duration: 0.1 } },
};

const cursorVariants = {
  idle: {
    width: CURSOR_SIZE * 0.4,
    height: CURSOR_SIZE * 0.4,
    backgroundColor: 'rgba(255,255,255,0)',
  },
  hover: {
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
};

/**
 * CursorFollower 컴포넌트
 *
 * 마우스를 따라다니는 원형 커스텀 커서.
 * 타겟 요소에 호버하면 크기가 확장되고 레이블 텍스트가 등장한다.
 * 터치 기기에서는 렌더링되지 않는다.
 *
 * Props:
 * @param {object} targetRef - 호버 감지 대상 DOM ref [Required]
 * @param {string} label - 호버 시 표시할 텍스트 [Optional, 기본값: 'PEEL']
 * @param {boolean} isDisabled - 커서 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * const onionRef = useRef(null);
 * <CursorFollower targetRef={onionRef} label="PEEL" />
 * <div ref={onionRef}>...</div>
 */
function CursorFollower({ targetRef, label = 'PEEL', isDisabled = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isTouchDevice = useRef(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice.current || isDisabled) return;

    const onMove = (e) => {
      rawX.set(e.clientX - CURSOR_SIZE / 2);
      rawY.set(e.clientY - CURSOR_SIZE / 2);
      setIsVisible(true);

      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setIsHovered(
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      }
    };

    const onLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [rawX, rawY, targetRef, isDisabled]);

  // target 위에서 기본 커서 숨김
  useEffect(() => {
    const el = targetRef?.current;
    if (!el || isTouchDevice.current || isDisabled) return;
    el.style.cursor = 'none';
    return () => { el.style.cursor = ''; };
  }, [targetRef, isDisabled]);

  if (isTouchDevice.current || isDisabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x,
            y,
            pointerEvents: 'none',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.75)',
            boxSizing: 'border-box',
          }}
          variants={cursorVariants}
          animate={isHovered ? 'hover' : 'idle'}
          initial="idle"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.span
                key="label"
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                { label }
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { CursorFollower };
