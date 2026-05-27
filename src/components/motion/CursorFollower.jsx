import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';

const CURSOR_SIZE = 88;

const labelVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.75, transition: { duration: 0.1 } },
};

/**
 * 3-state variants — opacity로 visibility 제어.
 * AnimatePresence mount/unmount 대신 항상 DOM에 존재하고 opacity만 전환.
 * scale 사용: GPU Composite 단계만 발생 (width/height는 Layout 유발).
 */
const cursorVariants = {
  hidden: {
    opacity: 0,
    scale: 0.4,
    backgroundColor: 'rgba(255,255,255,0)',
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  idle: {
    opacity: 0,
    scale: 0.4,
    backgroundColor: 'rgba(255,255,255,0)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hover: {
    opacity: 1,
    scale: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    transition: { duration: 0.2, ease: 'easeOut' },
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
  /**
   * 단일 state로 통합: 'hidden' | 'idle' | 'hover'
   * isVisible + isHovered 두 개를 분리하면 각각 별도 리렌더 발생
   */
  const [cursorState, setCursorState] = useState('hidden');
  const cursorStateRef = useRef('hidden');

  const isTouchDevice = useRef(false);

  /** getBoundingClientRect 캐시 — resize/scroll에서만 갱신 */
  const rectCache = useRef(null);

  /**
   * useSpring 제거 — useMotionValue 직접 사용.
   * Spring은 의도적 lag을 만들어 마우스를 뒤늦게 따라감 → "버벅거리는 느낌"의 원인.
   * 위치는 즉각 반영하고, 부드러운 전환은 scale/opacity variants가 담당.
   */
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  /** rect 캐싱 — mousemove 대신 resize/scroll 이벤트에서 갱신 */
  useEffect(() => {
    const updateRect = () => {
      rectCache.current = targetRef?.current?.getBoundingClientRect() ?? null;
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetRef]);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice.current || isDisabled) {
      cursorStateRef.current = 'hidden';
      return;
    }

    const onMove = (e) => {
      x.set(e.clientX - CURSOR_SIZE / 2);
      y.set(e.clientY - CURSOR_SIZE / 2);

      const rect = rectCache.current;
      const isOver = rect
        ? e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        : false;

      const nextState = isOver ? 'hover' : 'idle';

      /** 값이 바뀔 때만 setState — 중복 리렌더 방지 */
      if (nextState !== cursorStateRef.current) {
        cursorStateRef.current = nextState;
        setCursorState(nextState);
      }
    };

    const onLeave = () => {
      cursorStateRef.current = 'hidden';
      setCursorState('hidden');
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y, targetRef, isDisabled]);

  /** target 위에서 기본 커서 숨김 */
  useEffect(() => {
    const el = targetRef?.current;
    if (!el || isTouchDevice.current || isDisabled) return;
    el.style.cursor = 'none';
    return () => { el.style.cursor = ''; };
  }, [targetRef, isDisabled]);

  if (isTouchDevice.current || isDisabled) return null;

  return (
    /**
     * AnimatePresence 제거 — mount/unmount 대신 항상 DOM에 존재.
     * 첫 마우스 진입 시 React mount 비용 + Three.js 프레임과의 충돌 제거.
     * willChange: 'transform' → 별도 GPU 컴포지팅 레이어로 격리.
     */
    <motion.div
      style={ {
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.75)',
        boxSizing: 'border-box',
        willChange: 'transform',
      } }
      variants={ cursorVariants }
      animate={ cursorState }
      initial="hidden"
    >
      <AnimatePresence>
        { cursorState === 'hover' && (
          <motion.span
            key="label"
            variants={ labelVariants }
            initial="hidden"
            animate="visible"
            exit="exit"
            style={ {
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.18em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            } }
          >
            { label }
          </motion.span>
        ) }
      </AnimatePresence>
    </motion.div>
  );
}

export { CursorFollower };
