import TaskService from '../services/task.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, notes } = req.body;
    const userId = req.kauth.grant.access_token.content.preferred_username || req.kauth.grant.access_token.content.sub;
    const encryptedNotes = notes ? encrypt(notes) : null;
    const task = await TaskService.createTask({ title, description, status, encryptedNotes, userId });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.kauth.grant.access_token.content.preferred_username || req.kauth.grant.access_token.content.sub;
    const tasks = await TaskService.getTasks(userId);
    const decryptedTasks = tasks.map(task => ({
      ...task,
      notes: task.encryptedNotes ? decrypt(task.encryptedNotes) : null,
    }));
    res.json(decryptedTasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;
    const task = await TaskService.getTaskById(id, userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const decryptedTask = {
      ...task,
      notes: task.encryptedNotes ? decrypt(task.encryptedNotes) : null,
    };
    res.json(decryptedTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, notes } = req.body;
    const userId = req.kauth.grant.access_token.content.sub;
    const encryptedNotes = notes ? encrypt(notes) : null;
    const task = await TaskService.updateTask(id, { title, description, status, encryptedNotes, userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;
    const deleted = await TaskService.deleteTask(id, userId);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};