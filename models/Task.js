const { query } = require('../config/database');

class Task {
  static async create({ title, description, status, user_id, category_id }) {
    const result = await query(
      `INSERT INTO tasks (title, description, status, user_id, category_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, status, user_id, category_id]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await query(
      `SELECT t.*, c.name as category_name 
       FROM tasks t LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  static async update(id, { title, description, status, category_id }) {
    const result = await query(
      `UPDATE tasks SET 
        title = $1, 
        description = $2, 
        status = $3, 
        category_id = $4,
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, description, status, category_id, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Task;