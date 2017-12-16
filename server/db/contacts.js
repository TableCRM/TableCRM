const db = require('./config');
const lib = require('../lib/helper');

const getAllContacts = (req, res) => {
  db.query(
    'SELECT c.*,o.name FROM contacts c LEFT JOIN opportunity_contact oc ON c.id=oc.contactID LEFT JOIN opportunities o ON oc.opportunityID=o.id ORDER BY c.id',
    (err, rows) => {
      if (err) console.log(err);
      res.json(rows);
    }
  );
};

const createAndUpdateContacts = (req, res) => {
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
      db.query(`INSERT INTO contacts(${fields}) VALUES (${values});`);
    } else if (req.method === 'PUT') {
      const updateQuery = lib.getUpdateQuery(fieldsArr);
      db.query(`INSERT INTO contacts(${fields}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateQuery};`);
    }
  }

  res.sendStatus(201);
};

const deleteContacts = (req, res) => {
  const removedIds = req.body.removedIds;
  db.query(`DELETE FROM contacts WHERE id IN (${removedIds});`, err => {
    if (err) return console.log(err);
    res.sendStatus(200);
  });
};

const getAllContactIDsNames = (req, res) => {
  db.query('SELECT id,firstName,lastName from contacts', (err, rows) => {
    if (!err) {
      const result = rows.map(contact => {
        const id = contact.id;
        const name = `${contact.firstName} ${contact.lastName}`;
        return { id, name };
      });
      res.json(result);
    }
  });
};

const relateContactToAccount = (req, res) => {
  const accountID = req.params.accountID;
  const selectedContactID = req.params.contactID;
  // store contact id and account id in joint table   //use on dup key update
  db.query(
    `INSERT INTO contact_account(accountID,contactID) VALUES (${accountID},${
      selectedContactID
    }) ON DUPLICATE KEY UPDATE contactID=${selectedContactID};`,
    err => {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(201);
};

module.exports = {
  getAllContacts,
  deleteContacts,
  createAndUpdateContacts,
  getAllContactIDsNames,
  relateContactToAccount
};
