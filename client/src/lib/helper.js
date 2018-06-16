import moment from 'moment';

export function getNewAndUpdatedRows(changes, source, hotTable) {
  // create empty hash tables to track new rows and updated rows
  const newRowsObj = {};
  const updatedRowsObj = {};

  // for each change array in changes array
  for (const change of changes) {
    const rowIndex = change[0]; // per spreadsheet
    const rowId = hotTable.getDataAtRow(rowIndex)[0]; // per database
    const field = change[1];
    let newValue = change[3];
    const colIndex = hotTable.propToCol(field);
    const cell = hotTable.getCell(rowIndex, colIndex);

    // if change is of valid data type
    if (
      cell === null ||
			cell === undefined ||
			!cell.classList.value.split(' ').includes('htInvalid')
    ) {
      // format date for persisting in database
      if (field === 'expectedCloseDate' || field === 'closeDate') {
        newValue = moment(newValue).format('YYYY-MM-DD');
      }
      // if change is adding a new row
      if (rowId === null) {
        // if row index is not already a key in hash table
        if (!newRowsObj[rowIndex]) {
          // add key-value pair to hash table
          const newRow = {};
          newRow[field] = newValue;
          newRowsObj[rowIndex] = newRow;
          // otherwise
        } else {
          // get key's value and add field-newValue pair to the value
          const newRow = newRowsObj[rowIndex];
          newRow[field] = newValue;
        }
      // otherwise, if change is updating an existing row
      } else {
        // similar to above
        if (!updatedRowsObj[rowId]) {
          const updatedRow = { id: rowId };
          updatedRow[field] = newValue;
          updatedRowsObj[rowId] = updatedRow;
        } else {
          const updatedRow = updatedRowsObj[rowId];
          updatedRow[field] = newValue;
        }
      }
    }
  }

  const newRows = Object.values(newRowsObj);
  const updatedRows = Object.values(updatedRowsObj);
  return { newRows, updatedRows };
}

export function getRemovedIds(index, amount, hotTable) {
  const selectedRows = hotTable.getSelected();
  const startRow = selectedRows[0];
  const endRow = selectedRows[2];
  // get smallest and biggest row id's
  const smallestRowIndex = Math.min(startRow, endRow);
  const biggestRowIndex = Math.max(startRow, endRow);
  // get list of deleted row id's
  const removedIds = [];
  for (let i = smallestRowIndex; i <= biggestRowIndex; i++) {
    removedIds.push(hotTable.getDataAtRow(i)[0]);
  }
  return removedIds;
}

export function getSortedColumnsByRank(columns) {
  // set columns state sorted by rank
  const rankedColumns = [];
  const currentColumns = this.state.columns;
  for (let i = 0; i < currentColumns.length; i++) {
    rankedColumns.push(Object.assign({}, currentColumns[i], columns[i]));
  }
  // sort rankedColumns by object rank value
  rankedColumns.sort((a, b) => {
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    return 0;
  });
  this.setState({ columns: rankedColumns });
  // get colHeaders sorted by rank
  const columnsHeader = [];
  for (const column of rankedColumns) {
    columnsHeader.push(column.name);
  }
  return columnsHeader;
}

export function getMovedColumnsIndexRange(columns, target) {
  return new Promise(resolve => {
    let movedRange;
    let movedRight;
    // determine if user moved column(s) to right or left
    columns[0] < target ? (movedRight = true) : (movedRight = false);
    if (movedRight) {
      // if moved right
      const movedIndex = target - columns.length - 1;
      movedRange = [columns[0], movedIndex + columns.length];
    } else {
      // if moved left
      const movedIndex = target;
      movedRange = [movedIndex, columns[columns.length - 1]];
    }
    resolve(movedRange);
  });
}

export function mapColumnIdToName() {
  return new Promise(resolve => {
    const currentColumns = this.state.columns;
    const ColumnIdToNameObj = {};
    for (const column of currentColumns) {
      const columnName = column.name;
      const columnId = column.id;
      ColumnIdToNameObj[columnName] = columnId;
    }
    resolve(ColumnIdToNameObj);
  });
}

export function getUpdatedColumnsObj(
  entityColumnsObj,
  movedRangeIndexes,
  afterColumnsArray
) {
  return new Promise(resolve => {
    const updatedColumnOrders = [];
    const movedRangeStart = movedRangeIndexes[0];
    const movedRangeEnd = movedRangeIndexes[movedRangeIndexes.length - 1];
    for (let i = movedRangeStart; i <= movedRangeEnd; i++) {
      const updatedColumns = {};
      const columnName = afterColumnsArray[i];
      const columnId = entityColumnsObj[columnName];
      const columnOrder = i;
      updatedColumns.columnName = columnName;
      updatedColumns.columnId = columnId;
      updatedColumns.columnOrder = columnOrder;
      updatedColumnOrders.push(updatedColumns);
    }
    resolve(updatedColumnOrders);
  });
}

export function getHiddenColsFromResponse(response) {
  const hiddenColumnsIndexes = response.data
    .filter(column => column.hidden === 1)
    .map(column => column.rank);
  return hiddenColumnsIndexes;
}

export function getHiddenColsFromContext(context, hotTable) {
  const hiddenColIndices = context.hot.getPlugin('hiddenColumns').hiddenColumns;
  const hiddenColProps = [];
  for (const hiddenColIndex of hiddenColIndices) {
    const hiddenColProp = hotTable.colToProp(hiddenColIndex);
    hiddenColProps.push(hiddenColProp);
  }
  return hiddenColProps;
}

export const commonTableSetting = {
  licenseKey: '7fb69-d3720-89c63-24040-8e45b',
  manualColumnMove: true,
  rowHeaders: true,
  height: window.innerHeight - 60,
  autoColumnSize: true,
  wordWrap: false,
  contextMenu: ['remove_row', 'hidden_columns_show', 'hidden_columns_hide'],
  dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
  filters: true,
  columnSorting: true,
  minSpareRows: 1,
  fixedRowsBottom: 0
};

export function buildObjToAssignOpportunityToContact(changes, opportunityIDs, opportunityIDsNames, hotTable) {
  // build object to store OppIDs and contactIDs
  const contactIDs = [];
  for (const change of changes) {
    const rowIndex = change[0];
    const contactID = hotTable.getSourceDataAtRow(rowIndex).id;
    contactIDs.push(contactID);
  }
  if (!opportunityIDs) {
    const selectedOpportunities = changes.map(selectedOpp => selectedOpp[3]);
    if (selectedOpportunities.every((val, i, arr) => val === arr[0]) === true) {
      const oppIDArray = opportunityIDsNames
        .filter(({ name }) => name === selectedOpportunities[0])
        .map(({ id }) => id);
      const oppID = Number(oppIDArray);
      opportunityIDs = selectedOpportunities.map(selectedOpp => oppID);
    }
  }
  const data = {};
  contactIDs.forEach((contactID, oppID) => {
    data[contactID] = opportunityIDs[oppID];
  });
  // check if data has undefined values, meaning multiple relations were deleted
  if (Object.values(data).every(value => value === undefined) === true) {
    Object.keys(data).map(value => (data[value] = 'delete'));
  }
  return data;
}

export function prepareDetailedButton(event, coords, td) {
  this.setState({});
  // create button
  const button = document.createElement('i');
  button.className = 'detail_button material-icons';
  const textnode = document.createTextNode('open_in_new');
  button.appendChild(textnode);
  return button;
}
