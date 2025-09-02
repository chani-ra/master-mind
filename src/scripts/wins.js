// שלב 1: קריאת הנתונים
const wins = JSON.parse(localStorage.getItem("wins")) || [];

// שלב 2: מיון הניקוד מהגבוה לנמוך
wins.sort((a, b) => b.score - a.score);

// שלב 3: מציאת הטבלה
const tbody = document.querySelector("#scoresTable tbody");

// שלב 4: הוספת הנתונים למסך
wins.forEach((win, index) => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${win.name}</td>
    <td>${win.score}</td>
    <td>${win.level}</td>
  `;

  tbody.appendChild(row);
});

// כפתור חזרה למשחק
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "..pages/level.html"; // תשני לשם של דף המשחק שלך
});
