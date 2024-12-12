import userController from '/userController.js';

const logForm = document.getElementById("login-form");



async function login() {
    let Email = document.getElementById("Email").value;
    let Password = document.getElementById("Password").value;

    await userController.loginUser(Email, Password);

    return '/profile.html';
}


logForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    logForm.action = await login();
});