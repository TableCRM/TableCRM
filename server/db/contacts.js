const db = require('./config');
const lib = require('../lib/helper');

module.exports.getAllContacts = (req, res) => {
  db.query(
    'SELECT c.*,o.name,o.id as opportunityID FROM contacts c LEFT JOIN opportunity_contact oc ON c.id=oc.contactID LEFT JOIN opportunities o ON oc.opportunityID=o.id ORDER BY c.id',
    (err, rows) => {
      if (err) console.log(err);
      res.json(rows);
    }
  );
};

module.exports.createAndUpdateContacts = (req, res) => {
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
      db.query(`INSERT INTO contacts(${fields}) VALUES (${values});`);
    } else if (req.method === 'PUT') {
      const updateQuery = lib.getUpdateQuery(fieldsArr);
      db.query(
        `INSERT INTO contacts(${fields}) VALUES (${
          values
        }) ON DUPLICATE KEY UPDATE ${updateQuery};`
      );
    }
  }

  res.sendStatus(201);
};

module.exports.deleteContacts = (req, res) => {
  const removedIds = req.body.removedIds;
  db.query(`DELETE FROM contacts WHERE id IN (${removedIds});`, err => {
    if (err) return console.log(err);
    res.sendStatus(200);
  });
  // Also delete these contact relation if found in opportunity_contact
};

module.exports.getColumnsOfContacts = (req, res) => {
  db.query('SELECT * from contactsColumns ORDER BY id ASC', (err, rows) => {
    if (err) return console.log(err);
    res.json(rows);
  });
};

module.exports.updateColumnOrdersOfContacts = (req, res) => {
  const updatedColumnOrders = req.body.updatedColumnOrders;
  for (const column of updatedColumnOrders) {
    db.query(
      `UPDATE contactsColumns SET rank = ${column.columnOrder} WHERE id = ${
        column.columnId
      }`,
      err => {
        if (err) return console.log(err);
      }
    );
  }
  res.sendStatus(201);
};

module.exports.updateHiddenColumnsOfContacts = (req, res) => {
  const hiddenColumns = req.body.hiddenColumns;

  db.query('SELECT name, hidden FROM contactsColumns;', (err, columns) => {
    if (!err) {
      for (const column of columns) {
        const name = column.name;
        const hidden = column.hidden;
        if (hidden && !hiddenColumns.includes(name)) {
          db.query(
            `UPDATE contactsColumns SET hidden=false WHERE name='${name}';`
          );
        } else if (!hidden && hiddenColumns.includes(name)) {
          db.query(
            `UPDATE contactsColumns SET hidden=true WHERE name='${name}';`
          );
        }
      }
      res.sendStatus(201);
    } else {
      console.log(err);
    }
  });
};

module.exports.getContactById = (req, res) => {
  const id = req.query.id;
  db.query(`SELECT * from contacts WHERE id = ${id}`, (err, rows) => {
    if (err) console.log(err);
    res.json(rows);
  });
};
