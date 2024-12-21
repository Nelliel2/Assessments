import express from 'express';
import { Teacher, StudyPlan, Subject } from '../models/internal.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API для работы с преподавателями
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Получение списка всех преподавателей
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список преподавателей.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/teachers', async (req, res) => {
  console.log('Тело запроса:', req.body);
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Добавление нового преподавателя
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Имя преподавателя
 *               Surname:
 *                 type: string
 *                 description: Фамилия преподавателя
 *               Patronymic:
 *                 type: string
 *                 description: Отчество преподавателя
 *     responses:
 *       201:
 *         description: Преподаватель успешно добавлен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/teachers', async (req, res) => {
  console.log('Тело запроса:', req.body);
  const { Name, Surname, Patronymic } = req.body;
  try {
    const teacher = await Teacher.create({ Name, Surname, Patronymic });
    res.status(201).json({ id: teacher.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Обновление данных преподавателя
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID преподавателя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Имя преподавателя
 *               Surname:
 *                 type: string
 *                 description: Фамилия преподавателя
 *               Patronymic:
 *                 type: string
 *                 description: Отчество преподавателя
 *     responses:
 *       200:
 *         description: Преподаватель успешно обновлен
 *       404:
 *         description: Преподаватель не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Surname, Patronymic } = req.body;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    teacher.Name = Name;
    teacher.Surname = Surname;
    teacher.Patronymic = Patronymic;
    await teacher.save();
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Удаление преподавателя
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID преподавателя
 *     responses:
 *       204:
 *         description: Преподаватель успешно удален
 *       404:
 *         description: Преподаватель не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    await teacher.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/**
 * @swagger
 * /teacher/{id}/subjects:
 *   get:
 *     summary: Получение списка предметов, которые преподает указанный преподаватель
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID преподавателя
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список предметов.
 *       404:
 *         description: Преподаватель не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/teacher/:id/subjects', async (req, res) => {
  const teacherId = req.params.id;

  try {
    const subjects = await StudyPlan.findAll({
      where: { TeacherId: teacherId },
      include: [
        {
          model: Subject,
          attributes: ['id', 'Name']
        }
      ]
    });

    const result = subjects.map(record => ({
      id: record.Subject.id,
      name: record.Subject.Name
    }));

    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении предметов проеподавателя:', err);
    res.status(500).json({ message: 'Ошибка при получении предметов проеподавателя' });
  }
});


export default router;