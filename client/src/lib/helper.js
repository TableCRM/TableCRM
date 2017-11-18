// given changes array
export function getNewAndUpdatedRows(changes, source, postCallback, putCallback) {
  // if changes array is not null
  if (changes && source !== 'loadData') {
    // create empty arrays to store new rows and updated rows as objects, respectively
    let newRows = [];
    let updatedRows = [];

    // for each change array in changes array
    for (let change of changes) {

      // get change's corresponding row's index (per spreadsheet) and id (per database)
      let rowIndex = change[0];
      let rowId = this.refs.hot.hotInstance.getSourceDataAtRow(rowIndex).id;
      // get change's field-newValue pair
      let field = change[1];
      let newValue = change[3];
      // get change's corresponding cell
      let colIndex = this.refs.hot.hotInstance.propToCol(change[1]);
      let cell = this.refs.hot.hotInstance.getCell(rowIndex, colIndex);

      // if change is of valid data type
      if (!cell.classList.value.split(' ').includes('htInvalid')) {
        // if change's corresponding row was empty prior to change
        if (rowId === null) {
          // create a variable to check whether row index is found in newRows array & set its initial value to false
          let found = false;

          // for each row object in newRows array
          for (let newRow of newRows) {
            // if row object's index value is equal to row index
            if (newRow.index === rowIndex) {
              // add change's field-newValue pair to row object
              newRow[field] = newValue;
              // set check variable to true
              found = true;
              // exit loop
              break;
            }
          }

          // subsquent to loop, if check variable is false
          if (!found) {
            // create an object with key-value pair: {index: change's row index}
            let newRow = {index: rowIndex};
            // add change's field-newValue pair to the object
            newRow[field] = newValue;
            // push the object to newRows array
            newRows.push(newRow);
          }

        // otherwise, if change's corresponding row was not empty prior to change
        } else {
          // create a variable to check whether row id is found in updatedRows array & set its initial value to false
          let found = false;

          // for each row object in updatedRows array
          for (let updatedRow of updatedRows) {
            // if row object's id value is equal to row id
            if (updatedRow.id === rowId) {
              // add change's field-newValue pair to row object
              updatedRow[field] = newValue;
              // set check variable to true
              found = true;
              // exit loop
              break;
            }
          }

          // subsquent to loop, if check variable is false
          if (!found) {
            // create an object with key-value pair: {id: change's row id}
            let updatedRow = {id: rowId};
            // add change's field-newValue pair to the object
            updatedRow[field] = newValue;
            // push the object to updatedRows array
            updatedRows.push(updatedRow);
          }
        }
      }
    }

    // for each new row in newRows array, remove row index before ajax call
    for (let newRow of newRows) {
      if ('index' in newRow) {
        delete newRow.index;
      }
    }

    if (newRows.length > 0) {
      postCallback(newRows);
    }

    if (updatedRows.length > 0) {
      putCallback(updatedRows);
    }
  }
}

export function getRemovedIds(selectedRows) {
  const startRow = selectedRows[0];
  const endRow = selectedRows[2];
  // get smallest and biggest row id's
  const smallestRowIndex = Math.min(startRow, endRow);
  const biggestRowIndex = Math.max(startRow, endRow);
  // get list of deleted row id's
  const removedIds = [];
  for (let i = smallestRowIndex; i <= biggestRowIndex; i++) {
    removedIds.push(this.refs.hot.hotInstance.getDataAtRow(i)[0]);
  }
  return removedIds;
}

export function leadsColumnsToObj(leadsColumns) {
  return new Promise(resolve => {
    const resultObj = {};
    for (let i = 0; i < leadsColumns.length; i++) {
      resultObj[leadsColumns[i].data] = leadsColumns[i].id;
    }
    resolve(resultObj);
  });
}

export function getChangedColumnsObj(afterColumns, leadsColumns, leadsColumnsObj) {
  return new Promise(resolve => {
    const movedColumns = [];
    for (let i = 0; i < afterColumns.length; i++) {
      if (leadsColumns[i].data !== afterColumns[i]) {
        const tempObj = {};
        const newOrder = i + 1;
        const id = leadsColumnsObj[afterColumns[i]];
        tempObj.newOrder = newOrder;
        tempObj.id = id;
        movedColumns.push(tempObj);
      }
    }
    resolve(movedColumns);
  });
}
