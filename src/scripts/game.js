//לוקח את הפרמטרים מהיו-אר-אל
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "easy";// ברירת מחדל "קל" ברגע שאין פרמטר"

// אובייקט שמגדיר כמה שורות ניחושים יש לכל רמה
const levelsConfig = {
  easy: 12,
  medium: 10,
  hard: 8,
};

// קובע כמה שורות יהיו לפי הרמה
const guessesCount = levelsConfig[level] || 12;
console.log(`הרמה שנבחרה: ${level}, מספר שורות: ${guessesCount}`);

const board = document.querySelector(".game-board");

board.classList.add(`level-${guessesCount}`);


// נתחיל מהשורה התחתונה
let activeRow = guessesCount - 1;
// ומיקום הסלוט הבא למלא בשורה
let activeSlotIndex = 0;


// לולאה שמייצרת את כל השורות על הלוח
for (let i = 0; i < guessesCount; i++) {
  const row = document.createElement("div");
  row.classList.add("guess-row");

  // יצרית  4 הצבעים - התאים לניחוש
  for (let j = 0; j < 4; j++) {
    const slot = document.createElement("div");
    slot.classList.add("color-slot");
    row.appendChild(slot);
  }

  // יוצרת את אזור הפידבק 
  const feedback = document.createElement("div");
  feedback.classList.add("feedback");

  // בכל פידבק יהיו 4 נקודות (black/white)
  for (let j = 0; j < 4; j++) {
    const dot = document.createElement("div");
    dot.classList.add("feedback-dot");
    feedback.appendChild(dot);
  }

  row.appendChild(feedback);
  board.appendChild(row);
}

// הגדרת צבעים אפשריים למשחק
const colors = [
  "#6e4e2e", // חום כהה
  "#c2a44f", // חום בהיר
  "#7a8a54", // ירוק זית
  "#a89f85", // שמנת כהה
  "#6b3e3e", // בורדו כהה
  "#4a4a4a"  // אפור כהה]
]

//הגרלת 4 מספרים רנדומלים מתוך המערך
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

// בדיקת הניחוש של השחקן מול הקוד
const checkGuees = (secretArray, playerGuess) => {
  let bulls = 0; // בול
  let hits = 0; // פגיעה

  const randomCopy = [...secretArray]; //  העתק של הקוד 
  const guessCopy = [...playerGuess];  // העתק של הניחוש

  //בדיקת בול 
  for (let i = 0; i < secretArray.length; i++) {
    if (randomCopy[i] === guessCopy[i]) {
      bulls++;
      randomCopy[i] = null; //  ניקוי הערך שכבר נמצא
      guessCopy[i] = null;
    }
  }

  // בדיקת פגיעה
  for (let i = 0; i < secretArray.length; i++) {
    for (let j = 0; j < secretArray.length; j++) {
      if (
        guessCopy[i] !== null &&
        randomCopy[j] !== null &&
        guessCopy[i] === randomCopy[j]
      ) {
        hits++;
        guessCopy[i] = null; //  שורה זו מונעת את החזרה על אותו צבע
        randomCopy[j] = null;
        break;
      }
    }
  }
  console.log(bulls, hits);

  return { bulls, hits };
}

//בדיקה לקונסול
const playerGuess = ["red", "blue", "green", "yellow"];
checkGuees(secretCode, playerGuess);

// יצירת פלטת הצבעים של השחקן
const container = document.querySelector(".end");
const gameBoard = document.querySelector(".game-board");

const palette = document.createElement("div")
palette.classList.add("palette");
container.append(palette);

//יצירת כפתורי הצבע בפלטת צבעים
colors.forEach(color => {
  const colorBtn = document.createElement("div");
  colorBtn.classList.add("color-button");
  colorBtn.style.backgroundColor = color;
  colorBtn.dataset.colorHex = color;
  colorBtn.addEventListener("click", () => {
    fillNextSlot(color);
  });
  palette.appendChild(colorBtn);
});

// פונקציה שממלאה את הסלוט הריק הבא בשורה הפעילה - בצבע שנבחר\ נלחץ בפלטת הצבעים
const fillNextSlot = (color) => {
  const rows = document.querySelectorAll(".guess-row");
  if (activeRow < 0) return; // אם כבר עברנו את כל השורות

  const currentRow = rows[activeRow];
  const slots = currentRow.querySelectorAll(".color-slot");

  if (activeSlotIndex < slots.length) {
    slots[activeSlotIndex].style.backgroundColor = color;
    slots[activeSlotIndex].dataset.colorHex = color; //  שמירת הצבע בשורה

    activeSlotIndex++;

    // אם מילאנו את כל הסלוטים בשורה, עוברים לשורה שמעליה
    if (activeSlotIndex === slots.length) {
      activeRow--;
      activeSlotIndex = 0;
    }
  }
  updateArrow();
}
// יצירת חץ דינמי ע"מ להקל על השחקן שידע באיזה שורה אוחזים
const arrow = document.createElement("div");
arrow.id = "active-arrow";

board.appendChild(arrow);

const updateArrow = () => {
  const rows = document.querySelectorAll(".guess-row");
  if (activeRow >= 0) {
    const currentRow = rows[activeRow];

    // מיקום יחסי של השורה בתוך הלוח
    const rowOffsetTop = currentRow.offsetTop;
    const rowHeight = currentRow.offsetHeight;
    arrow.style.top = (rowOffsetTop + rowHeight / 2 - arrow.offsetHeight / 2) + "px";
    arrow.style.right = "100px"; // <-- החץ יוצב 20 פיקסלים שמאלה מהשורה

    arrow.style.display = "block";
  } else {
    arrow.style.display = "none";
  }
}

updateArrow();


//   יצירת כפתור "בדיקה"
const checkBtn = document.createElement("button");
checkBtn.textContent = "בדיקה";
checkBtn.classList.add("check-btn");
container.appendChild(checkBtn);

//  הוספה שלי: אירוע ללחיצה על כפתור "בדיקה"
checkBtn.addEventListener("click", () => {
  const rows = document.querySelectorAll(".guess-row");
  const currentRow = rows[activeRow];
  const slots = currentRow.querySelectorAll(".color-slot");
  const feedbackDots = currentRow.querySelectorAll(".feedback-dot");

  // לוקח את הצבעים שהשחקן בחר בשורה
  const playerGuess = Array.from(slots).map(slot => slot.style.backgroundColor);

  // אם יש סלוטים ריקים, לא נבדוק
  if (playerGuess.includes("")) {
    alert("חייבים למלא את כל הלוח!");
    return;
  }

  // בדיקת השורה מול הקוד הסודי
  const result = checkGuees(secretCode, playerGuess);

  //  ניקוי הפידבק הקודם
  feedbackDots.forEach(dot => {
    dot.style.backgroundColor = "transparent";
  });

  //  צביעה של ה־feedback לפי בול/פגיעה
  let filledDots = 0;

  // קודם כל בול (שחור)
  for (let i = 0; i < result.bulls; i++) {
    feedbackDots[filledDots].style.backgroundColor = "black";
    filledDots++;
  }

  // אחר כך פגיעה (לבן)
  for (let i = 0; i < result.hits; i++) {
    feedbackDots[filledDots].style.backgroundColor = "white";
    filledDots++;
  }

  // אם השחקן פתר נכון (4 בול) -> הודעה
  if (result.bulls === 4) {
    alert("כל הכבוד! פתרת את הקוד 🎉");
    activeRow = -1; // סוגרים את המשחק
    return;
  }

  // אם לא פתר -> עוברים לשורה הבאה
  activeRow--;
  activeSlotIndex = 0;

  // אם נגמרו השורות -> הפסד
  if (activeRow < 0) {
    alert("נגמרו לך הניחושים! הקוד היה: " + secretCode.join(", "));
  }
});
