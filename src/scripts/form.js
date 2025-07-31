
const form = document.getElementById("player-form");

form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const name = document.getElementById("player-name").value.trim();
    const phone = document.getElementById("player-phone").value.trim();
    const email = document.getElementById("player-email").value.trim();

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
