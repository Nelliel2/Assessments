import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Настройка опций для Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Оценок',
      version: '1.0.0',
      description: 'Документация API для работы с оценками',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Assessment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор оценки',
            },
            Assessment: {
              type: 'integer',
              description: 'Значение оценки (балл)',
            },
            Date: {
              type: 'string',
              format: 'date-time',
              description: 'Дата выставления оценки',
            },
            SubjectId: {
              type: 'integer',
              description: 'Идентификатор предмета',
            },
            StudentId: {
              type: 'integer',
              description: 'Идентификатор студента',
            },
          },
          required: ['Assessment', 'Date', 'SubjectId', 'StudentId'],
          example: {
            id: 1,
            Assessment: 5,
            Date: '2024-01-01T12:00:00Z',
            SubjectId: 101,
            StudentId: 202,
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор группы',
            },
            Name: {
              type: 'string',
              description: 'Название группы',
            },
          },
          required: ['Name'],
          example: {
            id: 1,
            Name: 'Mathematics Group A',
          },
        },
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор студента',
            },
            Name: {
              type: 'string',
              description: 'Имя студента',
            },
            Surname: {
              type: 'string',
              description: 'Фамилия студента',
            },
            Patronymic: {
              type: 'string',
              description: 'Отчество студента',
            },
            GroupId: {
              type: 'integer',
              description: 'Идентификатор группы, в которой учится студент',
            },
          },
          required: ['Name', 'Surname', 'GroupId'],
          example: {
            id: 1,
            Name: 'John',
            Surname: 'Doe',
            Patronymic: 'Ivanovich',
            GroupId: 2,
          },
        },
        StudyPlan: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор учебного плана',
            },
            GroupId: {
              type: 'integer',
              description: 'Идентификатор группы',
            },
            SubjectId: {
              type: 'integer',
              description: 'Идентификатор предмета',
            },
            TeacherId: {
              type: 'integer',
              description: 'Идентификатор преподавателя',
            },
          },
          required: ['GroupId', 'SubjectId', 'TeacherId'],
          example: {
            id: 1,
            GroupId: 2,
            SubjectId: 3,
            TeacherId: 4,
          },
        },
        Subject: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор предмета',
            },
            Name: {
              type: 'string',
              description: 'Название предмета',
            },
          },
          required: ['Name'],
          example: {
            id: 1,
            Name: 'Математика',
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор преподавателя',
            },
            Name: {
              type: 'string',
              description: 'Имя преподавателя',
            },
            Surname: {
              type: 'string',
              description: 'Фамилия преподавателя',
            },
            Patronymic: {
              type: 'string',
              description: 'Отчество преподавателя (необязательное поле)',
            },
          },
          required: ['Name', 'Surname'],
          example: {
            id: 1,
            Name: 'Иван',
            Surname: 'Иванов',
            Patronymic: 'Иванович',
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор пользователя',
            },
            Email: {
              type: 'string',
              description: 'Электронная почта пользователя',
            },
            Password: {
              type: 'string',
              description: 'Пароль пользователя',
            },
            StudentId: {
              type: 'integer',
              description: 'Идентификатор студента (если есть)',
            },
            TeacherId: {
              type: 'integer',
              description: 'Идентификатор преподавателя (если есть)',
            },
          },
          required: ['Email', 'Password'],
          example: {
            id: 1,
            Email: 'user@example.com',
            Password: 'password123',
            StudentId: null,
            TeacherId: 2,
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],  // Путь к API-роутам
};

// Генерация спецификации
const swaggerSpec = swaggerJSDoc(options);

// Функция для подключения Swagger UI к Express
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default setupSwagger;
