const db = require('./config');
const lib = require('../lib/helper');
const moment = require('moment');

const getAllLeads = (req, res) => {
  db.query('SELECT * from leads', (err, rows) => {
    if (err) console.log(err);
    res.json(rows);
  });
};

const createAndUpdateLeads = (req, res) => {
  let rows;
  if (req.method === 'POST') {
    rows = req.body.newRows;
  } else if (req.method === 'PUT') {
    rows = req.body.updatedRows;
  }

  for (const row of rows) {
    if (row.createdAt)
      row.createdAt = moment(new Date(row.createdAt)).format(
        'YYYY-MM-DD HH:mm:ss'
      );
    const fieldsArr = lib.getFieldsArr(row);
    const fields = lib.getFields(fieldsArr);
    const values = lib.getValues(row, fieldsArr);

    if (req.method === 'POST') {
      db.query(`INSERT INTO leads(${fields}) VALUES (${values});`);
    } else if (req.method === 'PUT') {
      const updateQuery = lib.getUpdateQuery(fieldsArr);
      db.query(
        `INSERT INTO leads(${fields}) VALUES (${
          values
        }) ON DUPLICATE KEY UPDATE ${updateQuery};`
      );
    }
  }

  res.sendStatus(201);
};

const deleteLeads = (req, res) => {
  const removedIds = req.body.removedIds;
  db.query(
    'DELETE FROM leads WHERE (id) IN (?)',
    [removedIds],
    (err, results) => {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
};

const getColumnOrders = (req, res) => {
  db.query('SELECT * from leadsColumns ORDER BY id ASC', (err, rows) => {
    if (err) return console.log(err);
    res.json(rows);
  });
};

const updateColumnOrders = (req, res) => {
  const updatedColumnOrders = req.body.updatedColumnOrders;
  for (const column of updatedColumnOrders) {
    db.query(
      `UPDATE leadsColumns SET rank = ${column.columnOrder} WHERE id = ${
        column.columnId
      }`,
      err => {
        if (err) return console.log(err);
      }
    );
  }
  res.sendStatus(201);
};

module.exports = {
  getAllLeads,
  createAndUpdateLeads,
  deleteLeads,
  getColumnOrders,
  updateColumnOrders
};
