let audioCtx = null;

async function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  return audioCtx;
}

function makeNoiseBurst(ctx, startTime, duration, freqStart, freqEnd, peakGain, attackTime) {
  const bufLen = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buf;

  // 저음 차단
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;

  // 고역 스윕 (샤→샥 질감)
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(freqStart, startTime);
  bp.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
  bp.Q.value = 2.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  noise.connect(hp);
  hp.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);
  noise.start(startTime);
  noise.stop(startTime + duration);
}

/**
 * AudioContext를 사용자 제스처 안에서 초기화하고 iOS 오디오 잠금 해제.
 * iOS Safari는 resume()만으로는 부족하고, 실제로 무음 버퍼를 재생해야
 * 오디오 시스템이 완전히 잠금 해제된다.
 * 사운드 토글 버튼 클릭 시 호출.
 */
export async function initAudio() {
  const ctx = await getCtx();

  // iOS 오디오 잠금 해제: 1샘플짜리 무음 버퍼를 직접 제스처 안에서 재생
  const silentBuf = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = silentBuf;
  src.connect(ctx.destination);
  src.start(0);
}

/**
 * "샤샥" 껍질 벗기기 효과음.
 * 고주파 노이즈 버스트 2개를 짧게 연달아 재생.
 * 저음 없음, 총 0.16s — 가볍고 빠른 마찰음.
 */
export async function playPeelSound() {
  const ctx = await getCtx();
  const now = ctx.currentTime;

  // "샤" — 선행 스윕, 더 밝고 부드럽게
  makeNoiseBurst(ctx, now,        0.10, 7500, 3500, 0.35, 0.006);
  // "샥" — 후속 스냅, 약간 낮고 짧게
  makeNoiseBurst(ctx, now + 0.06, 0.09, 5500, 2200, 0.28, 0.004);
}
