const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.output.json');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'E-Commerce API Documentation',
        version: '1.0.0',
        description: 'API documentation for the e-commerce platform',
    },
    servers: [
        {
            url: 'http://localhost:3000', // Replace with your server URL
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Files with your endpoints
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger documentation available at http://localhost:3000/api-docs');
};

module.exports = setupSwagger;