const { query } = require('../config/database');

class Category {
  static async findAll() {
    const result = await query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ name }) {
    const result = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  static async update(id, { name }) {
    const result = await query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Category;