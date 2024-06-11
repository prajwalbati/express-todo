const passport = require('passport');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRouter = require('./auth');
const todoRouter = require('./todo');
const userRouter = require("./user");

module.exports = (app) => {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Todo Backend API Documentation',
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
    // health check
    app.get("/api/health", (req, res) => {
        const data = {
            uptime: process.uptime(),
            message: 'Ok',
            date: new Date()
        }

        return res.status(200).json(data);
    });

    app.use('/api/auth', authRouter);

    app.use("/api/user", [passport.authenticate('bearer', {session: false})], userRouter);

    app.use('/api/todos', [passport.authenticate('bearer', {session: false})], todoRouter);
};
