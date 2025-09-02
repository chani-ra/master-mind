
const form = document.getElementById("player-form");

const nameInput = document.getElementById("player-name");
const phoneInput = document.getElementById("player-phone");
const emailInput = document.getElementById("player-email");

// const errorMsg = document.getElementById("errorMsg");

// nameInput.addEventListener('input', () => {
//     const invalidChars = /[^A-Za-zא-ת\s]/; // תווים לא תקינים
//     if (invalidChars.test(nameInput.value)) {
//         nameInput.classList.add("error");   // מוסיף מסגרת אדומה
//         errorMsg.style.display = "block";   // מציג הודעת שגיאה
//     } else {
//         nameInput.classList.remove("error");
//         errorMsg.style.display = "none";
//     }
// });
// nameInput.addEventListener('input', () => {
//     nameInput.value = nameInput.value.replace(/[^A-Za-zא-ת\s]/g, '');
// });

form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();


    const newUser = { name, phone, email }

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const existingUser = users.find(user => user.name === name && user.phone === phone && user.email === email)

    localStorage.setItem("currentUserName", name)
    localStorage.setItem("userExist", existingUser ? "true" : "false")

    if (!existingUser) {
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
    }

    window.location.href = "../pages/level.html"


})


