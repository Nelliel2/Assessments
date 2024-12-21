import express from 'express';
import { Group, StudyPlan, Subject } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


// API для получения списка групп
router.get('/groups', async (req, res) => {
    try {
      const groups = await Group.findAll();
      res.json(groups);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // Получение предметов по ID группы
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
  
  
  // API для добавления новой группы
  router.post('/groups', async (req, res) => {
    const { Name } = req.body;
    try {
      const group = await Group.create({ Name });
      res.status(201).json(group);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  // API для обновления данных группы
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
  
  // API для удаления предмета
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
  
  router.get('/groups/:id', authenticateToken, async (req, res) => {
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