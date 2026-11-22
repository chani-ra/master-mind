import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, calculateScore, normalizeLevel, checkGuess, compareWins, formatTime } from '../src/scripts/scoring.js';
const pegs = letters => [...letters].map(name => ({ name }));
test('exact matches and misplaced colors, including duplicates', () => {
  for (const [secret, guess, bulls, hits] of [['AABC','AAAA',2,0],['AABC','BAAA',1,2],['ABCD','DCBA',0,4],['ABCD','ABCD',4,0],['AAAA','BBBB',0,0],['AABB','BBAA',0,4]]) {
    assert.deepEqual(checkGuess(pegs(secret), pegs(guess)), {bulls,hits});
  }
});
test('scoring is monotonic for all levels with correct bounds', () => {
  for (const [level,{base,attempts}] of Object.entries(LEVELS)) {
    assert.equal(calculateScore(level,1).total,base+1000);
    assert.equal(calculateScore(level,attempts).total,base);
    for(let n=2;n<=attempts;n++) assert.ok(calculateScore(level,n).total < calculateScore(level,n-1).total);
  }
  assert.equal(normalizeLevel('invalid'),'easy');
});
test('score ranking prioritizes score then time', () => {
  const list = [{score:900,seconds:3},{score:1200,seconds:20},{score:1200,seconds:10}].sort(compareWins);
  assert.deepEqual(list.map(x=>x.seconds),[10,20,3]);
  assert.equal(formatTime(65),'1:05');
});
