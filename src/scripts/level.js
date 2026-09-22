
// שולפת את שם השחקן מהלוקל-סטורייג
const currentUserName = localStorage.getItem("currentUserName");

const userExist = localStorage.getItem("userExist");

//הפונקציה הנוכחית מדפיסה הודעה מתאימה בהתאם לשם של השחקן והראם כבר שיחק בעבר!
const showGreeting = () => {
    const userNameGreeting = document.getElementById("userNameGreeting");

    if (currentUserName) {
        if (userExist === "true") {
            userNameGreeting.textContent = `שלום לך ${currentUserName} השם שלך כבר מופיע אצלינו במערכת.... טוב להפגש שוב!`;
        }
        else {
            userNameGreeting.textContent = `שלום לך ${currentUserName} ברוכה הבאה למסטרמיינד המשחק שלנו!`
        }
    }
};

// פונקציה שאחראית על הכפתור של ההוראות במשחק
const setupInstructionsToggle = () => {

    document.getElementById("howToPlayBtn").addEventListener("click", () => {
        document.getElementById("instructions-content").classList.toggle("show");
    });
}
// מכינה את כפתורי הרמות
const setupLevelButtons = () => {
    const startGame = document.querySelectorAll(".level-btn");
    startGame.forEach(btn => {

        btn.addEventListener("click", () => {
            const level = btn.dataset.level
            console.log(level);

            // קביעת הרמה 
            window.location.href = `../pages/game.html?level=${level}`;


        })
    });
};

// בפתור השיאים
const setupHighScoresButton = () => {
    const highScoresBtn = document.getElementById("highScoresBtn");
    highScoresBtn.addEventListener("click", () => {

        window.location.href = "../pages/wins.html";
    });
};

// הפעלת הפונקציות אחרי טעינת הדום
document.addEventListener("DOMContentLoaded", () => {
    showGreeting();
    setupInstructionsToggle();
    setupLevelButtons();
    setupHighScoresButton();
});