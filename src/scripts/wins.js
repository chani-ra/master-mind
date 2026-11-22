import { LEVELS, readList, compareWins, formatTime } from './scoring.js';
const games = readList('mastermind.games.v2');
const player = localStorage.getItem('currentUserName') || 'שחקן אנונימי';
const own = games.filter(game => game.name === player);
const ownWins = own.filter(game => game.won);
const wins = games.filter(game => game.won).sort(compareWins);
const $ = selector => document.querySelector(selector);
$('#personal-title').textContent = `הסטטיסטיקות שלי · ${player}`;
const stats = [ ['משחקים', own.length], ['ניצחונות', ownWins.length], ['אחוז הצלחה', own.length ? `${Math.round(100 * ownWins.length / own.length)}%` : '—'], ['שיא נקודות', ownWins.length ? Math.max(...ownWins.map(g => g.score)).toLocaleString('en-US') : '—'], ['הזמן המהיר ביותר', ownWins.length ? formatTime(Math.min(...ownWins.map(g => g.seconds))) : '—'] ];
for (const [label, value] of stats) {
  const card = document.createElement('div'); const title = document.createElement('span'); const number = document.createElement('strong'); title.textContent = label; number.textContent = value; card.append(title, number); $('#personal-stats').append(card);
}
function addRow(tbody, values) {
  const row = document.createElement('tr');
  for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
  tbody.append(row); return row;
}
function renderScores() {
  const level = $('#level-filter').value;
  const filtered = wins.filter(win => level === 'all' || win.level === level);
  const tbody = $('#scoresTable tbody'); tbody.replaceChildren();
  filtered.forEach((win, i) => {
    const row = addRow(tbody, [i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1, win.name, win.score.toLocaleString('en-US'), LEVELS[win.level]?.label || win.level, win.attempts, formatTime(win.seconds)]);
    if (win.name === player) row.classList.add('own-score');
  });
  if (!filtered.length) { const row = addRow(tbody, ['עדיין אין ניצחונות ברמה זו. בהצלחה במשחק הראשון!']); row.firstChild.colSpan = 6; }
}
$('#level-filter').addEventListener('change', renderScores); renderScores();
const legacy = readList('wins').filter(win => win && typeof win === 'object');
if (legacy.length) {
  $('#legacy-scores').hidden = false;
  legacy.forEach(win => addRow($('#legacy-body'), [win.name, win.score, LEVELS[win.level]?.label || win.level]));
}
