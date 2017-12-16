/*
Actions, and action creators, are used for changing application state.
An action creator is a function that returns an object (an action)
the action has a 'type' that describes the type of action that was just triggered
that action is then automatically sent to all reducers within the application

below, the function getAccounts is an action creator.

it's customary for redux action types to be all upper-case with words separated by
underscores (snake-casing), like GET_ALL_ACCOUNTS below


*/

import axios from 'axios';
import moment from 'moment';

import { getNewAndUpdatedRows, getRemovedIds } from '../lib/helper';

export function getAllAccounts(dispatch) {
  axios
    .get('/api/accounts')
    .then(response => {
      for (const row of response.data) {
        if (row.createdAt) {
          row.createdAt = moment(new Date(row.createdAt)).format('MM/DD/YYYY');
        }
      }
      return response;
    })
    .then(response => {
      dispatch({
        type: 'GET_ALL_ACCOUNTS',
        payload: response.data
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function getAllLeads(dispatch) {
  axios
    .get('/api/leads')
    .then(response => {
      for (const row of response.data) {
        if (row.createdAt) row.createdAt = moment(new Date(row.createdAt)).format('MM/DD/YYYY');
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

export function createAndUpdateAccounts(changes, source) {
  return function(dispatch) {
    const getNewAndUpdatedRowsBound = getNewAndUpdatedRows.bind(this);
    const newAndUpdatedRows = getNewAndUpdatedRowsBound(changes, source);

    if (newAndUpdatedRows) {
      const newRows = newAndUpdatedRows.newRows;
      const updatedRows = newAndUpdatedRows.updatedRows;

      if (newRows.length > 0) {
        axios.post('/api/accounts', { newRows }).then(() => {
          dispatch(getAllAccounts);
        });
      }

      if (updatedRows.length > 0) {
        axios.put('/api/accounts', { updatedRows }).then(() => {
          dispatch(getAllAccounts);
        });
      }
    }
  };
}

export function deleteAccounts(index, amount) {
  return function(dispatch) {
    const getRemovedIdsBound = getRemovedIds.bind(this);
    const removedIds = getRemovedIdsBound();
    axios({
      method: 'DELETE',
      url: '/api/accounts',
      data: { removedIds }
    });
  };
}
