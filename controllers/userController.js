// Функция для добавления нового пользователя
async function addUser(Email, Password, StudentId, TeacherId) {


  if (!Email || !Password) {
    alert('Please provide both Email and Password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Email, Password, StudentId, TeacherId })
    });

    
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Пользователь с таким Email уже существует');
      } else {
        throw new Error('Failed to add user');
      }
      
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }
}

// Функция для обновления данных пользователя
async function updateUser(id) {
  const Email = document.getElementById('Email').value;
  const Password = document.getElementById('Password').value;

  if (!Email && !Password) {
    alert('Пожалуйста, укажите Email и пароль');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Email, Password})
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    alert('Данные успеспешно изменены');
  } catch (err) {
    console.error(err);
    alert('Ошибка при обновлении данных пользователя');
  }
}

// Функция для получения списка пользователей
async function getUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();

    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Очистить текущий список

    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = `${user.Email} - StudentId: ${user.StudentId}, TeacherId: ${user.TeacherId}`;
      userList.appendChild(listItem);
    });
  } catch (err) {
    console.error(err);
    alert('Ошибка при получении списка пользователей');
  }
}

// Функция для получения пользователя по ID
async function getUserById(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const user = await response.json();
    console.log(user);
  } catch (err) {
    console.error(err);
    alert('Ошибка при получении данных пользователя');
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    // Сохраняем токен в localStorage
    localStorage.setItem('token', data.token); 
    console.log('Токен:', data.token);
    console.log('Информация о пользователе:', data.user);

    return true;

     // Перенаправляем на страницу профиля
  } catch (err) {
    console.error('Ошибка при авторизации:', err);
    alert('Ошибка при авторизации: ' + err.message);
    return false;
  }
}


export default {
  addUser,
  updateUser,
  getUsers,
  getUserById,
  loginUser
};
