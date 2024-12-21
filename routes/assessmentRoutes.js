import express from 'express';
import { Assessment } from '../models/internal.js';
import { Op, sequelize } from '../db_connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// API для получения всех оценок
router.get('/assessments', async (req, res) => {
    try {
      const assessments = await Assessment.findAll();
      res.json(assessments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для получения оценок конкретного студента
  router.get('/students/:studentId/assessments', async (req, res) => {
    const { studentId } = req.params;
    try {
      const assessments = await Assessment.findAll({ where: { StudentId: studentId } });
      res.json(assessments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для получения оценок по конкретному предмету
  router.get('/subjects/:subjectId/assessments', async (req, res) => {
    const { subjectId } = req.params;
    try {
      const assessments = await Assessment.findAll({ where: { SubjectId: subjectId } });
      res.json(assessments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для добавления новой оценки
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
  
  // API для обновления оценки по id
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
  
  // API для удаления оценки по id
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
  
  // API для получения оценок студента по предмету с фильтрацией и сортировкой по дате
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