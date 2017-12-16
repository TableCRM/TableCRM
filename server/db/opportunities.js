const db = require('./config');
const lib = require('../lib/helper');

module.exports.getAllOpportunities = (req, res) => {
  db.query('SELECT * from opportunities', (err, rows) => {
    if (!err) {
      res.json(rows);
    }
  });
};

module.exports.createAndUpdateOpportunities = (req, res) => {
  let rows;
  if (req.method === 'POST') {
    rows = req.body.newRows;
  } else if (req.method === 'PUT') {
    rows = req.body.updatedRows;
  }

  for (const row of rows) {
    const fieldsArr = lib.getFieldsArr(row);
    const fields = lib.getFields(fieldsArr);
    const values = lib.getValues(row, fieldsArr);

    if (req.method === 'POST') {
      db.query(`INSERT INTO opportunities(${fields}) VALUES (${values});`);
    } else if (req.method === 'PUT') {
      const updateQuery = lib.getUpdateQuery(fieldsArr);
      db.query(`INSERT INTO opportunities(${fields}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateQuery};`);
    }
  }

  res.sendStatus(201);
};

module.exports.deleteOpportunities = (req, res) => {
  const removedIds = req.body.removedIds;
  db.query(`DELETE FROM opportunities WHERE id IN (${removedIds});`, err => {
    if (!err) {
      res.sendStatus(200);
    }
  });
};

module.exports.getHiddenColumnsOfOpportunities = (req, res) => {
  db.query('SELECT name FROM opportunitiesColumns WHERE hidden=true;', (err, rows) => {
    if (!err) {
      res.json(rows);
    }
  });
};

module.exports.updateHiddenColumnsOfOpportunities = (req, res) => {
  const hiddenColumns = req.body.hiddenColumns;

  db.query('SELECT name, hidden FROM opportunitiesColumns;', (err, rows) => {
    if (!err) {
      for (const row of rows) {
        const name = row.name;
        const hidden = row.hidden;
        if (hidden && !hiddenColumns.includes(name)) {
          db.query(`UPDATE opportunitiesColumns SET hidden=false WHERE name='${name}';`);
        } else if (!hidden && hiddenColumns.includes(name)) {
          db.query(`UPDATE opportunitiesColumns SET hidden=true WHERE name='${name}';`);
        }
      }
      res.sendStatus(201);
    }
  });
};

module.exports.getAllOpportunityIDsNames = (req, res) => {
  db.query('SELECT id,name from opportunities', (err, rows) => {
    if (!err) {
      const result = rows.map(opp => {
        const id = opp.id;
        const name = opp.name;
        return { id, name };
      });
      res.json(result);
    }
  });
};

module.exports.relateOppToContact = (req, res) => {
  const contactID = req.params.contactID;
  const selectedOpportunityID = req.params.oppID;
  // store opp id and contact id in joint table   //use on dup key update
  db.query(
    `INSERT INTO opportunity_contact(contactID,opportunityID) VALUES (${contactID},${
      selectedOpportunityID
    }) ON DUPLICATE KEY UPDATE opportunityID=${selectedOpportunityID};`
  );
};

module.exports.relateOppToAccount = (req, res) => {
  const accountID = req.params.accountID;
  const selectedOpportunityID = req.params.oppID;
  // store opp id and contact id in joint table   //use on dup key update
  db.query(
    `INSERT INTO opportunity_account(accountID,opportunityID) VALUES (${accountID},${
      selectedOpportunityID
    }) ON DUPLICATE KEY UPDATE opportunityID=${selectedOpportunityID};`
  );
};
