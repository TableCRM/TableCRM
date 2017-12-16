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
app.post('/api/contacts', contacts.createAndUpdateContacts);
app.put('/api/contacts', contacts.createAndUpdateContacts);
app.delete('/api/contacts', contacts.deleteContacts);

app.get('/api/contacts/names', contacts.getAllContactIDsNames);
app.put('/api/contacts/account/:contactID/:accountID', contacts.relateContactToAccount);

app.get('/api/opportunities', opportunities.getAllOpportunities);
app.post('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.put('/api/opportunities', opportunities.createAndUpdateOpportunities);
app.delete('/api/opportunities', opportunities.deleteOpportunities);

app.get('/api/opportunities/columns', opportunities.getHiddenColumnsOfOpportunities);
app.put('/api/opportunities/columns', opportunities.updateHiddenColumnsOfOpportunities);

app.get('/api/opportunities/names', opportunities.getAllOpportunityIDsNames);
app.get('/api/opportunity/:oppID/:contactID', opportunities.relateOppToContact);
app.get('/api/opportunity/account/:oppID/:accountID', opportunities.relateOppToAccount);

app.get('/api/accounts', accounts.getAllAccounts);
app.delete('/api/accounts', accounts.deleteAccounts);
app.post('/api/accounts', accounts.createAndUpdateAccounts);
app.put('/api/accounts', accounts.createAndUpdateAccounts);

app.get('/api/leads', leads.getAllLeads);
app.post('/api/leads', leads.createAndUpdateLeads);
app.put('/api/leads', leads.createAndUpdateLeads);
app.delete('/api/leads', leads.deleteLeads);
app.get('/api/leads/columns', leads.getColumnOrders);
app.put('/api/leads/columns', leads.updateColumnOrders);

app.get('/api/dashboard/totaloppvalueperstatus', dashboard.getTotalOppValuePerStatus);
app.get('/api/dashboard/totaloppvalueperstage', dashboard.getTotalOppValuePerStage);

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Server
* * * * * * * * * * * * * * * * * * * * * * * * * * */

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
