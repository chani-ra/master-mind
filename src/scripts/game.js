import bgMusicUrl from '../assets/sounds/צעד מגנטי.mp3';
import slotSoundUrl from '../assets/sounds/אנטר.wav';
import winSoundUrl from '../assets/sounds/applause.mp3';
import failSoundUrl from '../assets/sounds/piano.mp3';
import checkSoundUrl from '../assets/sounds/tyarin.mp3';
import openSoundUrl from '../assets/sounds/tyarari.mp3';
import { LEVELS, normalizeLevel, calculateScore, formatTime, readList, saveResult, checkGuess } from './scoring.js';

const $ = selector => document.querySelector(selector);
const level = normalizeLevel(new URLSearchParams(location.search).get('level'));
const config = LEVELS[level];
const guessesCount = config.attempts;
const playerName = localStorage.getItem('currentUserName') || 'שחקן אנונימי';
const colors = [
  { hex: '#dd1818ff', name: 'אדום' }, { hex: '#00008B', name: 'כחול' },
  { hex: '#FFFF00', name: 'צהוב' }, { hex: '#006400', name: 'ירוק' },
  { hex: '#87CEEB', name: 'תכלת' }, { hex: '#8b7575ff', name: 'אפור' }
];
const secretCode = Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]);
let activeRow = guessesCount - 1;
let guess = [];
let used = 0;
let finished = false;
let startedAt = null;
let elapsed = 0;
let timer = null;

// הצלילים המקוריים, עם אפשרות כיבוי נפרדת למוזיקה ולאפקטים.
const bgAudio = new Audio(bgMusicUrl);
bgAudio.loop = true; bgAudio.volume = 0.2;
const effects = { slot: new Audio(slotSoundUrl), win: new Audio(winSoundUrl), lose: new Audio(failSoundUrl), check: new Audio(checkSoundUrl), intro: new Audio(openSoundUrl) };
let musicOn = localStorage.getItem('musicOn') === 'true';
let effectsOn = localStorage.getItem('effectsOn') !== 'false';
const play = audio => { audio.play().catch(() => {}); };
function effect(name) { if (effectsOn) { const audio = effects[name]; audio.currentTime = 0; play(audio); } }
function updateAudioButtons() {
  $('.music-btn .tool-state').textContent = musicOn ? 'פעילה' : 'כבויה';
  $('.music-btn').setAttribute('aria-pressed', String(musicOn));
  $('#effects-btn .tool-state').textContent = effectsOn ? 'פעילים' : 'כבויים';
  $('#effects-btn').setAttribute('aria-pressed', String(effectsOn));
}
updateAudioButtons();
if (musicOn) play(bgAudio);
$('.music-btn').addEventListener('click', () => {
  musicOn = !musicOn; localStorage.setItem('musicOn', String(musicOn));
  if (musicOn) play(bgAudio); else bgAudio.pause();
  updateAudioButtons();
});
$('#effects-btn').addEventListener('click', () => {
  effectsOn = !effectsOn; localStorage.setItem('effectsOn', String(effectsOn));
  if (!effectsOn) Object.values(effects).forEach(audio => audio.pause());
  updateAudioButtons();
});

// הלוח נשאר במראה המקורי, אך כל שורה מקבלת חלק שווה מהגובה.
const board = $('.game-board');
board.classList.add(`level-${guessesCount}`);
board.style.setProperty('--rows', guessesCount);
const rows = Array.from({ length: guessesCount }, (_, i) => {
  const row = document.createElement('div');
  row.className = 'guess-row'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', `ניסיון ${guessesCount - i}`);
  const number = document.createElement('span'); number.className = 'row-number'; number.textContent = guessesCount - i; row.append(number);
  const slots = Array.from({ length: 4 }, () => {
    const slot = document.createElement('div'); slot.className = 'color-slot'; row.append(slot); return slot;
  });
  const feedback = document.createElement('div'); feedback.className = 'feedback';
  const dots = Array.from({ length: 4 }, () => {
    const dot = document.createElement('div'); dot.className = 'feedback-dot'; feedback.append(dot); return dot;
  });
  row.append(feedback); board.append(row); return { row, slots, dots, feedback };
});
const paletteButtons = colors.map((color, index) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'color-button';
  button.style.backgroundColor = color.hex; button.title = `${index + 1}: ${color.name}`; button.setAttribute('aria-label', button.title);
  button.setAttribute('aria-keyshortcuts', String(index + 1));
  const choice = document.createElement('div'); choice.className = 'palette-choice';
  const number = document.createElement('kbd'); number.textContent = index + 1; number.setAttribute('aria-hidden', 'true');
  choice.append(button, number); $('.palette').append(choice);
  button.addEventListener('click', () => fillNextSlot(color)); return button;
});
$('#level-label').textContent = `רמת קושי: ${config.label}`;
$('#attempt-progress').max = guessesCount;
function startTimer() {
  if (startedAt !== null) return;
  clearTimeout(introDelay);
  startedAt = performance.now();
  if (musicOn && bgAudio.paused) play(bgAudio);
  timer = setInterval(updateTime, 250);
}
function updateTime() {
  if (startedAt !== null) elapsed = Math.floor((performance.now() - startedAt) / 1000);
  $('#game-time').textContent = formatTime(elapsed);
}
function setStatus(text) { $('#game-status').textContent = text; }
function updateUI() {
  rows.forEach(({ row }, i) => { const active = !finished && i === activeRow; row.classList.toggle('active-row', active); if (active) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current'); });
  $('#attempts-left').textContent = `${guessesCount - used} / ${guessesCount}`;
  $('#attempt-progress').value = used;
  $('#potential-score').textContent = finished ? '—' : calculateScore(level, used + 1).total.toLocaleString('en-US');
  $('.check-btn').disabled = finished || guess.length !== 4;
  $('.check-btn').textContent = finished ? 'המשחק הסתיים' : guess.length === 4 ? '✓ בדיקת ניחוש' : `בדיקת ניחוש (${guess.length}/4)`;
  $('#undo-btn').disabled = finished || guess.length === 0;
  $('#clear-btn').disabled = finished || guess.length === 0;
  paletteButtons.forEach((button, i) => {
    button.disabled = finished || guess.length === 4;
    button.classList.toggle('last-color', !finished && guess.at(-1) === colors[i]);
  });
}
function renderGuess() {
  rows[activeRow].slots.forEach((slot, i) => {
    slot.style.backgroundColor = guess[i]?.hex || '';
    slot.classList.toggle('filled', Boolean(guess[i]));
    slot.title = guess[i]?.name || '';
  });
  updateUI();
}
function fillNextSlot(color) {
  if (finished || guess.length === 4) return;
  startTimer(); guess.push(color); renderGuess(); effect('slot');
  const slot = rows[activeRow].slots[guess.length - 1];
  slot.classList.remove('pop-in'); void slot.offsetWidth; slot.classList.add('pop-in');
  setStatus(guess.length === 4 ? 'הניחוש מוכן לבדיקה!' : `נבחרו ${guess.length} מתוך 4 צבעים`);
}
function undo() { if (!finished && guess.length) { guess.pop(); renderGuess(); setStatus('אפשר לבחור צבע נוסף.'); } }
function clearGuess() { if (!finished) { guess = []; renderGuess(); setStatus('השורה נוקתה.'); } }
function createCode(target) {
  target.replaceChildren();
  secretCode.forEach(color => { const slot = document.createElement('div'); slot.className = 'color-slot'; slot.style.backgroundColor = color.hex; slot.title = color.name; slot.setAttribute('aria-label', color.name); target.append(slot); });
}
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div'); layer.className = 'confetti-layer'; layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('i'); piece.style.setProperty('--x', `${Math.random() * 100}%`); piece.style.setProperty('--delay', `${Math.random() * 0.5}s`); piece.style.backgroundColor = ['#c2a44f','#fdf5e6','#a88c3c','#6e4e2e'][i % 4]; layer.append(piece);
  }
  $('#result-dialog').append(layer); setTimeout(() => layer.remove(), 2200);
}
function finish(won) {
  finished = true; updateTime(); clearInterval(timer);
  const points = won ? calculateScore(level, used) : { total: 0, base: 0, bonus: 0 };
  const previousWins = readList('mastermind.games.v2').filter(g => g.won && g.name === playerName && g.level === level);
  const record = won && (!previousWins.length || previousWins.every(g => points.total > g.score || (points.total === g.score && elapsed < g.seconds)));
  const saved = saveResult({ name: playerName, level, won, score: points.total, attempts: used, seconds: elapsed, date: new Date().toISOString() });
  createCode($('.secret-colors')); createCode($('#result-code'));
  board.classList.add(won ? 'game-won' : 'game-over');
  updateUI(); setStatus(won ? 'כל הכבוד! הקוד פוצח.' : 'המשחק הסתיים. הקוד נחשף.');
  $('#result-title').textContent = won ? `כל הכבוד, ${playerName}!` : 'הפעם הקוד לא פוצח';
  $('#result-medal').textContent = won ? (used <= guessesCount / 3 ? '🏆 גביע זהב' : used <= 2 * guessesCount / 3 ? '🥈 גביע כסף' : '🥉 גביע נחושת') : 'הקוד הסודי היה:';
  $('#result-details').textContent = `רמה: ${config.label} · ניסיונות: ${used} מתוך ${guessesCount} · זמן: ${formatTime(elapsed)}`;
  $('#result-score').textContent = `${points.total.toLocaleString('en-US')} נקודות`;
  $('#result-breakdown').textContent = won ? `${points.base} בונוס ניצחון + ${points.bonus} בונוס יעילות` : 'אפשר לנסות שוב ולשפר את התוצאה!';
  $('#result-record').textContent = !saved ? 'לא ניתן לשמור את התוצאה בדפדפן.' : record ? 'שיא אישי חדש ברמה זו!' : '';
  effect(won ? 'win' : 'lose'); bgAudio.volume = 0.07;
  $('#result-dialog').showModal(); if (won) celebrate();
}
function submitGuess() {
  if (finished || guess.length !== 4) return;
  const { bulls, hits } = checkGuess(secretCode, guess);
  const { row, dots, feedback } = rows[activeRow];
  dots.forEach((dot, i) => { if (i < bulls) dot.classList.add('bull'); else if (i < bulls + hits) dot.classList.add('hit'); });
  feedback.setAttribute('aria-label', `${bulls} בול, ${hits} פגיעה`); feedback.title = `${bulls} בול, ${hits} פגיעה`;
  row.classList.add('completed-row'); used++; effect('check');
  if (bulls === 4) { finish(true); return; }
  if (used === guessesCount) { finish(false); return; }
  activeRow--; guess = []; renderGuess(); setStatus(`${bulls} בול · ${hits} פגיעה. נסה שוב!`);
}
$('.check-btn').addEventListener('click', submitGuess);
$('#undo-btn').addEventListener('click', undo); $('#clear-btn').addEventListener('click', clearGuess);
$('.playAgain-btn').addEventListener('click', () => { if (finished || startedAt === null || confirm('להתחיל משחק חדש? המשחק הנוכחי לא יישמר.')) location.reload(); });
$('#again-btn').addEventListener('click', () => location.reload());
$('#close-result').addEventListener('click', () => $('#result-dialog').close());
// Restore the original opening sound and gold introduction. Manual help never times out.
const helpDialog = $('#help-dialog');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let introTimeout, closingTimeout;
const introDelay = setTimeout(() => { if (!finished && startedAt === null) showHelp(true); }, 1100);
function showHelp(automatic = false) {
  clearTimeout(introDelay);
  if (helpDialog.open || $('dialog[open]')) return;
  helpDialog.classList.toggle('automatic-intro', automatic);
  helpDialog.classList.remove('intro-closing');
  helpDialog.showModal();
  effect('intro'); // The browser may block audio before the first user interaction.
  if (automatic) introTimeout = setTimeout(closeHelp, 10000);
}
function closeHelp() {
  clearTimeout(introTimeout);
  if (!helpDialog.open || helpDialog.classList.contains('intro-closing')) return;
  helpDialog.classList.add('intro-closing');
  if (reducedMotion.matches) helpDialog.close();
  else closingTimeout = setTimeout(() => helpDialog.close(), 240);
}
helpDialog.addEventListener('cancel', event => { event.preventDefault(); closeHelp(); });
helpDialog.addEventListener('close', () => {
  clearTimeout(introTimeout); clearTimeout(closingTimeout);
  helpDialog.classList.remove('automatic-intro', 'intro-closing');
});
$('#help-btn').addEventListener('click', () => showHelp());
$('#close-help').addEventListener('click', closeHelp);
$('#dismiss-help').addEventListener('click', closeHelp);
document.addEventListener('keydown', event => {
  if (finished || $('dialog[open]') || event.ctrlKey || event.altKey || event.metaKey || event.repeat) return;
  if (event.key >= '1' && event.key <= '6') { event.preventDefault(); fillNextSlot(colors[Number(event.key) - 1]); }
  else if (event.key === 'Backspace') { event.preventDefault(); undo(); }
  else if (event.key === 'Enter' && !event.target.closest('button, a')) { event.preventDefault(); submitGuess(); }
});
updateUI(); setStatus('בחר ארבעה צבעים כדי להתחיל.');
