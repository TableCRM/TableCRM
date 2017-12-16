import axios from 'axios';

import { getNewAndUpdatedRows, getRemovedIds, getHiddenCols, colPropsToIndices } from '../lib/helper';

export function getAllOpportunities() {
  const request = axios.get('/api/opportunities');
  return {
    type: 'GET_ALL_OPPORTUNITIES',
    payload: request
  };
}

export function createAndUpdateOpportunities(changes, source) {
  return function(dispatch) {
    const getNewAndUpdatedRowsBound = getNewAndUpdatedRows.bind(this);
    const newAndUpdatedRows = getNewAndUpdatedRowsBound(changes, source);

    if (newAndUpdatedRows) {
      const newRows = newAndUpdatedRows.newRows;
      const updatedRows = newAndUpdatedRows.updatedRows;

      if (newRows.length > 0) {
        axios.post('/api/opportunities', { newRows }).then(() => {
          dispatch(getAllOpportunities());
        });
      }

      if (updatedRows.length > 0) {
        axios.put('/api/opportunities', { updatedRows }).then(() => {
          dispatch(getAllOpportunities());
        });
      }
    }
  };
}

export function deleteOpportunities(index, amount) {
  return function(dispatch) {
    const getRemovedIdsBound = getRemovedIds.bind(this);
    const removedIds = getRemovedIdsBound();
    axios({
      method: 'DELETE',
      url: '/api/opportunities',
      data: { removedIds }
    });
  };
}

export function getHiddenColumnsOfOpportunities(dispatch) {
  const colPropsToIndicesBound = colPropsToIndices.bind(this);

  axios.get('/api/opportunities/columns').then(response => {
    const hiddenColIndices = colPropsToIndicesBound(response.data);
    dispatch({
      type: 'GET_HIDDENCOLUMNS_OF_OPPORTUNITIES',
      payload: hiddenColIndices
    });
  });
}

export function updateHiddenColumnsOfOpportunities(context) {
  return function(dispatch) {
    const getHiddenColsBound = getHiddenCols.bind(this);
    const hiddenColumns = getHiddenColsBound(context);
    axios.put('/api/opportunities/columns', { hiddenColumns }).then(() => {
      dispatch(getHiddenColumnsOfOpportunities.bind(this));
    });
  };
}

export function getAllOpportunityIDsNames() {
  const request = axios.get('/api/opportunities/names');
  return {
    type: 'GET_ALL_OPPORTUNITY_IDS_NAMES',
    payload: request
  };
}

export function relateOppToContact(changes, source, oppID) {
  return function(dispatch) {
    // get ID of the opportunity name that was selected
    if (changes) {
      const rowIndex = changes[0][0];
      const contactID = this.refs.hot.hotInstance.getSourceDataAtRow(rowIndex).id;
      axios.get(`/api/opportunity/${oppID}/${contactID}`);
    }
  };
}

export function relateOppToAccount(changes, source, oppID) {
  return function(dispatch) {
    // get ID of the opportunity name that was selected
    if (changes) {
      const rowIndex = changes[0][0];
      const accountID = this.refs.hot.hotInstance.getSourceDataAtRow(rowIndex).id;
      axios
        .get(`/api/opportunity/account/${oppID}/${accountID}`);
    }
  };
}
