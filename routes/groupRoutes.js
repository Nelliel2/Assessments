import express from 'express';
import { Group, StudyPlan, Subject, Teacher } from '../models/internal.js';
import { Op, sequelize } from '../db_connection.js';
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
 * tags:
 *   name: StudyPlans
 *   description: API для работы с учебным планом
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

/**
 * @swagger
 * /groups/without-subject/{subjectId}:
 *   get:
 *     summary: Получение списка групп, у которых нет указанного предмета
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список групп без указанного предмета.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   Name:
 *                     type: string
 *       404:
 *         description: Группы не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.get('/groups/without-subject/:subjectId', async (req, res) => {
  const { subjectId } = req.params;

  try {
    const groupsWithoutSubject = await Group.findAll({
      where: {
        id: {
          [Op.notIn]: sequelize.Sequelize.literal(`(
            SELECT "GroupId"
            FROM "StudyPlans"
            WHERE "SubjectId" = ${subjectId}
          )`)
        }
      }
    });

    res.json(groupsWithoutSubject);
  } catch (err) {
    console.error('Ошибка при получении групп без предмета:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * @swagger
 * /groups/{groupId}/subjects/{subjectId}/teacher/{teacherId}:
 *   post:
 *     summary: Добавление предмета группе с выбранным преподавателем
 *     tags: [StudyPlans]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID преподавателя
 *     responses:
 *       201:
 *         description: Успешно добавлен предмет группе с преподавателем
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID записи
 *                 GroupId:
 *                   type: integer
 *                   description: ID группы
 *                 SubjectId:
 *                   type: integer
 *                   description: ID предмета
 *                 TeacherId:
 *                   type: integer
 *                   description: ID преподавателя
 *       404:
 *         description: Группа, предмет или преподаватель не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.post('/groups/:groupId/subjects/:subjectId/teacher/:teacherId', async (req, res) => {
  const { groupId, subjectId, teacherId } = req.params;

  try {
    // Проверяем, существует ли указанная группа, предмет и преподаватель
    const group = await Group.findByPk(groupId);
    const subject = await Subject.findByPk(subjectId);
    const teacher = await Teacher.findByPk(teacherId);

    if (!group || !subject || !teacher) {
      return res.status(404).json({ message: 'Group, Subject, or Teacher not found' });
    }

    // Создаем новую запись в таблице StudyPlans для связывания группы, предмета и преподавателя
    const studyPlan = await StudyPlan.create({
      GroupId: groupId,
      SubjectId: subjectId,
      TeacherId: teacherId
    });

    // Возвращаем успешный ответ с данными
    res.status(201).json(studyPlan);
  } catch (err) {
    console.error('Ошибка при добавлении предмета группе:', err);
    res.status(500).json({ message: 'Ошибка при добавлении предмета группе' });
  }
});

/**
 * @swagger
 * /groups/subject/{subjectId}:
 *   get:
 *     summary: Получение групп, которые имеют указанный предмет
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список групп.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   Name:
 *                     type: string
 *       404:
 *         description: Группы для данного предмета не найдены.
 *       500:
 *         description: Ошибка сервера.
 */
router.get('/groups/subject/:subjectId', async (req, res) => {
  const { subjectId } = req.params;

  try {
    // Получаем все группы, которые имеют указанный предмет через StudyPlan
    const groups = await StudyPlan.findAll({
      where: { SubjectId: subjectId },
      include: [
        {
          model: Group,
          attributes: ['id', 'Name']
        }
      ]
    });

    if (!groups.length) {
      return res.status(404).json({ message: 'Группы для данного предмета не найдены' });
    }

    const groupList = groups.map(group => group.Group);
    res.status(200).json(groupList);
  } catch (err) {
    console.error('Ошибка при получении групп по предмету:', err);
    res.status(500).json({ message: 'Ошибка при получении групп по предмету' });
  }
});

export default router;

