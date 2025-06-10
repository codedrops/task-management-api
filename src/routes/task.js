import express from 'express';
import { body, param } from 'express-validator';
import { keycloak } from '../config/keycloak.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.js';
import { validate } from '../middlewares/validation.js';

const router = express.Router();

router.post(
  '/',
  keycloak.protect('realm:user'),
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('notes').optional().isString(),
  ]),
  createTask
);

router.get('/', keycloak.protect('realm:user'), getTasks);
router.get('/:id', keycloak.protect('realm:user'), validate([
  param('id').isInt().withMessage('Invalid task ID'),
]), getTaskById);
router.put('/:id', keycloak.protect('realm:user'), validate([
  param('id').isInt().withMessage('Invalid task ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('notes').optional().isString(),
]), updateTask);
router.delete('/:id', keycloak.protect('realm:user'), validate([
  param('id').isInt().withMessage('Invalid task ID'),
]), deleteTask);

export default router;