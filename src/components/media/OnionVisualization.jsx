import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Box from '@mui/material/Box';

/** 레이어 인덱스 → 구체 반지름 (바깥에서 안쪽, 일정 간격으로 감소) */
const getRadius = (index) => 1.6 - index * 0.155;

/** 껍질 비산 애니메이션 variants 외부 정의 (매 렌더마다 재생성 방지) */
const PEEL_SPEED = 1.8;

/**
 * OnionLayerMesh
 *
 * 개별 양파 껍질 레이어. isPeeling이 true일 때 useFrame으로
 * position · rotation · opacity를 직접 조작 (React 상태 사용 안 함).
 */
function OnionLayerMesh({ layer, index, isPeeling, onPeelComplete }) {
  const meshRef = useRef();
  const animRef = useRef({ progress: 0, completed: false, dx: 0, dy: 0, dz: 0, rotX: 0, rotZ: 0 });

  useEffect(() => {
    if (isPeeling) {
      const angle = Math.random() * Math.PI * 2;
      animRef.current = {
        progress: 0,
        completed: false,
        dx: Math.cos(angle) * 0.9,
        dy: 0.4 + Math.random() * 0.5,
        dz: Math.sin(angle) * 0.9,
        rotX: (Math.random() - 0.5) * 5,
        rotZ: (Math.random() - 0.5) * 4,
      };
    } else {
      // 애니메이션 리셋
      animRef.current.completed = false;
      animRef.current.progress = 0;
      if (meshRef.current) {
        meshRef.current.position.set(0, 0, 0);
        meshRef.current.rotation.set(0, 0, 0);
        meshRef.current.scale.setScalar(1);
        if (meshRef.current.material) {
          meshRef.current.material.opacity = 1;
        }
      }
    }
  }, [isPeeling]);

  useFrame((_, delta) => {
    const anim = animRef.current;
    if (!isPeeling || !meshRef.current || anim.completed) return;

    anim.progress = Math.min(1, anim.progress + delta * PEEL_SPEED);
    const t = anim.progress;
    // easeInOut cubic
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    meshRef.current.position.set(
      anim.dx * eased * 4.5,
      anim.dy * eased * 3.5,
      anim.dz * eased * 4.5
    );
    meshRef.current.rotation.x += delta * anim.rotX;
    meshRef.current.rotation.z += delta * anim.rotZ;
    meshRef.current.material.opacity = Math.max(0, 1 - eased * 1.5);
    meshRef.current.scale.setScalar(1 + eased * 0.35);

    if (anim.progress >= 1 && !anim.completed) {
      anim.completed = true;
      onPeelComplete?.();
    }
  });

  const radius = getRadius(index);
  const roughness = Math.max(0.5, 0.88 - index * 0.05);
  const metalness = 0.02 + index * 0.004;

  return (
    <mesh
      ref={ meshRef }
      scale={ [1, 1.28, 1] }
    >
      <sphereGeometry args={ [radius, 48, 48] } />
      <meshStandardMaterial
        color={ layer.color }
        emissive={ layer.emissiveColor || '#000000' }
        emissiveIntensity={ 0.08 }
        roughness={ roughness }
        metalness={ metalness }
        transparent
        opacity={ 1 }
      />
    </mesh>
  );
}

/**
 * OnionScene — Canvas 내부 장면 컴포넌트
 */
function OnionScene({ layers, peeledCount, isAnimating, onPeelComplete, onCanvasClick }) {
  return (
    <>
      {/* 카메라 */}
      <PerspectiveCamera makeDefault position={ [0, 0.4, 5.5] } fov={ 38 } />

      {/* 조명 */}
      <ambientLight intensity={ 0.18 } />
      {/* 키 라이트 — 좌상단, 따뜻한 톤 */}
      <directionalLight position={ [-3, 5, 3] } intensity={ 2.2 } color="#FFF5E0" castShadow />
      {/* 림 라이트 — 우후방, 차가운 톤 */}
      <directionalLight position={ [4, 2, -5] } intensity={ 0.5 } color="#B0C8FF" />
      {/* 하단 보조광 — 약한 반사 효과 */}
      <directionalLight position={ [0, -4, 2] } intensity={ 0.15 } color="#FFF0D0" />

      {/* 양파 레이어 그룹 */}
      <group
        onClick={ (e) => {
          e.stopPropagation();
          onCanvasClick?.();
        } }
      >
        { layers.map((layer, index) => {
          // 이미 벗겨진 레이어는 렌더링 제외 (단, 현재 애니메이션 중인 레이어는 유지)
          const alreadyPeeled = index < peeledCount;
          const isCurrentlyPeeling = isAnimating && index === peeledCount;

          if (alreadyPeeled && !isCurrentlyPeeling) return null;

          return (
            <OnionLayerMesh
              key={ layer.id }
              layer={ layer }
              index={ index }
              isPeeling={ isCurrentlyPeeling }
              onPeelComplete={ onPeelComplete }
            />
          );
        }) }
      </group>
    </>
  );
}

/**
 * OnionVisualization 컴포넌트
 *
 * Three.js + @react-three/fiber 기반 3D 양파 비주얼라이제이션.
 * SphereGeometry 레이어를 겹쳐 양파를 표현하며, 클릭 시 껍질이
 * 구부러지며 날아가는 애니메이션을 재생한다.
 *
 * Props:
 * @param {Array} layers - 레이어 데이터 배열 (skillLayers 형식) [Required]
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수 (0-based) [Required]
 * @param {boolean} isAnimating - 껍질 벗기기 애니메이션 진행 여부 [Required]
 * @param {function} onPeelComplete - 껍질 벗기기 애니메이션 완료 콜백 [Required]
 * @param {function} onClick - 클릭 이벤트 핸들러 [Required]
 * @param {string} height - Canvas 높이 [Optional, 기본값: '480px']
 * @param {object} sx - 컨테이너 추가 스타일 [Optional]
 *
 * Example usage:
 * <OnionVisualization
 *   layers={skillLayers}
 *   peeledCount={0}
 *   isAnimating={false}
 *   onPeelComplete={() => {}}
 *   onClick={() => {}}
 * />
 */
function OnionVisualization({
  layers,
  peeledCount,
  isAnimating,
  onPeelComplete,
  onClick,
  height = '480px',
  sx = {},
}) {
  return (
    <Box
      sx={ {
        width: '100%',
        height,
        position: 'relative',
        cursor: isAnimating ? 'default' : 'none',
        ...sx,
      } }
    >
      <Canvas
        gl={ { antialias: true, alpha: true } }
        style={ { background: 'transparent' } }
      >
        <Suspense fallback={ null }>
          <OnionScene
            layers={ layers }
            peeledCount={ peeledCount }
            isAnimating={ isAnimating }
            onPeelComplete={ onPeelComplete }
            onCanvasClick={ onClick }
          />
        </Suspense>
      </Canvas>
    </Box>
  );
}

export { OnionVisualization };
