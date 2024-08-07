import express from 'express'
import {router} from '../routes/api.js'
import { errorMiddleware } from '../middlewares/error-middleware.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi  from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

export const server = express();

server.use(express.json());
server.use('/api', router);
server.use(errorMiddleware);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Eigen Test",
      version: "0.1.0",
      description:
      "This is a technical test",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Villian",
        url: "https://villian.my.id",
        email: "villian780@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};


const specs = swaggerJSDoc(swaggerOptions);
server.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
