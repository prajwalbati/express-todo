const passport = require('passport');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRouter = require('./auth');
const todoRouter = require('./todo');

module.exports = (app) => {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Todo Backend API',
                version: '2.0.0'
            },
            servers: [{
                url: process.env.API_URL,
                description: "API URL"
            }],
            components:{
                securitySchemes: {
                    bearerAuth:{
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                        description: 'Bearer Token'
                    }
                }
            }
        },
        apis: ['./docs/*.yml']
    };
    const openapiSpecification = swaggerJsdoc(swaggerOptions)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

    app.use(cors());
    app.use('/api/auth', authRouter);
    app.use('/api/todos', [passport.authenticate('bearer', {session: false})], todoRouter);
};
