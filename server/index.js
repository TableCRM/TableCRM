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
const dashboard = require('./db/dashboard');
/* * * Path * * */
const path = require('path');

const app = express();

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  static
* * * * * * * * * * * * * * * * * * * * * * * * * * */
app.use(express.static(path.join(__dirname, '/../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Middleware
* * * * * * * * * * * * * * * * * * * * * * * * * * */
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Router
* * * * * * * * * * * * * * * * * * * * * * * * * * */
app.get('/api/contact', contacts.getContactById);
app.get('/api/contacts', contacts.getAllContacts);
app.post('/api/contacts', contacts.createAndUpdateContacts);
app.put('/api/contacts', contacts.createAndUpdateContacts);
app.delete('/api/contacts', contacts.deleteContacts);
app.get('/api/contacts/columns', contacts.getColumnsOfContacts);
app.put('/api/contacts/columns/order', contacts.updateColumnOrdersOfContacts);
app.put('/api/contacts/columns/hidden', contacts.updateHiddenColumnsOfContacts);

app.get('/api/opportunity', opportunities.getOpportunityById);
app.get('/api/opportunities', opportunities.getAllOpportunities);
app.post('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.put('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.delete('/api/opportunities', opportunities.deleteOpportunities);

app.get('/api/opportunities/columns', opportunities.getColumnsOfOpportunities);
app.put(
  '/api/opportunities/columns/hidden',
  opportunities.updateHiddenColumnsOfOpportunities
);
app.put(
  '/api/opportunities/columns/order',
  opportunities.updateColumnOrdersOfOpportunities
);
app.get('/api/opportunities/names', opportunities.getAllOpportunityIDsNames);
app.get('/api/opportunity/:oppID/:contactID', opportunities.relateOppToContact);
app.post('/api/opportunity/contact', opportunities.relateOppToContact);

app.get('/api/account', accounts.getAccountById);
app.get('/api/accounts', accounts.getAllAccounts);
app.delete('/api/accounts', accounts.deleteAccounts);
app.post('/api/accounts', accounts.createAndUpdateAccounts);
app.put('/api/accounts', accounts.createAndUpdateAccounts);
app.get('/api/accounts/columns', accounts.getColumnsOfAccounts);
app.put('/api/accounts/columns/order', accounts.updateColumnOrdersOfAccounts);
app.put('/api/accounts/columns/hidden', accounts.updateHiddenColumnsOfAccounts);

app.get('/api/lead', leads.getLeadById);
app.get('/api/leads', leads.getAllLeads);
app.post('/api/leads', leads.createAndUpdateLeads);
app.put('/api/leads', leads.createAndUpdateLeads);
app.delete('/api/leads', leads.deleteLeads);
app.get('/api/leads/columns', leads.getColumnsOfLeads);
app.put('/api/leads/columns/order', leads.updateColumnOrdersOfLeads);
app.put('/api/leads/columns/hidden', leads.updateHiddenColumnsOfLeads);

app.get(
  '/api/dashboard/totaloppvalueperstatus',
  dashboard.getTotalOppValuePerStatus
);
app.get(
  '/api/dashboard/totaloppvalueperstage',
  dashboard.getTotalOppValuePerStage
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Server
* * * * * * * * * * * * * * * * * * * * * * * * * * */

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
