import express from 'express';
import bookController from '../controllers/book-controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - code
 *         - title
 *         - author
 *         - stock
 *       properties:
 *         code:
 *           type: string
 *           description: Unique ID of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The book author
 *         stock:
 *           type: number
 *           description: The quantity of the book that available initialy
 *       example:
 *         code: JK-45
 *         title: Harry Potter
 *         author: J.K Rowling
 *         stock: 1
 */

/**
 * @swagger
 * tags:
 *  name: Books
 * /api/books:
 *    get:
 *      summary: Get all books that did not borrowed
 *      tags: [Books]
 *      responses:
 *        200:
 *          desription: List of books that not being borrowed
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Book'
 */
router.get('/books', bookController.list);

/**
 * @swagger
 * tags:
 *  name: Books
 * /api/books:
 *    post:
 *      summary: Create a book
 *      tags: [Books]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *      responses:
 *        200:
 *          desription: Create a book
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *        400:
 *          description: User error
 *        500:
 *          description: Server Error
 */
router.post('/books', bookController.create);

/**
 * @swagger
 * tags:
 *  name: Books
 * /api/books/borrow:
 *    post:
 *      summary: Borrow some books
 *      tags: [Books]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - member_code
 *              - book_codes
 *             properties:
 *               member_code:
 *                  type: string
 *                  description: Unique ID of a member that wanted to borrow the books
 *               book_codes:
 *                  type: array
 *                  description: Array string of the book id
 *             example:
 *                  member_code: M001
 *                  book_codes: ['JK-45', 'SHR-1']
 *      responses:
 *        200:
 *          desription: Create a book
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example: 
 *                  id: 1
 *                  member_code: M001
 *                  book_code: JK-45
 *                  is_return: false
 *                  borrowed_date: 2024-08-07 16:00:00
 *                  return_date: 2024-08-14 16:00:00      
 *        400:
 *          description: User error
 *        500:
 *          description: Server Error
 */
router.post('/books/borrow', bookController.borrow);

/**
 * @swagger
 * tags:
 *  name: Books
 * /api/books/return:
 *    post:
 *      summary: Return the books
 *      tags: [Books]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - member_code
 *              - book_codes
 *             properties:
 *               member_code:
 *                  type: string
 *                  description: Unique ID of a member that wanted to return the books
 *               book_codes:
 *                  type: array
 *                  description: Array string of the book id
 *             example:
 *                  member_code: M001
 *                  book_codes: ['JK-45', 'SHR-1']
 *      responses:
 *        200:
 *          desription: Create a book
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example: 
 *                  id: 1
 *                  member_code: M001
 *                  book_code: JK-45
 *                  is_return: true
 *                  borrowed_date: 2024-08-07 16:00:00
 *                  return_date: 2024-08-14 16:00:00      
 *        400:
 *          description: User error
 *        500:
 *          description: Server Error
 */
router.post('/books/return', bookController.returnBook);

export default router