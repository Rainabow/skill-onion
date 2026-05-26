import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Box from '@mui/material/Box';

const NUM_SEGMENTS = 12;
const PEEL_SPEED = 1.8;
const STAGGER_INTERVAL = 0.05; // 세그먼트 간 출발 간격 (초)
const SEG_GAP = 1.0; // 세그먼트 실제 점유 비율 (1 - 간격 비율)

/** 레이어 인덱스 → 구체 반지름 (바깥→안) */
const getRadius = (index) => 1.6 - index * 0.155;

/**
 * 양파 단면 프로파일 (unit scale, max x = 1)
 * 레퍼런스 이미지 기준: 아래 납작 → 중간 볼록 → neck 좁음
 */
const ONION_PROFILE = [
  [0.00, -0.88],
  [0.42, -0.83],
  [0.80, -0.52],
  [1.00, -0.05],
  [0.96,  0.32],
  [0.75,  0.62],
  [0.45,  0.80],
  [0.18,  0.92],
  [0.00,  1.00],
];

/**
 * 레이어 하나의 각도 세그먼트 geometry.
 * SEG_GAP < 1 → 세그먼트 사이에 물리적 간격이 생겨 세로 리브 라인이 뚜렷해짐.
 * 각 세그먼트의 phiStart는 간격 중앙에 오도록 offset.
 */
function createSegmentGeometry(radius, segIndex) {
  const slotAngle = (1 / NUM_SEGMENTS) * Math.PI * 2;
  const phiLength = slotAngle * SEG_GAP;
  const phiStart = segIndex * slotAngle + slotAngle * (1 - SEG_GAP) / 2;
  const points = ONION_PROFILE.map(([x, y]) => new THREE.Vector2(x * radius, y * radius));
  const geometry = new THREE.LatheGeometry(points, 6, phiStart, phiLength);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 속살 세그먼트 geometry.
 * 외곽 세그먼트와 동일한 각도 분할 + 각자 computeVertexNormals →
 * 경계마다 법선 불연속 → 외곽과 동일한 세로 리브 조명 효과.
 */
function createFleshSegmentGeometry(radius, segIndex) {
  const slotAngle = (1 / NUM_SEGMENTS) * Math.PI * 2;
  const r = radius * 0.94;
  const points = ONION_PROFILE.map(([x, y]) => new THREE.Vector2(x * r, y * r));
  const geometry = new THREE.LatheGeometry(points, 6, segIndex * slotAngle, slotAngle);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 초록 줄기 — 레이어와 독립, 항상 렌더.
 * peeledCount에 따라 현재 최외곽 레이어의 neck 위치로 이동하고 비율 축소.
 *
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수
 */
function OnionStem({ peeledCount = 0 }) {
  const currentRadius = getRadius(peeledCount);
  const scale = currentRadius / getRadius(0);
  const baseY = currentRadius * 0.91;

  const leaves = [
    { rotY: 0,                   tiltZ: 0.35 },
    { rotY: (Math.PI * 2) / 3,   tiltZ: 0.28 },
    { rotY: (Math.PI * 4) / 3,   tiltZ: 0.30 },
  ];

  return (
    <group position={ [0, baseY, 0] } scale={ [scale, scale, scale] }>
      {/* neck → stem 연결 connector cone */}
      <mesh>
        <cylinderGeometry args={ [0.06, 0.20, 0.22, 10] } />
        <meshStandardMaterial color="#4A3010" roughness={ 0.85 } />
      </mesh>
      {/* 줄기 기둥 */}
      <mesh position={ [0, 0.18, 0] }>
        <cylinderGeometry args={ [0.045, 0.06, 0.14, 8] } />
        <meshStandardMaterial color="#2D5A27" roughness={ 0.80 } />
      </mesh>
      {/* 잎 3개 */}
      { leaves.map((leaf, i) => (
        <group key={ i } rotation={ [0, leaf.rotY, leaf.tiltZ] }>
          <mesh position={ [0, 0.40, 0] }>
            <coneGeometry args={ [0.055, 0.46, 8] } />
            <meshStandardMaterial color="#4A8C3F" roughness={ 0.65 } />
          </mesh>
        </group>
      )) }
    </group>
  );
}

/**
 * OnionSegmentMesh
 *
 * 레이어 하나의 쐐기 세그먼트.
 * isPeeling = true 시 자신의 방위각 방향으로 날아가며 사라진다.
 * elapsedTime 기반 stagger로 segIndex 순서대로 출발.
 *
 * Props:
 * @param {object} layer - 레이어 데이터 [Required]
 * @param {number} index - 레이어 인덱스 [Required]
 * @param {number} segIndex - 세그먼트 인덱스 (0 ~ NUM_SEGMENTS-1) [Required]
 * @param {boolean} isPeeling - 이 레이어가 현재 벗겨지는 중인지 [Required]
 * @param {boolean} isLastSegment - 마지막 세그먼트 여부 → onPeelComplete 트리거 [Required]
 * @param {function} onPeelComplete - 마지막 세그먼트 완료 시 콜백 [Required]
 */
function OnionSegmentMesh({ layer, index, segIndex, isPeeling, isLastSegment, onPeelComplete }) {
  const meshRef = useRef();
  const animRef = useRef({ elapsedTime: 0, completed: false });

  const geometry = useMemo(
    () => createSegmentGeometry(getRadius(index), segIndex),
    [index, segIndex]
  );

  // 이 세그먼트의 방위각 중심 방향 (radially outward)
  const midAngle = ((segIndex + 0.5) / NUM_SEGMENTS) * Math.PI * 2;
  const dirX = Math.cos(midAngle);
  const dirZ = Math.sin(midAngle);
  const startDelay = segIndex * STAGGER_INTERVAL;

  useEffect(() => {
    if (!isPeeling) {
      animRef.current = { elapsedTime: 0, completed: false };
      const m = meshRef.current;
      if (m) {
        m.position.set(0, 0, 0);
        m.rotation.set(0, 0, 0);
        m.scale.setScalar(1);
        if (m.material) m.material.opacity = 1;
      }
    }
  }, [isPeeling]);

  useFrame((_, delta) => {
    const anim = animRef.current;
    if (!isPeeling || !meshRef.current || anim.completed) return;

    anim.elapsedTime += delta;
    const t = Math.min(1, Math.max(0, anim.elapsedTime - startDelay) * PEEL_SPEED);
    if (t <= 0) return;

    // easeInOut cubic
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const m = meshRef.current;

    // 방위각 방향으로 날아가며 위로 솟음
    m.position.set(dirX * eased * 3.8, eased * 2.0, dirZ * eased * 3.8);
    // 날아가며 회전
    m.rotation.y += delta * (dirZ > 0 ? 2.8 : -2.8);
    m.rotation.x += delta * 1.2;
    m.material.opacity = Math.max(0, 1 - eased * 1.8);
    m.scale.setScalar(1 + eased * 0.18);

    if (t >= 1 && !anim.completed) {
      anim.completed = true;
      if (isLastSegment) onPeelComplete?.();
    }
  });

  const roughness = Math.max(0.5, 0.88 - index * 0.05);
  const metalness = 0.02 + index * 0.004;

  return (
    <mesh ref={ meshRef } geometry={ geometry }>
      <meshPhysicalMaterial
        color={ layer.color }
        emissive={ layer.emissiveColor || '#000000' }
        emissiveIntensity={ 0.08 }
        roughness={ roughness }
        metalness={ metalness }
        clearcoat={ 0.3 }
        clearcoatRoughness={ 0.6 }
        transparent
        opacity={ 1 }
        side={ THREE.DoubleSide }
      />
    </mesh>
  );
}

/**
 * OnionLayer
 *
 * 하나의 스킬 레이어 = 속살 shell + NUM_SEGMENTS 쐐기 세그먼트.
 * 완전히 벗겨진 레이어(alreadyPeeled)는 null 반환.
 */
function OnionLayer({ layer, index, nextColor, peeledCount, isAnimating, onPeelComplete }) {
  // hooks는 조건부 return 전에 모두 선언
  const fleshGeometries = useMemo(
    () => Array.from({ length: NUM_SEGMENTS }, (_, i) => createFleshSegmentGeometry(getRadius(index), i)),
    [index]
  );

  const alreadyPeeled = index < peeledCount;
  const isCurrentlyPeeling = isAnimating && index === peeledCount;

  if (alreadyPeeled && !isCurrentlyPeeling) return null;

  const isCurrentOuter = index === peeledCount;
  const fleshColor = nextColor || '#F5EBD4';

  return (
    <group>
      {/* 속살 — 다음 레이어 색상 + 외곽과 동일한 세로 리브 */}
      { isCurrentOuter && fleshGeometries.map((geo, i) => (
        <mesh key={ i } geometry={ geo }>
          <meshPhysicalMaterial
            color={ fleshColor }
            roughness={ 0.55 }
            metalness={ 0 }
            clearcoat={ 0.15 }
            clearcoatRoughness={ 0.7 }
          />
        </mesh>
      )) }
      {/* 쐐기 세그먼트 */}
      { Array.from({ length: NUM_SEGMENTS }, (_, segIndex) => (
        <OnionSegmentMesh
          key={ segIndex }
          layer={ layer }
          index={ index }
          segIndex={ segIndex }
          isPeeling={ isCurrentlyPeeling }
          isLastSegment={ segIndex === NUM_SEGMENTS - 1 }
          onPeelComplete={ onPeelComplete }
        />
      )) }
    </group>
  );
}

/**
 * OnionScene — Canvas 내부 장면 컴포넌트
 */
function OnionScene({ layers, peeledCount, isAnimating, onPeelComplete, onCanvasClick }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={ [0, 0.3, 5.8] } fov={ 40 } />

      {/* 키 라이트 — 좌상단 따뜻한 톤 */}
      <ambientLight intensity={ 0.15 } />
      <directionalLight position={ [-3, 5, 3] } intensity={ 2.5 } color="#FFF5E0" castShadow />
      {/* 림 라이트 — 우후방 쿨톤, 세그먼트 경계 분리 */}
      <directionalLight position={ [4, 2, -5] } intensity={ 0.55 } color="#B0C8FF" />
      {/* 하단 fill */}
      <directionalLight position={ [0, -4, 2] } intensity={ 0.15 } color="#FFF0D0" />

      {/* 줄기 — 레이어가 벗겨질수록 축소, 모두 벗겨지면 숨김 */}
      { peeledCount < layers.length && <OnionStem peeledCount={ peeledCount } /> }

      {/* 양파 레이어 그룹 — 클릭 이벤트 수신 */}
      <group onClick={ (e) => { e.stopPropagation(); onCanvasClick?.(); } }>
        { layers.map((layer, index) => (
          <OnionLayer
            key={ layer.id }
            layer={ layer }
            index={ index }
            nextColor={ layers[index + 1]?.color }
            peeledCount={ peeledCount }
            isAnimating={ isAnimating }
            onPeelComplete={ onPeelComplete }
          />
        )) }
      </group>
    </>
  );
}

/**
 * OnionVisualization 컴포넌트
 *
 * Three.js + @react-three/fiber 기반 3D 양파.
 * 각 레이어는 NUM_SEGMENTS 개의 쐐기로 분할되어 클릭 시 순차 박리 애니메이션을 재생한다.
 *
 * Props:
 * @param {Array} layers - 레이어 데이터 배열 (skillLayers 형식) [Required]
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수 [Required]
 * @param {boolean} isAnimating - 껍질 벗기기 애니메이션 진행 여부 [Required]
 * @param {function} onPeelComplete - 마지막 세그먼트 완료 콜백 [Required]
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
