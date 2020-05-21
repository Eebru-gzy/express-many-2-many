const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  const queryy = {
    text:
      "SELECT m.id, m.text, t.name FROM messages m JOIN messages_tags mt ON mt.message_id=m.id JOIN tags t ON t.id=mt.tag_id ORDER BY m.id",
  };

  try {
    const result = await db.query(queryy);
    let startIndex = 0;
    let messages = [];

    for (let i = 0; i < result.rows.length; i++) {
      let eachMsg = result.rows[i];

      if (startIndex !== eachMsg.id) {
        startIndex = eachMsg.id;
        eachMsg.tags = [];
        eachMsg.tags.push(eachMsg.name);
        delete eachMsg.name;
        messages.push(eachMsg);
      } else {
        messages[startIndex - 1].tags.push(eachMsg.name);
      }
    }
    return res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next)=> {
  const queryy = {
    text: 'INSERT INTO messages (text) VALUES ($1) RETURNING *',
    values: [req.body.text],
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
    text: 'UPDATE messages SET text=$1 WHERE id=$2 RETURNING *',
    values: [req.body.text, req.params.id],
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
    text: 'DELETE FROM messages WHERE id = $1 RETURNING *',
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
