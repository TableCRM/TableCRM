import axios from 'axios';
import moment from 'moment';
import { getNewAndUpdatedRows, getRemovedIds } from '../lib/helper';

export function getAllLeads(dispatch) {
  axios
    .get('/api/leads')
    .then(response => {
      for (const row of response.data) {
        if (row.createdAt)
          row.createdAt = moment(new Date(row.createdAt)).format('MM/DD/YYYY');
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

export function deleteLeads(index, amount) {
  return function(dispatch) {
    const selectedRows = this.refs.hot.hotInstance.getSelected();
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

export function getLeadsColumnOrders(dispatch) {
  axios
    .get('/api/leadsColumnOrders')
    .then(response => {
      const columnsHeader = [];
      const columns = response.data;
      for (const column of columns) {
        columnsHeader.push(column.data);
      }
      return [response.data, columnsHeader];
    })
    .then(response => {
      dispatch({
        type: 'GET_ALL_LEADS_COLUMNS',
        payload: response[0]
      });
      dispatch({
        type: 'GET_ALL_LEADS_COLUMNS_HEADER',
        payload: response[1]
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function updateLeadsColumnOrders(afterColumns) {
  return function(dispatch) {
    const movedColumns = [];
    for (let i = 0; i < afterColumns.length; i++) {
      if (this.props.leadsColumns[i].data !== afterColumns[i]) {
        const tempObj = {};
        tempObj.newOrder = i + 1;
        const data = afterColumns[i];
        tempObj.data = data;
        for (const x of this.props.leadsColumns) {
          if (x.data === afterColumns[i]) {
            tempObj.id = x.id;
          }
        }
        movedColumns.push(tempObj);
      }
    }
    axios
      .put('/api/leadsColumnOrders', { movedColumns })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error.bind(err);
      });
  };
}
