//  לוקח את הפרמטרים מהיו-אר-אל
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "easy";// ברירת מחדל "קל" ברגע שאין פרמטר"

document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    showIntroAnimation();
  }, 1100);
});

function showIntroAnimation() {

  // const intireDiv = document.createElement("div");
  // intireDiv.textContent = "";
  // intireDiv.classList.add("intro-message");
  // document.body.appendChild(intireDiv);
  const intireDiv = document.querySelector(".intire-message")

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn")
  closeBtn.textContent = "×"; // אפשר גם "סגור" במקום ×

  // הוספת אירוע לכפתור
  closeBtn.addEventListener("click", () => {
    intireDiv.remove(); // מסיר את הדיב מיד
  });

  intireDiv.appendChild(closeBtn); // מוסיף את הכפתור לדיב


  // הופעה הדרגתית
  setTimeout(() => intireDiv.classList.add("show"), 100);

  // היעלמות כעבור 10 שניות
  setTimeout(() => {
    intireDiv.classList.remove("show");
    intireDiv.classList.add("hide");
  }, 10000);

  //מסירה את הדיב
  setTimeout(() => intireDiv.remove(), 10100);
}

//  קבלת שם השחקן מה-localStorage בצורה בטוחה

//  הוספת מערך לניצחונות - נטען מלוקל סטורייג אם קיים
let wins = JSON.parse(localStorage.getItem("wins")) || []; // 

//  אובייקט שמגדיר כמה שורות ניחושים יש לכל רמה
const levelsConfig = {
  easy: 12,
  medium: 10,
  hard: 8,
};

//  קובע כמה שורות יהיו לפי הרמה
const guessesCount = levelsConfig[level] || 8;
console.log(`הרמה שנבחרה: ${level}, מספר שורות: ${guessesCount}`);

const board = document.querySelector(".game-board");
board.classList.add(`level-${guessesCount}`);

//  נתחיל מהשורה התחתונה
let activeRow = guessesCount - 1;
//  מיקום הסלוט הבא למלא בשורה
let activeSlotIndex = 0;


//  לולאה שמייצרת את כל השורות על הלוח
for (let i = 0; i < guessesCount; i++) {
  const row = document.createElement("div");
  row.classList.add("guess-row");

  //  יצירת 4 הצבעים - התאים לניחוש
  for (let j = 0; j < 4; j++) {
    const slot = document.createElement("div");
    slot.classList.add("color-slot");
    row.appendChild(slot);
  }

  //  יוצרת את אזור הפידבק
  const feedback = document.createElement("div");
  feedback.classList.add("feedback");

  for (let j = 0; j < 4; j++) {
    const dot = document.createElement("div");
    dot.classList.add("feedback-dot");
    feedback.appendChild(dot);
  }

  row.appendChild(feedback);
  board.append(row);
}

//  הגדרת צבעים אפשריים למשחק
const colors = [
  "#1856ddff",
  "#ecea4dff",
  "#aae61fff",
  "#c78db6ff",
  "#c24949ff",
  "#4a4a4a"
]

//  הגרלת 4 מספרים רנדומלים מתוך המערך
const randomColors = () => {
  const rnArray = [];
  for (let i = 0; i < 4; i++) {
    const colorsIndex = Math.floor(Math.random() * colors.length);
    rnArray.push(colors[colorsIndex])
  }
  console.log("הקוד הסודי שנוצר הוא:", rnArray);
  return rnArray;
}

const secretCode = randomColors();

// הצגת הקוד הסודי בלוח
function showSecretCode() {
  const realSecretColors = document.querySelector(".secret-colors");
  realSecretColors.style.backgroundColor = "white";
  realSecretColors.style.display = "flex";
  realSecretColors.innerHTML = "";

  secretCode.forEach(color => {
    const slot = document.createElement("div");
    slot.classList.add("color-slot");
    slot.style.backgroundColor = color;
    realSecretColors.appendChild(slot);
  });
}


//  בדיקת הניחוש של השחקן מול הקוד
const checkGuees = (secretArray, playerGuess) => {
  let bulls = 0; // בול
  let hits = 0; // פגיעה

  const randomCopy = [...secretArray]; // העתק של הקוד 
  const guessCopy = [...playerGuess];  // העתק של הניחוש

  //  בדיקת בול
  for (let i = 0; i < secretArray.length; i++) {
    if (randomCopy[i] === guessCopy[i]) {
      bulls++;
      randomCopy[i] = null;
      guessCopy[i] = null;
    }
  }

  //  בדיקת פגיעה
  for (let i = 0; i < secretArray.length; i++) {
    for (let j = 0; j < secretArray.length; j++) {
      if (
        guessCopy[i] &&                 // ← חייב להיות ערך לא ריק
        randomCopy[j] &&                // ← חייב להיות ערך לא ריק
        guessCopy[i] === randomCopy[j]
      ) {
        hits++;
        guessCopy[i] = null;
        randomCopy[j] = null;
        break;
      }
    }
  }

  console.log(bulls, hits);
  return { bulls, hits };
}

//  יצירת פלטת הצבעים של השחקן
const container = document.querySelector(".end");
const palette = document.createElement("div")
palette.classList.add("palette");
container.append(palette);

colors.forEach(color => {
  const colorBtn = document.createElement("div");
  colorBtn.classList.add("color-button");
  colorBtn.style.backgroundColor = color;
  colorBtn.dataset.colorHex = color;
  colorBtn.addEventListener("click", () => fillNextSlot(color));
  palette.append(colorBtn);
});

//  פונקציה שממלאה את הסלוט הריק הבא בשורה הפעילה
const fillNextSlot = (color) => {
  const rows = document.querySelectorAll(".guess-row");
  if (activeRow < 0) return;

  const currentRow = rows[activeRow];
  const slots = currentRow.querySelectorAll(".color-slot");

  if (activeSlotIndex < slots.length) {
    slots[activeSlotIndex].style.backgroundColor = color;
    slots[activeSlotIndex].dataset.colorHex = color;
    activeSlotIndex++;

    if (activeSlotIndex === slots.length) {

    }
  }
}

//  יצירת חץ דינמי
const arrow = document.createElement("div");
arrow.id = "active-arrow";
board.appendChild(arrow);


const updateArrow = () => {
  const rows = document.querySelectorAll(".guess-row");
  if (activeRow >= 0) {
    const currentRow = rows[activeRow];
    const rowOffsetTop = currentRow.offsetTop;
    const rowHeight = currentRow.offsetHeight;
    arrow.style.top = (rowOffsetTop + rowHeight / 2 - arrow.offsetHeight / 2) + "px";
    arrow.style.right = "100px";
    arrow.style.display = "block";
  } else {
    arrow.style.display = "none";
  }
}

//  פונקציה להצגת הודעת ניצחון עם גביע
// const showWinMessage = (playerName, score, attemptNumber, totalRows) => {
//   const winDiv = document.createElement("div");
//   winDiv.classList.add("win-message");

//   const contentDiv = document.createElement("div");
//   contentDiv.classList.add("win-message-content");

//   let cup;
//   if (attemptNumber <= totalRows / 3) cup = "🏆 זהב";
//   else if (attemptNumber <= (2 * totalRows / 3)) cup = "🥈 כסף";
//   else cup = "🥉 נחושת";

//   contentDiv.innerHTML = `
//     <h2>ברכות! ${playerName}</h2>
//     <p>ניצחת בגביע ${cup}</p>
//     <p>ניקוד: ${score}</p>
//     <p>רמת קושי: ${level}</p>
//   `;


//   winDiv.append(contentDiv);
//   document.body.appendChild(winDiv);

// כפתור שמרענן שוב את הדף - השחקן יכול לשחק שוב
//   
//  הפונקציה להצגת הודעה דינמית של ניצחון או כישלון
const showGameMessage = ({
  playerName = "",
  score = 0,
  type = "win",
  attemptNumber = 0,
  totalRows = 0,
  delay = 0, // הזמן לפני ביצוע הפונקציה שבסטטיימאווט
  duration = 20000 //  זמן ההצגה
}) => {
  setTimeout(() => {
    // יצרתי דיב שישמש כהודעה
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("game-message");

    // יצרתי דיב פנימי שיכיל את התוכן של ההודעה
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("game-message-content");

     contentDiv.textContent = ""; 

    let title = "";
    let message = "";

    // במידה והשחקן ניצח
    if (type === "win") {
      let cup;
      if (attemptNumber <= totalRows / 3) cup = "🏆 זהב";
      else if (attemptNumber <= (2 * totalRows / 3)) cup = "🥈 כסף";
      else cup = "🥉 נחושת";

     
  title = `ברכות! ${playerName}`;

  // קודם מוסיפים כותרת
  const h2 = document.createElement("h2");
  h2.textContent = title;
  contentDiv.appendChild(h2);
  
  // יוצרת את הפיסקה מחולקת לאלמנטים
  const cupP = document.createElement("p");
  cupP.textContent = `זכית בגביע ${cup}`;
  const scoreP = document.createElement("p");
  scoreP.textContent = `ניקוד: ${score}`;
  const levelP = document.createElement("p");
  levelP.textContent = `${level}רמת קושי: `;

  contentDiv.appendChild(cupP);
  contentDiv.appendChild(scoreP);
  contentDiv.appendChild(levelP);
}
  
    // אם מדובר בכישלון
    else if
      (type === "lose") {
      title = "נגמר המשחק!";
      message = `  ${secretCode.join(", ")}:לא הצלחת לפצח את הקוד. הקוד הסודי היה:`;
    }
    else if (type === "error") {
      title = " !!!שגיאה"
      message = "יש למלא את כל השורה"
    }

   if(type !== "win"){
    const h2 = document.createElement("h2");
    h2.textContent = title;
    const p = document.createElement("p");
    p.textContent = message || "";

    contentDiv.appendChild(h2);
    contentDiv.appendChild(p);
}
    // כפתור לשחק שוב 
    if (type !== "error") {
    const playAgainBtn = document.createElement("button");
    playAgainBtn.textContent = "לשחק שוב";
    playAgainBtn.addEventListener("click", () => location.reload());
    contentDiv.appendChild(playAgainBtn);
    }

    messageDiv.appendChild(contentDiv);
    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), duration);
  }, delay);
};


//  פונקציה לשמירת ניצחון וניקוד של השחקן
const saveWinToStorage = (playerName, score, level) => {
  const win = {
    name: playerName,   // שם השחקן
    score: score,       // ניקוד
    level: level        // רמת המשחק
  };
  wins.push(win);  // מוסיפים למערך הקיים
  localStorage.setItem("wins", JSON.stringify(wins)); // שמירת המערך בלוקל סטורייג
}

//  יצירת כפתור "בדיקה"
const checkBtn = document.createElement("button");
checkBtn.textContent = "בדיקה";
checkBtn.classList.add("check-btn");
container.appendChild(checkBtn);
// לוקחת מהלוקל סטורייג' את השם של השחקן
const currentUserName = localStorage.getItem("currentUserName") || "שחקן אנונימי";

//  אירוע ללחיצה על כפתור בדיקה
checkBtn.addEventListener("click", () => {

  const rows = document.querySelectorAll(".guess-row");
  const currentRow = rows[activeRow];
  const slots = currentRow.querySelectorAll(".color-slot");
  const feedbackDots = currentRow.querySelectorAll(".feedback-dot");

  const playerGuess = Array.from(slots).map(slot => slot.dataset.colorHex || "");

  if (playerGuess.includes("")) {
    showGameMessage({
      type: "error",
      message: "חייבים למלא את כל השורה!",
      duration: 2000
    });
    return;
  }

  const result = checkGuees(secretCode, playerGuess);

  feedbackDots.forEach(dot => {
    // dot.style.backgroundColor = "transparent";
  });

  let filledDots = 0;
  for (let i = 0; i < result.bulls; i++) {
    feedbackDots[filledDots].style.backgroundColor = "black";
    filledDots++;
  }
  for (let i = 0; i < result.hits; i++) {
    feedbackDots[filledDots].style.backgroundColor = "white";
    filledDots++;
  }

  //  אם השחקן פתר נכון (4 בול)
  if (result.bulls === 4) {
    const attemptNumber = guessesCount - activeRow;
    const unFullRowes = guessesCount - attemptNumber;
    const score = unFullRowes * 100;
    // לוקל סטורייג קבלת שם השחקן מה-

    const playerName = currentUserName || "שחקן אנונימי";

    //באן אני שומרת את הנתונים של השחקן בלןקל-סטורייג
    saveWinToStorage(playerName, score, level);

    //באן אני מפעילה את הפונקציה שמביאה את הודעת הניצחון!
    showGameMessage({
      type: "win",
      playerName: playerName,
      score: score,
      attemptNumber: attemptNumber,
      totalRows: guessesCount
    });
    activeRow = -1;
    return;
  }
  // במידה ולא ניצח עוברים לשורה הבאה בתור לסלוט הראשון בתור
  activeRow--;
  activeSlotIndex = 0;
  // מעדכנת תא החץ ליזוז לשורה הבאה
  updateArrow();


  if (activeRow < 0) {

    showSecretCode();


    const gameOverDiv = document.querySelector(".game-board");
    gameOverDiv.classList.add("game-over");

    const lastPlayAgain = document.createElement("div")

    showGameMessage({
      type: "lose",
      playerName: currentUserName,
      delay: 1500
    })
  };
});
