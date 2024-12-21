import express from 'express';
import { Subject, StudyPlan, Group } from '../models/internal.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API для работы с предметами
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Получение списка всех предметов
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список всех предметов.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Добавление нового предмета
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Название предмета
 *     responses:
 *       201:
 *         description: Предмет успешно добавлен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/subjects', async (req, res) => {
  const { Name } = req.body;
  try {
    const subject = await Subject.create({ Name });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Обновление данных предмета
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Название предмета
 *     responses:
 *       200:
 *         description: Предмет успешно обновлен
 *       400:
 *         description: Неверный запрос
 *       404:
 *         description: Предмет не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).send('Subject not found');
    }
    subject.Name = Name;
    await subject.save();
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Удаление предмета
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     responses:
 *       204:
 *         description: Предмет успешно удален
 *       404:
 *         description: Предмет не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).send('Subject not found');
    }
    await subject.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/**
 * @swagger
 * /subject/{id}/groups:
 *   get:
 *     summary: Получение групп, у которых есть указанный предмет
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список групп.
 *       404:
 *         description: Группы для данного предмета не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.get('/subject/:id/groups', async (req, res) => {
  try {
    const { id } = req.params;

    // Поиск групп, которые связаны с указанным предметом через StudyPlan
    const groups = await StudyPlan.findAll({
      where: { SubjectId: id },
      include: [
        {
          model: Group, // Связываем с моделью Group
          attributes: ['id', 'Name'] // Указываем, какие поля нужны
        }
      ]
    });

    if (!groups.length) {
      return res.status(404).json({ message: 'Группы для данного предмета не найдены' });
    }

    // Формируем массив только с группами (убираем лишние поля StudyPlan)
    const groupList = groups.map(group => group.Group);

    res.status(200).json(groupList);
  } catch (err) {
    console.error('Ошибка при получении групп по предмету:', err);
    res.status(500).json({ message: 'Ошибка при получении групп по предмету' });
  }
});

export default router;