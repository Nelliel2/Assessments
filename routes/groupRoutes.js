import express from 'express';
import { Group, StudyPlan, Subject } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API для работы с группами
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Получение списка всех групп
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список групп.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /group/{id}/subjects:
 *   get:
 *     summary: Получение списка предметов по ID группы
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список предметов.
 *       404:
 *         description: Предметы для данной группы не найдены
 *       500:
 *         description: Ошибка при получении предметов по группе
 */
router.get('/group/:id/subjects', async (req, res) => {
  try {
    const { id } = req.params;

    const subjects = await StudyPlan.findAll({
      where: { GroupId: id },
      include: [
        {
          model: Subject,
          attributes: ['id', 'Name']
        }
      ]
    });

    if (!subjects.length) {
      return res.status(404).json({ message: 'Предметы для данной группы не найдены' });
    }

    const subjectList = subjects.map(subject => subject.Subject);

    res.status(200).json(subjectList);
  } catch (err) {
    console.error('Ошибка при получении предметов по группе:', err);
    res.status(500).json({ message: 'Ошибка при получении предметов по группе' });
  }
});


/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Добавление новой группы
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Название группы
 *     responses:
 *       201:
 *         description: Группа успешно добавлена
 *       500:
 *         description: Ошибка сервера
 */
router.post('/groups', async (req, res) => {
  const { Name } = req.body;
  try {
    const group = await Group.create({ Name });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   put:
 *     summary: Обновление данных группы
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Название группы
 *     responses:
 *       200:
 *         description: Группа успешно обновлена
 *       400:
 *         description: Неверный запрос
 *       404:
 *         description: Группа не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.put('/groups/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).send('Group not found');
    }
    group.Name = Name;
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Удаление группы
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       204:
 *         description: Группа успешно удалена
 *       404:
 *         description: Группа не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/groups/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).send('Group not found');
    }
    await group.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Получение группы
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       200:
 *         description: Успешно. Возвращает группу.
 *       404:
 *         description: Группа не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.get('/groups/:id', async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Ошибка при получении группы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;