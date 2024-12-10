import { Assessment } from 'assessment.js';
import { Student } from '/student.js';

// Получить все оценки

export const fetchAssessmentsWithStudents = async (req, res) => {
    try {
        const assessments = await Assessment.findAll({
            include: [{
                model: Student,
                as: 'student', // Это должно соответствовать имени ассоциации
            }],
        });
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments with students:', error);
        res.status(500).json({ message: 'Failed to fetch assessments' });
    }
};


//window.onload = fetchGroups();

export default {
    fetchAssessmentsWithStudents
};