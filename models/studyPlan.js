import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db_connection.js';

const StudyPlan = sequelize.define('StudyPlan', {
    GroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Groups',
            key: 'id'
        }
    },
    SubjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Subjects',
            key: 'id'
        }
    }
});

export { StudyPlan };

