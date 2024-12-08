import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const StudentsGroup = sequelize.define('StudentsGroup', {});

export { StudentsGroup };

