async function ready() {
    document.getElementById('logout-menu-button').addEventListener('click', async () => {
        const response = await fetch('/logout', {
            method: 'POST',
          });
          if (response.ok) {
            localStorage.removeItem('token'); // Удаляем токен
            localStorage.clear();
            req.session.destroy();
            window.location.href = '/login'; // Перенаправляем на страницу входа
          } else {
            alert('Ошибка при выходе');
          }
    });
}

document.addEventListener("DOMContentLoaded", ready);