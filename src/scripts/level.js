
const currentUserName = localStorage.getItem("currentUserName");

const userExist = localStorage.getItem("userExist");

const userNameGreeting = document.getElementById("userNameGreeting");

if (currentUserName) {
    if (userExist) {
        userNameGreeting.textContent = `שלום לך ${currentUserName} השם שלך כבר מופיע אצלינו ברשימות.... טוב להפגש שוב!`;
    }
    else{
          userNameGreeting.textContent =`שלום לך${currentUserName} ברוכה הבאה למסטרמיינדת המשחק שלנו!`
    }
}
else{

}

document.getElementById("howToPlayBtn").addEventListener("click", () => {
      document.getElementById("instructions-content").classList.toggle("show");
    });