
const currentUserName = localStorage.getItem("currentUserName");

const userExist = localStorage.getItem("userExist");


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

const setupInstructionsToggle = () => {

    document.getElementById("howToPlayBtn").addEventListener("click", () => {
        document.getElementById("instructions-content").classList.toggle("show");
    });
}

const setupLevelButtons = () => {
    const startGame = document.querySelectorAll(".level-btn");
    startGame.forEach(btn => {

        btn.addEventListener("click", () => {
            const level = btn.dataset.level
            console.log(level);

            window.location.href = `../pages/game.html?level=${level}`;


        })
    });
};
const setupHighScoresButton = () => {
    const highScoresBtn = document.getElementById("highScoresBtn");
    highScoresBtn.addEventListener("click", () => {
        // מעבירה לדף השיאים
        window.location.href = "../pages/wins.html";
    });
};


document.addEventListener("DOMContentLoaded", () => {
    showGreeting();
    setupInstructionsToggle();
    setupLevelButtons();
    setupHighScoresButton();
});