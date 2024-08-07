
import express from 'express';
import bookRoutes from './book-route.js';
import memberRoute from './member-route.js';

const router = express.Router();
router.use(bookRoutes)
router.use(memberRoute)

export {
  router
}
