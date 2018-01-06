import axios from 'axios';
import {
  getNewAndUpdatedRows,
  getRemovedIds,
  getHiddenColsFromResponse,
  getSortedColumnsByRank,
  getHiddenColsFromContext,
  getMovedColumnsIndexRange,
  mapColumnIdToName,
  getUpdatedColumnsObj,
  prepareRightPanel,
  prepareDetailedButton
} from '../lib/helper';

export function getContacts(dispatch) {
  axios
    .get('/api/contacts')
    .then(response => {
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
    console.log(changes);
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

export function getColumnsOfContacts(dispatch) {
  axios
    .get('/api/contacts/columns')
    .then(response => {
      const hiddenColumnsIndexes = getHiddenColsFromResponse(response);
      dispatch({
        type: 'GET_CONTACTS_HIDDENCOLUMNS',
        payload: hiddenColumnsIndexes
      });
      return response;
    })
    .then(response => {
      const columns = response.data;
      const getSortedColumnsByRankBind = getSortedColumnsByRank.bind(this);
      return getSortedColumnsByRankBind(columns);
    })
    .then(columnsHeader => {
      dispatch({
        type: 'GET_ALL_CONTACTS_COLUMNS_HEADER',
        payload: columnsHeader
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function updateSource() {
  const columns = this.state.columns;
  for (const column of columns) {
    if (column.data === 'name') {
      column.source = this.props.opportunityIDsNames.map(i => i.name);
    }
  }
  this.forceUpdate();
}

export function updateColumnOrderOfContacts(columns, target) {
  return function(dispatch) {
    if (target) {
      getMovedColumnsIndexRange(columns, target).then(movedRange => {
        const mapColumnIdToNameBind = mapColumnIdToName.bind(this);
        mapColumnIdToNameBind()
          .then(ColumnIdToNameObj => [ColumnIdToNameObj, movedRange])
          .then(resArray => {
            const ColumnIdToNameObj = resArray[0];
            const movedRangeIndexes = resArray[1];
            const afterColumnsArray = this.refs.hot.hotInstance.getColHeader();
            getUpdatedColumnsObj(
              ColumnIdToNameObj,
              movedRangeIndexes,
              afterColumnsArray
            ).then(updatedColumnOrders => {
              axios
                .put('/api/contacts/columns/order', { updatedColumnOrders })
                .then(dispatch(getColumnsOfContacts));
            });
          });
      });
    }
  };
}

export function updateHiddenColumnsOfContacts(context) {
  return function(dispatch) {
    const getHiddenColsBound = getHiddenColsFromContext.bind(this);
    const hiddenColumns = getHiddenColsBound(context);
    axios.put('/api/contacts/columns/hidden', { hiddenColumns }).then(() => {
      dispatch(getColumnsOfContacts.bind(this));
    });
  };
}

export function getContactById(id) {
  return function(dispatch) {
    axios
      .get('/api/contact', { params: { id } })
      .then(response => {
        const returnedEntity = response.data[0];
        return returnedEntity;
      })
      .then(returnedEntity => {
        axios
          .get('/api/opportunities/columns')
          .then(response => {
            const columnOrder = response.data;
            const compare = (a, b) => {
              if (a.rank < b.rank) return -1;
              if (a.rank > b.rank) return 1;
              return 0;
            };
            columnOrder.sort(compare);
            return [columnOrder, returnedEntity];
          })
          .then(response => {
            const columnOrder = response[0];
            const returnedEntity = response[1];
            const rankedFields = [];
            for (const i of columnOrder) {
              const tempObj = {};
              tempObj[i.name] = returnedEntity[i.name];
              rankedFields.push(tempObj);
            }
            return rankedFields;
          })
          .then(rankedFields => {
            dispatch({
              type: 'GET_CONTACT_BY_ID',
              payload: rankedFields
            });
          })
          .catch(err => {
            console.error.bind(err);
          });
      });
  };
}

export function clickedDetailButtonOnContacts(event, coords, td) {
  return function(dispatch) {
    const prepareRightPanelBound = prepareRightPanel.bind(this);
    const rowId = prepareRightPanelBound(event, coords, td);
    dispatch(getContactById(rowId));
  };
}

export function displayDetailButtonOnContacts(event, coords, td) {
  return function(dispatch) {
    const prepareDetailedButtonBound = prepareDetailedButton.bind(this);
    const button = prepareDetailedButtonBound(event, coords, td);
    // attach onclick event to button
    button.onclick = () => {
      this.props.dispatch(
        clickedDetailButtonOnContacts(event, coords, td).bind(this)
      );
    };
    // insert button
    if (event.target.parentNode.nodeName.toLowerCase() === 'tr') {
      event.target.parentNode.insertBefore(button, null);
    }
  };
}
