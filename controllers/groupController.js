const token = localStorage.getItem('token');

// Функция для получения списка предметов
async function fetchGroups() {
    try {
        const response = await fetch('http://localhost:3000/groups');
        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }
        const groups = await response.json();
        const select = document.getElementById('group-name-choice');
        if (select) {
            select.innerHTML = '';  // Очищаем список
            groups.forEach(group => {
                const option = document.createElement('option');
                option.innerHTML = group.Name;
                option.value = group.id;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error(err);
        alert('Error fetching groups');
    }
}

// Функция для добавления нового предмета
async function addGroup() {
    const Name = document.getElementById('Name').value;
    if (!Name) {
        alert('Please provide a Name for the group');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name })
        });

        if (!response.ok) {
            throw new Error('Failed to add group');
        }

        fetchGroups();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error adding group');
    }
}

// Функция для удаления предмета
async function deleteGroup(id) {
    try {
        const response = await fetch(`http://localhost:3000/groups/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete group');
        }

        fetchGroups();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error deleting group');
    }
}

// Функция для обновления данных предмета
async function updateGroup(id) {
    const Name = prompt("Enter new Name for the group:");
    if (!Name) {
        alert('Please provide a valid Name');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name })
        });

        if (!response.ok) {
            throw new Error('Failed to update group');
        }

        fetchGroups();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error updating group');
    }
}


async function fetchGroupById(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/groups/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // 🟢 Отправляем токен в заголовке
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных о группе');
        }

        const group = await response.json();
        return group.Name;

    } catch (error) {
        console.error('Ошибка при запросе группы:', error);
        alert('Ошибка при получении группы');
    }
}

async function getSubjectsByGroupId(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/group/${groupId}/subjects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении предметов по группе');
        }

        const subjects = await response.json();

        const select = document.getElementById('subject-name-choice');
        if (select) {
            select.innerHTML = '';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.innerHTML = subject.Name;
                option.value = subject.id;
                select.appendChild(option);
            });
        }

    } catch (err) {
        console.error('Ошибка при загрузке предметов по группе:', err);
        alert('Ошибка при загрузке предметов. Попробуйте позже.');
    }
}

export default {
    updateGroup,
    deleteGroup,
    addGroup,
    fetchGroups,
    fetchGroupById,
    getSubjectsByGroupId
};