import axios from 'axios';
import moment from 'moment';
import { getNewAndUpdatedRows } from '../lib/helper.js';
import { getRemovedIds } from '../lib/getRemovedRowIDsHelper.js';

export function getAllLeads(dispatch) {
  axios
    .get('/api/leads')
    .then(response => {
      for (let row of response.data) {
        if (row.createdDate) row.createdDate = moment(new Date(row.createdDate)).format('MM/DD/YYYY');
      }
      return response;
    })
    .then(response => {
      dispatch({
        type: 'GET_ALL_LEADS',
        payload: response.data
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function createAndUpdateLeads(changes, source) {
  return function(dispatch) {
    const postCallback = function(newRows) {
      axios.post('/api/leads', { newRows }).then(() => {
        dispatch(getAllLeads);
      });
    };

    const putCallback = function(updatedRows) {
      axios.put('/api/leads', { updatedRows }).then(() => {
        dispatch(getAllLeads);
      });
    };

    const getNewAndUpdatedRowsBound = getNewAndUpdatedRows.bind(this);
    getNewAndUpdatedRowsBound(changes, source, postCallback, putCallback);
  };
}

export function removeLeads(index, amount) {
  return function(dispatch) {
    // [startRow, startCol, endRow, endCol]
    // selected rows
    const selectedRows = this.refs.hot.hotInstance.getSelected();
    // get deleted row ID(s)
    const getRemovedIdsBound = getRemovedIds.bind(this);
    const removedIds = getRemovedIdsBound(selectedRows);
    axios({
      method: 'DELETE',
      url: '/api/leads',
      data: {
        removedIds
      }
    });
  };
}
