import Task from '../models/task.js';
import User from '../models/user.js';

class TaskService {
  static async createTask({ title, description, status, encryptedNotes, userId }) {
    const user = await User.findOne({ where: { keycloakId: userId } });
    if (!user) throw new Error('User not found');
    return Task.create({ title, description, status, encryptedNotes, userId: user.id });
  }

  static async getTasks(userId) {
    const user = await User.findOne({ where: { keycloakId: userId } });
    if (!user) throw new Error('User not found');
    return Task.findAll({ where: { userId: user.id } });
  }

  static async getTaskById(id, userId) {
    const user = await User.findOne({ where: { keycloakId: userId } });
    if (!user) throw new Error('User not found');
    return Task.findOne({ where: { id, userId: user.id } });
  }

  static async updateTask(id, { title, description, status, encryptedNotes, userId }) {
    const user = await User.findOne({ where: { keycloakId: userId } });
    if (!user) throw new Error('User not found');
    const task = await Task.findOne({ where: { id, userId: user.id } } );
    if (!task) return null;
    return task.update({ title, description, status, encryptedNotes });
  }

  static async deleteTask(id, userId) {
    const user = await User.findOne({ where: { keycloakId: userId } });
    if (!user) throw new Error('User not found');
    const task = await Task.findOne({ where: { id, userId: user.id } });
    if (!task) return false;
    await task.destroy();
    return true;
  }
}

export default TaskService;