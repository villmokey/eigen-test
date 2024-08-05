import express from 'express'
import {router} from '../routes/api.js'
import { errorMiddleware } from '../middlewares/error-middleware.js';

export const server = express();
server.use(express.json());
server.use(router);
server.use(errorMiddleware);
