import axios from 'axios';
import { getNewAndUpdatedRows, getRemovedIds } from '../lib/helper';

export function getContacts(dispatch) {
  axios
    .get('/api/contacts')
    .then(response => {
      console.log('get all contacts: ', response.data);
      dispatch({
        type: 'GET_ALL_CONTACTS',
        payload: response.data
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function createAndUpdateContacts(changes, source) {
  return function(dispatch) {
    const getNewAndUpdatedRowsBound = getNewAndUpdatedRows.bind(this);
    const newAndUpdatedRows = getNewAndUpdatedRowsBound(changes, source);
    if (newAndUpdatedRows) {
      const newRows = newAndUpdatedRows.newRows;
      const updatedRows = newAndUpdatedRows.updatedRows;

      if (newRows.length > 0) {
        axios.post('/api/contacts', { newRows }).then(() => {
          dispatch(getContacts);
        });
      }

      if (updatedRows.length > 0) {
        axios.put('/api/contacts', { updatedRows }).then(() => {
          dispatch(getContacts);
        });
      }
    }
  };
}

export function deleteContacts(index, amount) {
  return function(dispatch) {
    // get deleted row ID(s)
    const getRemovedIdsBound = getRemovedIds.bind(this);
    const removedIds = getRemovedIdsBound();
    axios({
      method: 'DELETE',
      url: '/api/contacts',
      data: {
        removedIds
      }
    });
  };
}

export function getAllContactIDsNames() {
  const request = axios.get('/api/contacts/names');
  return {
    type: 'GET_ALL_CONTACT_IDS_NAMES',
    payload: request
  };
}

export function relateContactToAccount(changes, source, contactID) {
  return function(dispatch) {
    // get ID of the contact name that was selected
    if (changes) {
      const rowIndex = changes[0][0];
      const accountID = this.refs.hot.hotInstance.getSourceDataAtRow(rowIndex).id;
      axios
        .put(`/api/contacts/account/${contactID}/${accountID}`);
        // .then(response => console.log('THE RESPONSE: ', response));
    }
  };
}
