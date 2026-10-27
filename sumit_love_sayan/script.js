// ══════════════════════════════════════
// PARTICLES
// ══════════════════════════════════════
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: -(Math.random() * 0.6 + 0.2),
    alpha: Math.random() * 0.5 + 0.1,
    color: ['#f4a0b5','#d8b4e2','#f0c060','#fce4ec'][Math.floor(Math.random()*4)]
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
    if (p.x < -5 || p.x > canvas.width + 5) p.dx *= -1;
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ══════════════════════════════════════
// SECTION NAVIGATION
// ══════════════════════════════════════
const sections = ['welcome','photos','message','cake-section','celebration','final'];
let current = 0;

function goTo(idx) {
  if (idx === current) return;
  const prev = document.getElementById(sections[current]);
  const next = document.getElementById(sections[idx]);
  prev.style.display = 'none';
  next.style.display = 'flex';
  next.classList.remove('section-enter');
  void next.offsetWidth;
  next.classList.add('section-enter');
  document.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  current = idx;
  onEnter(idx);
  playSectionSong(idx);
}

function onEnter(idx) {
  if (idx === 1) startSlideshow();
  if (idx === 2) startTypewriter();
  if (idx === 4) {
    setTimeout(() => document.getElementById('celeb-msg').classList.add('visible'), 400);
  }
  if (idx === 5) startMontage();
}

// ══════════════════════════════════════
// SLIDESHOW
// ══════════════════════════════════════
let slideIdx = 0, slideTimer;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function setSlide(n) {
  slides[slideIdx].classList.remove('active');
  dots[slideIdx].classList.remove('active');
  slideIdx = n;
  slides[slideIdx].classList.add('active');
  dots[slideIdx].classList.add('active');
}

function startSlideshow() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => setSlide((slideIdx + 1) % 4), 3500);
}



// ══════════════════════════════════════
// TYPEWRITER
// ══════════════════════════════════════
let typewriterDone = false;

const love_msg = `❤️🎂 Happy Birthday, My other half🌹✨❤️
You came into my life and became a part of my heart in ways words can never explain. ✨🥹❤️ Your happiness means more to me than you’ll ever know. I just pray that life is always kind to you and that I get to be by your side through every high and low. No matter what changes, one thing I want you to always remember is that my heart will always choose you. 🫶🏻♾️❤️
Happy Birthday, meri jaan. 
You mean more to me than words could ever say. 🥹❤️`;


function startTypewriter() {
  if (typewriterDone) return;
  typewriterDone = true;
  const el = document.getElementById('typewriter-text');
  el.innerHTML = '<span class="cursor-blink"></span>';
  let i = 0;
  const interval = setInterval(() => {
    if (i >= love_msg.length) {
      clearInterval(interval);
      document.getElementById('msg-next').style.display = 'flex';
      return;
    }
    const ch = love_msg[i];
    const cursor = el.querySelector('.cursor-blink');
    if (ch === '\n') {
      const br = document.createElement('br');
      el.insertBefore(br, cursor);
    } else {
      const span = document.createElement('span');
      span.textContent = ch;
      el.insertBefore(span, cursor);
    }
    i++;
  }, 40);
}

// ══════════════════════════════════════
// BLOW CANDLES
// ══════════════════════════════════════
let candlesOut = false;

function blowCandles() {
  if (candlesOut) return;
  candlesOut = true;
  // Extinguish flames
  ['f1','f2','f3'].forEach((id, i) => {
    setTimeout(() => {
      const f = document.getElementById(id);
      if (f) {
        f.style.transition = 'opacity 0.4s';
        f.style.opacity = '0';
        f.style.animation = 'none';
      }
    }, i * 200);
  });

  // Add smoke effect
  setTimeout(() => {
    launchConfetti();
    setTimeout(() => goTo(4), 1200);
  }, 900);
}

// Microphone blow detection
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const checkBlow = () => {
      if (candlesOut || current !== 3) { requestAnimationFrame(checkBlow); return; }
      analyser.getByteFrequencyData(buf);
      const avg = buf.reduce((a,b) => a+b, 0) / buf.length;
      if (avg > 18) blowCandles();
      requestAnimationFrame(checkBlow);
    };
    checkBlow();
  }).catch(() => {});
}

// ══════════════════════════════════════
// CONFETTI
// ══════════════════════════════════════
const confCanvas = document.getElementById('confetti-canvas');
const cctx = confCanvas.getContext('2d');
let confPieces = [];

function launchConfetti() {
  confCanvas.style.display = 'block';
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
  confPieces = [];
  const colors = ['#f4a0b5','#d8b4e2','#f0c060','#e8728e','#fce4ec','#9b59b6','#fff'];
  for (let i = 0; i < 160; i++) {
    confPieces.push({
      x: Math.random() * confCanvas.width,
      y: -20,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random() * 360,
      drot: (Math.random()-0.5)*6,
      dy: Math.random()*4+2,
      dx: (Math.random()-0.5)*3
    });
  }
  animConf();
}

function animConf() {
  cctx.clearRect(0,0,confCanvas.width,confCanvas.height);
  let alive = false;
  confPieces.forEach(p => {
    p.x += p.dx; p.y += p.dy; p.rot += p.drot;
    if (p.y < confCanvas.height + 20) alive = true;
    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.rot * Math.PI / 180);
    cctx.fillStyle = p.color;
    cctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    cctx.restore();
  });
  if (alive) requestAnimationFrame(animConf);
  else confCanvas.style.display = 'none';
}

// ══════════════════════════════════════
// MONTAGE
// ══════════════════════════════════════
let montIdx = 0, montTimer;

function startMontage() {
  clearInterval(montTimer);
  const mSlides = document.querySelectorAll('.montage-slide');
  montTimer = setInterval(() => {
    mSlides[montIdx].classList.remove('active');
    montIdx = (montIdx + 1) % mSlides.length;
    mSlides[montIdx].classList.add('active');
  }, 2500);
}

// ══════════════════════════════════════
// AUDIO — PER-SECTION MELODIES
// ══════════════════════════════════════
const sectionAudio = document.getElementById('section-audio');
let audioOn = false;
let autoplayArmed = false;

// Put your own songs in a songs folder and keep one file path per page here.
const sectionSongs = [
  'songs/jiya tui chara (from biye bibhrat)-[audiotrimmer.com].mp3',
  'songs/voh dekhnay mein full video - london paris new yorkali zafar, aditi rao hydari-[audiotrimmer.com].mp3',
  'songs/tere bin-[audiotrimmer.com].mp3',
  'songs/tarabin1.mp3',
  'songs/tu hi hai (ali zafar version) (from dear zindagi) (1)-[audiotrimmer.com].mp3',
  'songs/tu hi hai (ali zafar version) (from dear zindagi) (1)-[audiotrimmer.com].mp3',
  
];

function stopMusic() {
  sectionAudio.pause();
  sectionAudio.currentTime = 0;
}

function playSectionSong(idx) {
  stopMusic();
  if (!audioOn) return;

  const nextSong = sectionSongs[idx];
  if (!nextSong) return;

  sectionAudio.src = nextSong;
  sectionAudio.loop = true;
  sectionAudio.play().catch(() => {
    audioOn = false;
    document.getElementById('audio-btn').textContent = '🎵';
    armAutoplayOnFirstInteraction();
  });
}

function enableAudioAndPlayCurrent() {
  audioOn = true;
  document.getElementById('audio-btn').textContent = '🔊';
  playSectionSong(current);
}

function armAutoplayOnFirstInteraction() {
  if (autoplayArmed) return;
  autoplayArmed = true;

  const startAfterInteraction = () => {
    enableAudioAndPlayCurrent();
    window.removeEventListener('pointerdown', startAfterInteraction);
    window.removeEventListener('keydown', startAfterInteraction);
    autoplayArmed = false;
  };

  window.addEventListener('pointerdown', startAfterInteraction, { once: true });
  window.addEventListener('keydown', startAfterInteraction, { once: true });
}

function toggleAudio() {
  const btn = document.getElementById('audio-btn');
  if (!audioOn) {
    audioOn = true;
    btn.textContent = '🔊';
    playSectionSong(current);
  } else {
    audioOn = false;
    btn.textContent = '🎵';
    stopMusic();
  }
}

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
// Show only welcome on load
sections.forEach((id, i) => {
  document.getElementById(id).style.display = i === 0 ? 'flex' : 'none';
});

// (Autoplay line removed — music now starts when she taps YES below)

// ══════════════════════════════════════
// INTRO: YES / NO (NO runs away)
// ══════════════════════════════════════
const intro = document.getElementById('intro');
const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');

function dodge(e) {
  e.preventDefault();
  e.stopPropagation();
  noBtn.style.position = 'fixed';
  const maxX = window.innerWidth  - noBtn.offsetWidth  - 10;
  const maxY = window.innerHeight - noBtn.offsetHeight - 10;
  noBtn.style.left = Math.max(10, Math.random() * maxX) + 'px';
  noBtn.style.top  = Math.max(10, Math.random() * maxY) + 'px';
}

['mouseover', 'touchstart', 'click'].forEach(ev =>
  noBtn.addEventListener(ev, dodge, { passive: false })
);

yesBtn.addEventListener('click', () => {
  intro.classList.add('hide');
  setTimeout(() => intro.remove(), 800);
  enableAudioAndPlayCurrent();   // starts the first song
});