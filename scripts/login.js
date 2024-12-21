import userController from '/userController.js';

const logForm = document.getElementById("login-form");



async function login() {
    const Email = document.getElementById("Email").value;
    const Password = document.getElementById("Password").value;

    const result = await userController.loginUser(Email, Password);

    return result;
}


logForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const result = await login()
    if (result)  {
        window.location.href = '/profile';
    }
    
});
