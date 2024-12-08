import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const StudyPlan = sequelize.define('StudyPlan', {});

export { StudyPlan };

