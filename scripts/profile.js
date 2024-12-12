const token = localStorage.getItem('token');
if (!token) {
    // Перенаправляем на страницу входа, если токена нет
    window.location.href = '/login.html';
}

async function getUserProfile() {
    try {
        const response = await fetch('http://localhost:3000/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Отправляем токен в заголовке
            }
        });

        if (!response.ok) {
            throw new Error('Не удалось получить данные профиля');
        }

        const user = await response.json();
        document.getElementById('user-info').textContent = `Добро пожаловать, ${user.Email}`;
    } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        alert('Ошибка авторизации. Пожалуйста, войдите снова.');
        localStorage.removeItem('token'); // Удаляем токен
        window.location.href = '/login.html'; // Перенаправляем на страницу входа
    }
}
document.addEventListener("DOMContentLoaded", ready);

async function ready() {
    document.getElementById('logout-menu-button').addEventListener('click', () => {
        localStorage.removeItem('token'); // Удаляем токен
        window.location.href = '/login.html'; // Перенаправляем на страницу входа
    });
}