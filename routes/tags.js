const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res, next)=> {
  try {
    const result = await db.query('SELECT t.id, t.name, m.text FROM tags t JOIN messages_tags mt ON mt.tag_id=t.id JOIN messages m ON m.id=mt.message_id ORDER BY t.id');

    let index = 0;
    const returnMsg = [];

    for (let i=0; i<result.rows.length; i++) {
      const eachMsg = result.rows[i];

      if(index !== eachMsg.id) {
        index=eachMsg.id;
        eachMsg.messages = [];
        eachMsg.messages.push(eachMsg.text);
        delete eachMsg.text;
        returnMsg.push(eachMsg);
      }else {
        returnMsg[index - 1].messages.push(eachMsg.text);
      }
    }
    return res.json(returnMsg);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next)=> {
  const queryy = {
    text: 'INSERT INTO tags (name) VALUES ($1) RETURNING *',
    values: [req.body.name],
  }
  
  try {
    const result = await db.query(queryy);
    return res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }

});

router.patch('/:id', async (req, res, next)=> {
  const queryy = {
    text: 'UPDATE tags SET name=$1 WHERE id=$2 RETURNING *',
    values: [req.body.name, req.params.id],
  }

  try {
    const result = await db.query(queryy);
    return res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', async (req, res, next)=> {
  const query = {
    text: 'DELETE FROM tags WHERE id = $1 RETURNING *',
    values: [req.params.id],
  }

  try {
    const result = await db.query(query);
    return res.json(result.rows[0]);
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;