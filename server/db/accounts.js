const db = require('./config');
const lib = require('../lib/helper');
const moment = require('moment');

const getAllAccounts = (req, res) => {
  db.query(
    'SELECT a.*,o.name,c.firstName, c.lastName FROM accounts a LEFT JOIN opportunity_account oa ON a.id=oa.accountID LEFT JOIN opportunities o ON oa.opportunityID=o.id LEFT JOIN contact_account ca ON a.id=ca.accountID LEFT JOIN contacts c ON ca.contactID=c.id ORDER BY a.id',
    (err, rows) => {
      if (!err) {
        rows.forEach(columnDataObject => {
          if (columnDataObject.firstName !== null) {
            columnDataObject.contactFullName = `${columnDataObject.firstName} ${columnDataObject.lastName}`;
          }
        });
        res.json(rows);
      }
    }
  );
};

const createAndUpdateAccounts = (req, res) => {
  let rows;

  if (req.method === 'POST') {
    rows = req.body.newRows;
  } else if (req.method === 'PUT') {
    rows = req.body.updatedRows;
  }

  for (const row of rows) {
    if (row.createdAt) row.createdAt = moment(new Date(row.createdAt)).format('YYYY-MM-DD HH:mm:ss');
    const fieldsArr = lib.getFieldsArr(row);
    const fields = lib.getFields(fieldsArr);
    const values = lib.getValues(row, fieldsArr);

    if (req.method === 'POST') {
      db.query(`INSERT INTO accounts(${fields}) VALUES (${values});`);
    } else if (req.method === 'PUT') {
      const updateQuery = lib.getUpdateQuery(fieldsArr);
      db.query(`INSERT INTO accounts(${fields}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateQuery};`);
    }
  }

  res.sendStatus(201);
};

const deleteAccounts = (req, res) => {
  const removedIds = req.body.removedIds;
  db.query(`DELETE FROM accounts WHERE id IN (${removedIds});`, err => {
    if (err) return console.log(err);
    res.sendStatus(200);
  });
};

module.exports = {
  getAllAccounts,
  createAndUpdateAccounts,
  deleteAccounts
};
