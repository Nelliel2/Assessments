import express from 'express';
import { Teacher, StudyPlan, Subject } from '../models/internal.js';

const router = express.Router();


// API для получения списка преподавателей
router.get('/teachers', async (req, res) => {
    console.log('Тело запроса:', req.body);
    try {
      const teachers = await Teacher.findAll();
      res.json(teachers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  
  // API для добавления нового преподавателя
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
  
  // API для обновления данных преподавателя
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
  
  // API для удаления преподавателя
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
  
  
  // API для получения предметов проеподавателя
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