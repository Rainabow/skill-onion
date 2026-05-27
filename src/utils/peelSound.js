let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
 * AudioContext를 사용자 제스처 안에서 미리 초기화/resume.
 * 모바일 브라우저(iOS Safari 등)는 직접적인 유저 제스처 내에서
 * AudioContext를 생성하거나 resume해야 소리가 재생된다.
 * 사운드 토글 버튼 클릭 시 호출하여 컨텍스트를 잠금 해제해 둔다.
 */
export function initAudio() {
  getCtx();
}

/**
 * "샤샥" 껍질 벗기기 효과음.
 * 고주파 노이즈 버스트 2개를 짧게 연달아 재생.
 * 저음 없음, 총 0.16s — 가볍고 빠른 마찰음.
 */
export function playPeelSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // "샤" — 선행 스윕, 더 밝고 부드럽게
  makeNoiseBurst(ctx, now,        0.10, 7500, 3500, 0.35, 0.006);
  // "샥" — 후속 스냅, 약간 낮고 짧게
  makeNoiseBurst(ctx, now + 0.06, 0.09, 5500, 2200, 0.28, 0.004);
}
