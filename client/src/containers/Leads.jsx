import { Route } from 'react-router-dom';
// handsontable
import HotTable from 'react-handsontable';
import 'handsontable-pro/dist/handsontable.full';
// import 'handsontable-pro/dist/handsontable.full.css';
import { commonTableSetting } from '../lib/helper';
// react & redux
import React from 'react';
import { connect } from 'react-redux';
// styled-component
import styled from 'styled-components';
// redux actions
import {
  getAllLeads,
  createAndUpdateLeads,
  deleteLeads,
  getColumnsOfLeads,
  updateColumnsOfLeads,
  updateColumnOrderOfLeads,
  updateHiddenColumnsOfLeads,
  displayDetailButtonOnLeads
} from '../actions/leadsActions';
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

class Leads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { data: 'id' },
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'suffix' },
        { data: 'title' },
        {
          data: 'value',
          type: 'numeric',
          format: '$0,0.00'
        },
        { data: 'email' },
        { data: 'phoneNumber' },
        { data: 'description' },
        {
          data: 'createdAt',
          type: 'date',
          dateFormat: 'MM/DD/YYYY',
          correctFormat: true,
          readOnly: true
        },
        { data: 'ownerId' }
      ]
    };
  }
  componentDidMount() {
    this.props.dispatch(getColumnsOfLeads.bind(this));
    this.props.dispatch(getAllLeads);
  }
  render() {
    const leadsTableSetting = {
      data: this.props.leads,
      colHeaders: this.props.leadsColumnsHeader,
      columns: this.state.columns,
      hiddenColumns: {
        columns: this.props.leadsHiddenColIndices,
        indicators: true
      },
      afterChange: (changes, source) => {
        if (changes && source !== 'loadData') {
          const hotTable = this.refs.hot.hotInstance;
          this.props.dispatch(
            createAndUpdateLeads(changes, source, hotTable)
          );
        }
      },
      beforeRemoveRow: (index, amount) => {
        this.props.dispatch(deleteLeads(index, amount).bind(this));
      },
      afterColumnMove: (columns, target) => {
        this.props.dispatch(
          updateColumnOrderOfLeads(columns, target).bind(this)
        );
      },
      afterContextMenuHide: context => {
        this.props.dispatch(updateHiddenColumnsOfLeads(context).bind(this));
      },
      afterOnCellMouseOver: (event, coords, td) => {
        this.props.dispatch(
          displayDetailButtonOnLeads(event, coords, td).bind(this)
        );
      }
    };
    const tableSettingMerged = Object.assign(
      leadsTableSetting,
      commonTableSetting
    );
    return (
      <TableWrap>
        <div id="table">
          {!this.props.leads ||
					!this.props.leadsColumnsHeader ||
					!this.props.leadsHiddenColIndices ? (
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
}

const mapStateToProps = state => ({
  leads: state.leadsReducer.leads,
  leadsColumnsHeader: state.leadsReducer.leadsColumnsHeader,
  selectedLead: state.leadsReducer.selectedLead,
  leadsHiddenColIndices: state.leadsReducer.leadsHiddenColIndices
});

export default connect(mapStateToProps, null)(Leads);
