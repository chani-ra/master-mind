export const LEVELS = {
  easy: { label: 'קל', attempts: 12, base: 600 },
  medium: { label: 'בינוני', attempts: 10, base: 900 },
  hard: { label: 'קשה', attempts: 8, base: 1200 }
};
export const normalizeLevel = level => Object.hasOwn(LEVELS, level) ? level : 'easy';
export function calculateScore(level, attempt) {
  const { attempts, base } = LEVELS[normalizeLevel(level)];
  const used = Math.max(1, Math.min(attempts, attempt));
  const bonus = Math.round(1000 * (attempts - used) / (attempts - 1));
  return { base, bonus, total: base + bonus };
}
export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '—';
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export function readList(key) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
export function saveResult(result) {
  const games = readList('mastermind.games.v2');
  games.push(result);
  try { localStorage.setItem('mastermind.games.v2', JSON.stringify(games)); return true; }
  catch { return false; }
}
export function compareWins(a, b) {
  return b.score - a.score || a.seconds - b.seconds || a.attempts - b.attempts;
}
export function checkGuess(secret, guess) {
  const remaining = [];
  const unmatched = [];
  let bulls = 0, hits = 0;
  secret.forEach((color, i) => {
    if (color.name === guess[i].name) bulls++;
    else { remaining.push(color.name); unmatched.push(guess[i].name); }
  });
  for (const color of unmatched) {
    const index = remaining.indexOf(color);
    if (index !== -1) { hits++; remaining.splice(index, 1); }
  }
  return { bulls, hits };
}
