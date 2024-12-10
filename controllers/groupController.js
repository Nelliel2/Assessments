// Функция для получения списка предметов
async function fetchGroups() {
    try {
        const response = await fetch('http://localhost:3000/groups');
        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }
        const groups = await response.json();
        const select = document.getElementById('group-name-choice');
        select.innerHTML = '';  // Очищаем список
        groups.forEach(group => {
            const option = document.createElement('option');
            option.innerHTML = group.Name;
            option.value = group.id;
            select.appendChild(option);
        });
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

// Загружаем список предметов при загрузке страницы
//window.onload = fetchGroups;

export default {
    updateGroup,
    deleteGroup,
    addGroup,
    fetchGroups
};