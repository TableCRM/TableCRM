require('dotenv').config();
const express = require('express');
/* * * CORS * * */
const cors = require('cors');
/* * * Parser * * */
const bodyParser = require('body-parser');
/* * * Database * * */
const contacts = require('./db/contacts');
const opportunities = require('./db/opportunities');
const leads = require('./db/leads');
const accounts = require('./db/accounts');

const app = express();

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Middleware
* * * * * * * * * * * * * * * * * * * * * * * * * * */

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Router
* * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get('/api/contacts', contacts.getAllContacts);
app.delete('/api/contacts', contacts.deleteContacts);

app.get('/api/opportunities', opportunities.getAllOpportunities);
app.post('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.put('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.delete('/api/opportunities', opportunities.deleteOpportunities);

app.get('/api/accounts', accounts.getAllAccounts);

app.get('/api/leads', leads.getAllLeads);
app.post('/api/leads', leads.createAndUpdateLeads);
app.put('/api/leads', leads.createAndUpdateLeads);
app.delete('/api/leads', leads.deleteLeads);
app.get('/api/leadsColumnOrders', leads.getColumnOrders);
app.put('/api/leadsColumnOrders', leads.updateColumnOrders);

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Server
* * * * * * * * * * * * * * * * * * * * * * * * * * */

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
