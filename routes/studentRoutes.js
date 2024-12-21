import express from 'express';
import { Student, Group } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API для работы со студентами
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Получить список всех студентов
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Успешный ответ со списком студентов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   Name:
 *                     type: string
 *                     example: Иван
 *                   Surname:
 *                     type: string
 *                     example: Иванов
 *                   Patronymic:
 *                     type: string
 *                     example: Иванович
 *                   GroupId:
 *                     type: integer
 *                     example: 2
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/students', async (req, res) => {
    console.log('Тело запроса:', req.body);
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Получить студента
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID студента
 *     responses:
 *       200:
 *         description: Успешный ответ с данными студента
 *       404:
 *         description: Студент не найден
 *       500:
 *         description: Ошибка сервера
 */
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


/**
 * @swagger
 * /students:
 *   post:
 *     summary: Добавить нового студента
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Петр
 *               Surname:
 *                 type: string
 *                 example: Петров
 *               Patronymic:
 *                 type: string
 *                 example: Петрович
 *               GroupId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Студент успешно добавлен
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Обновить данные студента
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID студента
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Surname:
 *                 type: string
 *               Patronymic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Данные студента обновлены
 *       404:
 *         description: Студент не найден
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Удалить студента
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID студента
 *     responses:
 *       204:
 *         description: Студент успешно удален
 *       404:
 *         description: Студент не найден
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /students/group/{groupId}:
 *   get:
 *     summary: Получить студентов по ID группы
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: GroupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       200:
 *         description: Успешный ответ со списком студентов
 *       500:
 *         description: Ошибка сервера
 */
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