import express from 'express';
import { Student, Group } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


// API для получения списка студентов
router.get('/students', async (req, res) => {
    console.log('Тело запроса:', req.body);
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Получение студента по ID
router.get('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByPk(id, {
            include: [
                {
                    model: Group,
                    attributes: ['id', 'Name']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Студент не найден' });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error('Ошибка при получении студента:', err);
        res.status(500).json({ message: 'Ошибка при получении студента' });
    }
});


// API для добавления нового студента
router.post('/students', async (req, res) => {
    console.log('Тело запроса:', req.body);
    const { Name, Surname, Patronymic, GroupId } = req.body;  // добавляем GroupId
    try {
        const student = await Student.create({ Name, Surname, Patronymic, GroupId });  // добавляем GroupId при создании
        res.status(201).json({ id: student.id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API для обновления данных студента
router.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { Name, Surname, Patronymic } = req.body;
    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        student.Name = Name;
        student.Surname = Surname;
        student.Patronymic = Patronymic;
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API для удаления студента
router.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        await student.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Функция для получения студентов из конкретной группы
async function fetchStudentsByGroup(GroupId) {
    try {
        const students = await Student.findAll({
            where: { GroupId: GroupId }, // Фильтрация по GroupId
        });
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}

router.get('/students/group/:GroupId', async (req, res) => {
    const GroupId = req.params.GroupId;

    try {
        const students = await fetchStudentsByGroup(GroupId);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

export default router;