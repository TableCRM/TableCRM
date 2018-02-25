import { Route } from 'react-router-dom';
import 'handsontable-pro/dist/handsontable.full';
import HotTable from 'react-handsontable';
import { commonTableSetting } from '../lib/helper';
// react
import React from 'react';
// connects the Accounts component to the redux store
import { connect } from 'react-redux';
// styled-component
import styled from 'styled-components';
import {
  getAllAccounts,
  createAndUpdateAccounts,
  deleteAccounts,
  getColumnsOfAccounts,
  updateHiddenColumnsOfAccounts,
  updateColumnOrderOfAccounts,
  displayDetailButtonOnAccounts
} from '../actions/accountsActions';
// right panel
import RightPanel from '../components/RightPanel.jsx';
// ant ui
import 'antd/dist/antd.css';
import { Spin } from 'antd';

const TableWrap = styled.div`
	overflow-x: scroll;
	overflow-y: hidden;
	height: calc(100vh - 60px);
`;

const Center = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { data: 'id', readOnly: true },
        { data: 'description' },
        { data: 'industryID', type: 'numeric' },
        { data: 'email' },
        { data: 'phoneNumber' },
        { data: 'street' },
        { data: 'city' },
        { data: 'state' },
        { data: 'postalCode' },
        { data: 'country' },
        { data: 'website' },
        { data: 'createdAt', type: 'date', readOnly: true },
        { data: 'updatedAt', type: 'date', readOnly: true }
      ]
    };
  }
  componentDidMount() {
    this.props.dispatch(getAllAccounts);
    this.props.dispatch(getColumnsOfAccounts.bind(this));
  }
  render() {
    const accountsTableSetting = {
      data: this.props.accounts,
      colHeaders: this.props.accountsColumnsHeader,
      columns: this.state.columns,
      hiddenColumns: {
        columns: this.props.accountsHiddenColIndices,
        indicators: true
      },
      afterChange: (changes, source) => {
        if (changes && source !== 'loadData') {
          const hotTable = this.refs.hot.hotInstance;
          this.props.dispatch(
            createAndUpdateAccounts(changes, source, hotTable)
          );
        }
      },
      beforeRemoveRow: (index, amount) => {
        this.props.dispatch(deleteAccounts(index, amount).bind(this));
      },
      afterColumnMove: (columns, target) => {
        this.props.dispatch(
          updateColumnOrderOfAccounts(columns, target).bind(this)
        );
      },
      afterContextMenuHide: context => {
        // this.props.dispatch(updateHiddenColumnsOfAccounts(context).bind(this));
      },
      afterOnCellMouseOver: (event, coords, td) => {
        this.props.dispatch(
          displayDetailButtonOnAccounts(event, coords, td).bind(this)
        );
      }
    };
    const tableSettingMerged = Object.assign(
      accountsTableSetting,
      commonTableSetting
    );
    return (
      <TableWrap>
        <div id="table">
          {!this.props.accounts ? (
            <Center>
              <Spin />
            </Center>
          ) : (
            <HotTable root="hot" ref="hot" settings={tableSettingMerged} />
          )}
        </div>
        <Route path={`${this.props.match.url}/:id`} component={RightPanel} />
      </TableWrap>
    );
  }
} // end of class

const mapStateToProps = state => ({
  accounts: state.accountsReducer.accounts,
  accountsHiddenColIndices: state.accountsReducer.accountsHiddenColIndices,
  accountsColumnsHeader: state.accountsReducer.accountsColumnsHeader
});

export default connect(mapStateToProps, null)(Accounts);
