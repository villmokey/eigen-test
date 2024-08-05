import express from 'express';
import bookController from '../controllers/book-controller.js';
import memberController from '../controllers/member-controller.js';

const router = express.Router();
router.post('/api/books', bookController.create);
router.post('/api/books/borrow', bookController.borrow);
router.get('/api/books', bookController.list);

router.post('/api/members', memberController.create);
router.get('/api/members', memberController.list);

export {
  router
}