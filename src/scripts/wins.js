//  קריאת הנתונים מה־localStorage
const wins = JSON.parse(localStorage.getItem("wins")) || [];

// פונקציה שמתרגמת רמה למספר (hard=3, medium=2, easy=1)
const levelToNumber = level => {
  if (level === "easy") return 1;
  if (level === "medium") return 2;
  if (level === "hard") return 3;
  return 0; // במקרה שלא מוגדר
};

// ממיינת קודם לפי רמה, ואז לפי ניקוד מהגבוה לנמוך
wins.sort((a, b) => {
  const aLevelNum = levelToNumber(a.level);
  const bLevelNum = levelToNumber(b.level);

  if (aLevelNum !== bLevelNum) return bLevelNum - aLevelNum; // קודם לפי רמה
  return b.score - a.score; // אם הרמה זהה, ממיין לפי ניקוד
});

//  מציאת הטבלה
const tbody = document.querySelector("#scoresTable tbody");

//  הוספת הנתונים למסך
wins.forEach((win, index) => {
  const row = document.createElement("tr");

  const placeTd = document.createElement("td");
  placeTd.textContent = index + 1;

  const nameTd = document.createElement("td");
  nameTd.textContent = win.name;

  const scoreTd = document.createElement("td");
  scoreTd.textContent = win.score;

  const levelTd = document.createElement("td");
  levelTd.textContent = win.level;

  // הוספת התאים לשורה
  row.append(placeTd, nameTd, scoreTd, levelTd);

  tbody.appendChild(row);
});

// כפתור חזרה למשחק
document.querySelector(".btn").addEventListener("click", () => {
  window.location.href = "../pages/level.html";
});
