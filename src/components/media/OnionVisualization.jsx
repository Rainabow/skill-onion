import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Box from '@mui/material/Box';

const NUM_SEGMENTS = 12;
const PEEL_SPEED = 1.8;
const STAGGER_INTERVAL = 0.05;
const SEG_GAP = 1.0; // 세그먼트 간 물리 갭 없음

/** 레이어 인덱스 → 구체 반지름 (바깥→안) */
const getRadius = (index) => 1.6 - index * 0.155;

/**
 * 클레이 스타일 양파 단면 프로파일
 * 하단 납작+넓음, 최대폭 낮게, neck 좁게 → 귀여운 볼륨감
 */
const ONION_PROFILE = [
  [0.00, -0.95],
  [0.55, -0.90],
  [0.90, -0.52],
  [1.00, -0.12],
  [0.92,  0.28],
  [0.70,  0.56],
  [0.40,  0.76],
  [0.12,  0.90],
  [0.00,  1.00],
];

/**
 * Canvas 기반 클레이 matcap 텍스처 생성
 *
 * Blender Principled BSDF 인사이트 반영:
 * - Roughness 0.35 → 날카로운 스페큘러 핫스팟
 * - Specular 0.5 → 밝은 하이라이트 피크
 * - SSS 0.05~0.1 → 경계부 따뜻한 앰버 글로우로 시뮬레이션
 * - 하단 바운스 라이트 → 지면 반사 따뜻한 fill
 *
 * MeshMatcapMaterial의 color prop으로 레이어별 색상을 틴팅한다.
 */
function createClayMatcap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2, r = size / 2;

  const clip = () => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  };

  // base mid-tone
  clip();
  ctx.fillStyle = '#9E9890';
  ctx.fill();

  // primary specular highlight — upper-left, roughness 0.35 기준 날카로운 핫스팟
  const hl = ctx.createRadialGradient(cx * 0.50, cy * 0.40, 0, cx * 0.50, cy * 0.40, r * 0.65);
  hl.addColorStop(0,    'rgba(255,255,252,0.96)');
  hl.addColorStop(0.18, 'rgba(255,248,232,0.72)');
  hl.addColorStop(0.50, 'rgba(230,208,172,0.28)');
  hl.addColorStop(1,    'rgba(0,0,0,0)');
  clip(); ctx.fillStyle = hl; ctx.fill();

  // secondary soft fill — center-right
  const hl2 = ctx.createRadialGradient(cx * 0.90, cy * 0.74, 0, cx * 0.90, cy * 0.74, r * 0.40);
  hl2.addColorStop(0, 'rgba(255,238,195,0.20)');
  hl2.addColorStop(1, 'rgba(0,0,0,0)');
  clip(); ctx.fillStyle = hl2; ctx.fill();

  // shadow — lower-right
  const sh = ctx.createRadialGradient(cx * 1.38, cy * 1.45, 0, cx * 1.38, cy * 1.45, r * 0.84);
  sh.addColorStop(0, 'rgba(24,8,0,0.64)');
  sh.addColorStop(1, 'rgba(0,0,0,0)');
  clip(); ctx.fillStyle = sh; ctx.fill();

  // SSS 경계 글로우 — 얇은 부분에서 빛이 투과되는 따뜻한 앰버
  const sss = ctx.createRadialGradient(cx, cy, r * 0.60, cx, cy, r);
  sss.addColorStop(0,   'rgba(0,0,0,0)');
  sss.addColorStop(0.72, 'rgba(0,0,0,0)');
  sss.addColorStop(1,   'rgba(190,80,10,0.32)');
  clip(); ctx.fillStyle = sss; ctx.fill();

  // 하단 바운스 라이트 — 지면 반사 warm fill
  const bounce = ctx.createRadialGradient(cx, cy * 1.82, 0, cx, cy * 1.82, r * 0.58);
  bounce.addColorStop(0, 'rgba(210,118,38,0.16)');
  bounce.addColorStop(1, 'rgba(0,0,0,0)');
  clip(); ctx.fillStyle = bounce; ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 모듈 전역 싱글턴 — 모든 세그먼트가 동일 텍스처 객체 공유
let _clayMatcap = null;
const getClayMatcap = () => {
  if (!_clayMatcap) _clayMatcap = createClayMatcap();
  return _clayMatcap;
};

function createSegmentGeometry(radius, segIndex) {
  const slotAngle = (1 / NUM_SEGMENTS) * Math.PI * 2;
  const phiLength = slotAngle * SEG_GAP;
  const phiStart = segIndex * slotAngle + slotAngle * (1 - SEG_GAP) / 2;
  const points = ONION_PROFILE.map(([x, y]) => new THREE.Vector2(x * radius, y * radius));
  const geometry = new THREE.LatheGeometry(points, 6, phiStart, phiLength);
  geometry.computeVertexNormals();
  return geometry;
}

function createFleshSegmentGeometry(radius, segIndex) {
  const slotAngle = (1 / NUM_SEGMENTS) * Math.PI * 2;
  const points = ONION_PROFILE.map(([x, y]) => new THREE.Vector2(x * radius, y * radius));
  const geometry = new THREE.LatheGeometry(points, 6, segIndex * slotAngle, slotAngle);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 초록 줄기
 *
 * Props:
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수 [Required]
 * @param {boolean} isAnimating - 껍질 벗기기 애니메이션 진행 여부 [Required]
 * @param {number} totalLayers - 전체 레이어 수 [Required]
 */
function OnionStem({ peeledCount = 0, isAnimating = false, totalLayers = 1 }) {
  const stemIndex = isAnimating ? Math.min(peeledCount + 1, totalLayers - 1) : peeledCount;
  const currentRadius = getRadius(stemIndex);
  const scale = currentRadius / getRadius(0);
  const baseY = currentRadius * 0.91;

  const leaves = [
    { rotY: 0,                   tiltZ: 0.35 },
    { rotY: (Math.PI * 2) / 3,   tiltZ: 0.28 },
    { rotY: (Math.PI * 4) / 3,   tiltZ: 0.30 },
  ];

  return (
    <group position={ [0, baseY, 0] } scale={ [scale, scale, scale] }>
      <mesh>
        <cylinderGeometry args={ [0.06, 0.20, 0.22, 10] } />
        <meshStandardMaterial color="#4A3010" roughness={ 0.85 } />
      </mesh>
      <mesh position={ [0, 0.18, 0] }>
        <cylinderGeometry args={ [0.045, 0.06, 0.14, 8] } />
        <meshStandardMaterial color="#2D5A27" roughness={ 0.80 } />
      </mesh>
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
 * 레이어 하나의 쐐기 세그먼트. MeshMatcapMaterial + clay matcap 사용.
 * isPeeling = true 시 방위각 방향으로 날아가며 사라진다.
 *
 * Props:
 * @param {object} layer - 레이어 데이터 [Required]
 * @param {number} index - 레이어 인덱스 [Required]
 * @param {number} segIndex - 세그먼트 인덱스 (0 ~ NUM_SEGMENTS-1) [Required]
 * @param {boolean} isPeeling - 이 레이어가 현재 벗겨지는 중인지 [Required]
 * @param {boolean} isLastSegment - 마지막 세그먼트 여부 [Required]
 * @param {function} onPeelComplete - 마지막 세그먼트 완료 시 콜백 [Required]
 */
function OnionSegmentMesh({ layer, index, segIndex, isPeeling, isLastSegment, onPeelComplete }) {
  const meshRef = useRef();
  const animRef = useRef({ elapsedTime: 0, completed: false });
  const matcap = useMemo(() => getClayMatcap(), []);

  const geometry = useMemo(
    () => createSegmentGeometry(getRadius(index), segIndex),
    [index, segIndex]
  );

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

    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const m = meshRef.current;

    m.position.set(dirX * eased * 3.8, eased * 2.0, dirZ * eased * 3.8);
    m.rotation.y += delta * (dirZ > 0 ? 2.8 : -2.8);
    m.rotation.x += delta * 1.2;
    m.material.opacity = Math.max(0, 1 - eased * 1.8);
    m.scale.setScalar(1 + eased * 0.18);

    /** opacity 0 도달 시점에 완료 처리 — t >= 1 까지 기다리지 않음.
     *  opacity = 1 - eased * 1.8 → eased >= 0.556 이면 invisible.
     *  이 시점이 시각적 완료이므로 즉시 onPeelComplete 트리거. */
    if (m.material.opacity <= 0 && !anim.completed) {
      anim.completed = true;
      if (isLastSegment) onPeelComplete?.();
    }
  });

  return (
    <mesh ref={ meshRef } geometry={ geometry }>
      <meshMatcapMaterial
        matcap={ matcap }
        color={ layer.color }
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
 * 속살과 세그먼트 모두 동일한 clay matcap 재질 사용.
 *
 * Props:
 * @param {object} layer - 레이어 데이터 [Required]
 * @param {number} index - 레이어 인덱스 [Required]
 * @param {object} nextLayer - 다음(안쪽) 레이어 데이터 [Optional]
 * @param {number} peeledCount - 현재까지 벗겨진 레이어 수 [Required]
 * @param {boolean} isAnimating - 껍질 벗기기 애니메이션 진행 여부 [Required]
 * @param {function} onPeelComplete - 마지막 세그먼트 완료 콜백 [Required]
 */
function OnionLayer({ layer, index, nextLayer, peeledCount, isAnimating, onPeelComplete }) {
  const fleshRadius = nextLayer ? getRadius(index + 1) : getRadius(index) * 0.94;
  const matcap = useMemo(() => getClayMatcap(), []);

  const fleshGeometries = useMemo(
    () => Array.from({ length: NUM_SEGMENTS }, (_, i) => createFleshSegmentGeometry(fleshRadius, i)),
    [fleshRadius]
  );

  const alreadyPeeled = index < peeledCount;
  const isCurrentlyPeeling = isAnimating && index === peeledCount;

  if (alreadyPeeled && !isCurrentlyPeeling) return null;
  if (index > peeledCount) return null;

  const isCurrentOuter = index === peeledCount;

  return (
    <group>
      { isCurrentOuter && nextLayer && fleshGeometries.map((geo, i) => (
        <mesh key={ i } geometry={ geo }>
          <meshMatcapMaterial
            matcap={ matcap }
            color={ nextLayer.color }
          />
        </mesh>
      )) }
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

/** 양파 아래 타원형 그림자 */
function EllipseShadow() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0,   'rgba(0, 0, 0, 0.72)');
    grd.addColorStop(0.45, 'rgba(0, 0, 0, 0.30)');
    grd.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh rotation={ [-Math.PI / 2, 0, 0] } position={ [0, -1.50, 0] }>
      <planeGeometry args={ [3.2, 1.1] } />
      <meshBasicMaterial map={ texture } transparent depthWrite={ false } />
    </mesh>
  );
}

/**
 * OnionScene — Canvas 내부 장면.
 * mouse parallax: useThree().mouse → spring physics 으로 groupRef 회전.
 * isAnimating 중에는 center(0,0)로 복귀.
 *
 * Spring 파라미터:
 *   STIFFNESS 0.05 — 목표값 향해 당기는 힘 (클수록 빠른 초기 응답)
 *   DAMPING   0.88 — 속도 감쇠 (클수록 오버슈팅 없이 부드럽게 수렴)
 *
 * 방향:
 *   mouse.y 양수(위) → tx 양수 → rotation.x 양수 → 상단이 뒤로 기움 = 위에서 내려다보는 앵글
 *   mouse.y 음수(아래) → tx 음수 → rotation.x 음수 → 하단이 뒤로 기움 = 아래에서 올려다보는 앵글
 */
function OnionScene({ layers, peeledCount, isAnimating, onPeelComplete, onCanvasClick }) {
  const groupRef = useRef();
  const velRef = useRef({ x: 0, y: 0 });
  const { mouse } = useThree();


  const STIFFNESS = 0.05;
  const DAMPING = 0.88;

  useFrame(() => {
    if (!groupRef.current) return;

    const tx = isAnimating ? 0 : mouse.y * 0.22;
    const ty = isAnimating ? 0 : mouse.x * 0.12;

    velRef.current.x += (tx - groupRef.current.rotation.x) * STIFFNESS;
    velRef.current.y += (ty - groupRef.current.rotation.y) * STIFFNESS;
    velRef.current.x *= DAMPING;
    velRef.current.y *= DAMPING;

    groupRef.current.rotation.x += velRef.current.x;
    groupRef.current.rotation.y += velRef.current.y;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={ [0, 0.3, 5.8] } fov={ 40 } />

      {/* 줄기 조명 — matcap 소재는 조명 무관, 줄기(MeshStandard)에만 적용 */}
      <ambientLight intensity={ 0.55 } color="#FFF8F0" />
      {/* 키라이트 — 레퍼런스 기준 좌상단 정면, 따뜻한 웜톤 */}
      <directionalLight position={ [-3.5, 5.5, 4.5] } intensity={ 1.8 } color="#FFE0A8" castShadow />
      {/* 림라이트 — 우하단 쿨톤, 줄기 윤곽선 분리 */}
      <directionalLight position={ [3.5, -1, -3] } intensity={ 0.35 } color="#A8C0FF" />
      {/* 하단 바운스 */}
      <directionalLight position={ [0, -4, 2] } intensity={ 0.08 } color="#FFE8C0" />

      <group>
        <EllipseShadow />

        {/* 패럴랙스 그룹 — 마우스 추적 회전 */}
        <group ref={ groupRef } position={ [0, 0.10, 0] }>
          { peeledCount < layers.length && !(isAnimating && peeledCount === layers.length - 1) && (
            <OnionStem
              peeledCount={ peeledCount }
              isAnimating={ isAnimating }
              totalLayers={ layers.length }
            />
          ) }

          <group onClick={ (e) => { e.stopPropagation(); onCanvasClick?.(); } }>
            { layers.map((layer, index) => (
              <OnionLayer
                key={ layer.id }
                layer={ layer }
                index={ index }
                nextLayer={ layers[index + 1] }
                peeledCount={ peeledCount }
                isAnimating={ isAnimating }
                onPeelComplete={ onPeelComplete }
              />
            )) }
          </group>
        </group>
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={ 0.7 } luminanceSmoothing={ 0.9 } intensity={ 0.55 } mipmapBlur />
        <Vignette offset={ 0.38 } darkness={ 0.62 } />
      </EffectComposer>
    </>
  );
}

/**
 * OnionVisualization 컴포넌트
 *
 * Three.js + @react-three/fiber 기반 3D 클레이 양파.
 * Canvas 기반 matcap 텍스처로 무광 클레이 질감 구현.
 * 마우스 이동 시 시차 tilt 적용 (isAnimating 중 자동 복귀).
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
