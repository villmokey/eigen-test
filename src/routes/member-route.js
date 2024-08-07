import express from 'express';
import memberController from '../controllers/member-controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           description: Unique ID of the member
 *         name:
 *           type: string
 *           description: The name of the member
 *       example:
 *         code: M001
 *         name: Angga
 */

/**
 * @swagger
 * tags:
 *  name: Members
 * /api/members:
 *    get:
 *      summary: Get all member and the number of book that being borrowed
 *      tags: [Members]
 *      responses:
 *        200:
 *          desription: List of members
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Member'
 */
router.get('/members', memberController.list);


/**
 * @swagger
 * tags:
 *  name: Members
 * /api/members:
 *    post:
 *      summary: Create a member
 *      tags: [Members]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *      responses:
 *        200:
 *          desription: Create a member
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Member'
 *        400:
 *          description: User error
 *        500:
 *          description: Server Error
 */
router.post('/members', memberController.create);

export default router
