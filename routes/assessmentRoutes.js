import express from 'express';
import { Assessment } from '../models/internal.js';
import { Op, sequelize } from '../db_connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assessments
 *   description: API для работы с оценками
 */

/**
 * @swagger
 * /assessments:
 *   get:
 *     summary: Получение всех оценок
 *     tags: [Assessments]
 *     responses:
 *       200:
 *         description: Успешно. Возвращает все оценки.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/assessments', async (req, res) => {
  try {
    const assessments = await Assessment.findAll();
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /students/{studentId}/assessments:
 *   get:
 *     summary: Получение оценок конкретного студента
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID студента
 *     responses:
 *       200:
 *         description: Успешно. Возвращает оценки студента.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/students/:studentId/assessments', async (req, res) => {
  const { studentId } = req.params;
  try {
    const assessments = await Assessment.findAll({ where: { StudentId: studentId } });
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /subjects/{subjectId}/assessments:
 *   get:
 *     summary: Получение оценок по конкретному предмету
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Успешно. Возвращает оценки для данного предмета.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/subjects/:subjectId/assessments', async (req, res) => {
  const { subjectId } = req.params;
  try {
    const assessments = await Assessment.findAll({ where: { SubjectId: subjectId } });
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/**
 * @swagger
 * /assessments:
 *   post:
 *     summary: Добавление новой оценки
 *     tags: [Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StudentId:
 *                 type: integer
 *                 description: ID студента
 *               SubjectId:
 *                 type: integer
 *                 description: ID предмета
 *               Assessment:
 *                 type: integer
 *                 description: Оценка
 *               Date:
 *                 type: string
 *                 format: date
 *                 description: Дата оценки
 *     responses:
 *       201:
 *         description: Оценка успешно добавлена
 *       500:
 *         description: Ошибка сервера
 */
router.post('/assessments', async (req, res) => {
  console.log(req);
  console.log(req.body);
  const { StudentId, SubjectId, Assessment: assessmentValue, Date } = req.body;
  try {
    const newAssessment = await Assessment.create({
      StudentId,
      SubjectId,
      Assessment: assessmentValue,
      Date
    });
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /assessments/{id}:
 *   put:
 *     summary: Обновление оценки
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID оценки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Assessment:
 *                 type: integer
 *                 description: Новая оценка
 *               Date:
 *                 type: string
 *                 format: date
 *                 description: Новая дата оценки
 *     responses:
 *       200:
 *         description: Оценка успешно обновлена
 *       404:
 *         description: Оценка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.put('/assessments/:id', async (req, res) => {
  const { id } = req.params;
  const { Assessment: newValue, Date: newDate } = req.body;
  try {
    const assessment = await Assessment.findByPk(id);
    if (!assessment) {
      return res.status(404).send('Assessment not found');
    }
    assessment.Assessment = newValue;
    assessment.Date = newDate;
    await assessment.save();
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /assessments/{id}:
 *   delete:
 *     summary: Удаление оценки
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID оценки
 *     responses:
 *       204:
 *         description: Оценка успешно удалена
 *       404:
 *         description: Оценка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/assessments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assessment = await Assessment.findByPk(id);
    if (!assessment) {
      return res.status(404).send('Assessment not found');
    }
    await assessment.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /assessments/student/{studentId}/subject/{subjectId}:
 *   get:
 *     summary: Получение оценок студента по предмету с фильтрацией и сортировкой по дате
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID студента
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID предмета
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Начальная дата для фильтрации
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Конечная дата для фильтрации
 *     responses:
 *       200:
 *         description: Успешно. Возвращает отфильтрованные и отсортированные оценки.
 *       500:
 *         description: Ошибка сервера
 */
router.get('/assessments/student/:studentId/subject/:subjectId', async (req, res) => {
  const { studentId, subjectId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Условие для WHERE
    const whereClause = {
      StudentId: studentId,
      SubjectId: subjectId
    };

    // Если переданы даты, добавляем фильтрацию по дате
    if (startDate && endDate) {
      whereClause.Date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.Date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.Date = {
        [Op.lte]: endDate
      };
    }

    // Получаем оценки студента по предмету с сортировкой по дате
    const assessments = await Assessment.findAll({
      where: whereClause,
      order: [
        [sequelize.literal("STRFTIME('%Y-%m-%d', Date)"), 'ASC'] // Сортировка по дате (возрастание)
      ]
    });

    res.status(200).json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


export default router;