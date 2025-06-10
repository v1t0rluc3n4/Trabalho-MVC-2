const pool = require('../config/database');

class Task {
  static async create({ user_id, title, description, status, priority, due_date }) {
    const query = `
      INSERT INTO tasks (user_id, title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [user_id, title, description || null, status, priority, due_date || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(user_id, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [user_id];

    if (filters.status) {
      query += ` AND status = $${values.length + 1}`;
      values.push(filters.status);
    }
    if (filters.priority) {
      query += ` AND priority = $${values.length + 1}`;
      values.push(filters.priority);
    }
    if (filters.sort) {
      query += ` ORDER BY ${filters.sort}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { title, description, status, priority, due_date } = data;
    const query = `
      UPDATE tasks
      SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const values = [title, description || null, status, priority, due_date || null, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async getStats(user_id) {
    const query = `
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'concluida') as completed,
        COUNT(*) FILTER (WHERE status = 'pendente') as pending,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as progress
      FROM tasks
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }
}

module.exports = Task;