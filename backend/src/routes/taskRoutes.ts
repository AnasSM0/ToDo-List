import { Router } from 'express';
import pool from '../db';

const router = Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Task" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create task
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO "Task" (id, title, description, completed, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, false, NOW(), NOW()) RETURNING *',
      [title, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    // Dynamic query construction purely for simplicity in this specific CRUD case
    // In a real simplified app, usually we might just update specific fields or all.
    // Let's keep it simple: Fetch, merge, update OR just simple SQL for what's provided.
    
    // We'll simplisticly handle the toggle case (completed) vs edit case.
    
    let query = 'UPDATE "Task" SET "updatedAt" = NOW()';
    const params = [id];
    let paramIndex = 2;

    if (title !== undefined) {
        query += `, title = $${paramIndex++}`;
        params.push(title);
    }
    if (description !== undefined) {
        query += `, description = $${paramIndex++}`;
        params.push(description);
    }
    if (completed !== undefined) {
        query += `, completed = $${paramIndex++}`;
        params.push(completed);
    }

    query += ` WHERE id = $1 RETURNING *`;

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "Task" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
