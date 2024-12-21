import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API Documentation',
    description: 'Автоматически сгенерированная документация',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js', './routes/*.js'];  // Указываем пути к файлам с маршрутами

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  import('./server.js'); 
});
