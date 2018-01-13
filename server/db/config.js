const mysql = require('mysql');

let db;
if (process.env.JAWSDB_URL) {
  // Heroku deployment
  db = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  // local host
  db = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'table_crm'
  });
}

db.connect(err => {
  if (err) {
    console.log('Database connection error', err);
  }
  console.log('Database connection success');
});

module.exports = db;
