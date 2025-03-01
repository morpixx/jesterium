const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jesterium API',
      version: '1.0.0',
      description: 'API документація для проекту Jesterium - криптовалютної платформи з промокодами та гаманцями',
      contact: {
        name: 'Jesterium Support',
        email: 'support@jesterium.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Локальний сервер розробки'
      },
      {
        url: 'https://api.jesterium.com',
        description: 'Виробничий сервер'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; 