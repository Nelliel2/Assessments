// Функция для добавления нового пользователя
async function addUser() {
    const Email = document.getElementById('Email').value;
    const Password = document.getElementById('Password').value;
    const StudentId = document.getElementById('StudentId').value;
    const TeacherId = document.getElementById('TeacherId').value;
  
    if (!Email || !Password) {
      alert('Please provide both Email and Password');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email, Password, StudentId, TeacherId })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
  
      alert('User added successfully');
    } catch (err) {
      console.error(err);
      alert('Error adding user');
    }
  }
  
  // Функция для обновления данных пользователя
async function updateUser(id) {
    const Email = document.getElementById('Email').value;
    const Password = document.getElementById('Password').value;
    const StudentId = document.getElementById('StudentId').value;
    const TeacherId = document.getElementById('TeacherId').value;
  
    if (!Email || !Password) {
      alert('Please provide both Email and Password');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email, Password, StudentId, TeacherId })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      alert('User updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  }
  
  // Функция для получения списка пользователей
async function getUsers() {
    try {
      const response = await fetch('http://localhost:3000/users');
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
      alert('Error fetching users');
    }
  }
  
  // Функция для получения пользователя по ID
async function getUserById(id) {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`);
      const user = await response.json();
      console.log(user);
    } catch (err) {
      console.error(err);
      alert('Error fetching user');
    }
  }
  