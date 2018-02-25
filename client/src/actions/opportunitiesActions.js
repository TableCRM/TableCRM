import axios from 'axios';

import {
  getNewAndUpdatedRows,
  getRemovedIds,
  getHiddenColsFromContext,
  colPropsToIndices,
  getHiddenColsFromResponse,
  getSortedColumnsByRank,
  getMovedColumnsIndexRange,
  mapColumnIdToName,
  getUpdatedColumnsObj,
  getHiddenCols,
  buildObjToAssignOpportunityToContact,
  prepareDetailedButton
} from '../lib/helper';

export function getAllOpportunities() {
  const request = axios.get('/api/opportunities');
  return {
    type: 'GET_ALL_OPPORTUNITIES',
    payload: request
  };
}

export function createAndUpdateOpportunities(changes, source, hotTable) {
  return function(dispatch) {
    const newAndUpdatedRows = getNewAndUpdatedRows(changes, source, hotTable);

    if (newAndUpdatedRows) {
      const newRows = newAndUpdatedRows.newRows;
      const updatedRows = newAndUpdatedRows.updatedRows;

      if (newRows.length > 0) {
        axios.post('/api/opportunities', { newRows }).then(() => {
          dispatch(getAllOpportunities());
        });
      }

      if (updatedRows.length > 0) {
        axios.put('/api/opportunities', { updatedRows });
      }
    }
  };
}

export function deleteOpportunities(index, amount, hotTable) {
  return function(dispatch) {
    const removedIds = getRemovedIds(index, amount, hotTable);
    axios({
      method: 'DELETE',
      url: '/api/opportunities',
      data: { removedIds }
    });
  };
}

export function getColumnsOfOpportunities(dispatch) {
  axios
    .get('/api/opportunities/columns')
    .then(response => {
      const hiddenColumnsIndexes = getHiddenColsFromResponse(response);
      dispatch({
        type: 'GET_OPPORTUNITIES_HIDDENCOLUMNS',
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
        type: 'GET_ALL_OPPORTUNITIES_COLUMNS_HEADER',
        payload: columnsHeader
      });
    })
    .catch(err => {
      console.error.bind(err);
    });
}

export function updateHiddenColumnsOfOpportunities(context, hotTable) {
  return function(dispatch) {
    const hiddenColumns = getHiddenColsFromContext(context, hotTable);

    axios.put('/api/opportunities/columns/hidden', { hiddenColumns })
      .then(() => {
        dispatch(getColumnsOfOpportunities.bind(this));
      });
  };
}

export function getAllOpportunityIDsNames() {
  return function(dispatch) {
    axios.get('/api/opportunities/names').then(res => {
      dispatch({
        type: 'GET_ALL_OPPORTUNITY_IDS_NAMES',
        payload: res
      });
    });
  };
}

export function getCopiedOpportunities(opportunityIDs) {
  return {
    type: 'GET_COPIED_OPPORTUNITIES',
    payload: opportunityIDs
  };
}

export function handleRelateOppsToContacts(
  changes,
  opportunityIDs,
  opportunityIDsNames
) {
  return function(dispatch) {
    this.props.dispatch(
      relateOppToContact(changes, opportunityIDs, opportunityIDsNames).bind(
        this
      )
    );
  };
}

export function handleRelateOppToContact(changes, opportunityIDsNames) {
  return function(dispatch) {
    // handle dropdown select and assign to a single contact
    const selectedOpportunityName = changes[0][3];
    const oppIDs = opportunityIDsNames
      .filter(({ name }) => name === selectedOpportunityName)
      .map(({ id }) => id);
    if (
      changes[0][1] === 'name' &&
			(opportunityIDsNames.find(o => o.name === selectedOpportunityName) ||
				selectedOpportunityName === '')
    ) {
      this.props.dispatch(
        relateOppToContact(changes, oppIDs, opportunityIDsNames).bind(this)
      );
    }
  };
}
export function relateOppToContact(
  changes,
  opportunityIDs,
  opportunityIDsNames
) {
  return function(dispatch) {
    if (changes) {
      // if changing multiple rows
      if (changes.length > 1) {
        const bound = buildObjToAssignOpportunityToContact.bind(this);
        const data = bound(changes, opportunityIDs, opportunityIDsNames);
        axios.post('/api/opportunity/contact', data);
      } else {
        // if changing one row
        if (opportunityIDs) {
          const oppID = opportunityIDs[0];
          const rowIndex = changes[0][0];
          const contactID = this.refs.hot.hotInstance.getSourceDataAtRow(
            rowIndex
          ).id;
          axios.post('/api/opportunity/contact', {
            oppID,
            contactID
          });
        }
      }
    }
  };
}

export function updateColumnOrderOfOpportunities(columns, target) {
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
                .put('/api/opportunities/columns/order', {
                  updatedColumnOrders
                })
                .then(dispatch(getColumnsOfOpportunities));
            });
          });
      });
    }
  };
}

export function getOpportunityById(id) {
  return function(dispatch) {
    axios
      .get('/api/opportunity', { params: { id } })
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
              type: 'GET_OPPORTUNITY_BY_ID',
              payload: rankedFields
            });
          })
          .catch(err => {
            console.error.bind(err);
          });
      });
  };
}

export function clickedDetailButtonOnOpportunities(event, coords, td) {
  return function(dispatch) {
    // get row data
    const rowIndex = coords.row;
    const rowData = this.refs.hot.hotInstance.getDataAtRow(rowIndex);
    const rowId = rowData[0];
    // change route with id
    this.props.history.push(`${this.props.match.url}/${rowId}`);
    dispatch(getOpportunityById(rowId));
  };
}

export function displayDetailButtonOnOpportunities(event, coords, td) {
  return function(dispatch) {
    const prepareDetailedButtonBound = prepareDetailedButton.bind(this);
    const button = prepareDetailedButtonBound(event, coords, td);
    // attach onclick event to button
    button.onclick = () => {
      this.props.dispatch(
        clickedDetailButtonOnOpportunities(event, coords, td).bind(this)
      );
    };
    // insert button
    if (event.target.parentNode.nodeName.toLowerCase() === 'tr') {
      event.target.parentNode.insertBefore(button, null);
    }
  };
}
