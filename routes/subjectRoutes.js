import express from 'express';
import { Subject, StudyPlan, Group } from '../models/internal.js';

const router = express.Router();


// API для получения списка предметов
router.get('/subjects', async (req, res) => {
    try {
      const subjects = await Subject.findAll();
      res.json(subjects);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для добавления нового предмета
  router.post('/subjects', async (req, res) => {
    const { Name } = req.body;
    try {
      const subject = await Subject.create({ Name });
      res.status(201).json(subject);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для обновления данных предмета
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
  
  // API для удаления предмета
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
  
  
  // Получение групп, у которых есть указанный предмет
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