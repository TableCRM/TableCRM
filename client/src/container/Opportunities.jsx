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
  getAllOpportunities,
  createAndUpdateOpportunities,
  deleteOpportunities,
  getColumnsOfOpportunities,
  updateHiddenColumnsOfOpportunities,
  updateColumnOrderOfOpportunities
} from '../actions/opportunitiesActions';

const TableWrap = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  height: calc(100vh - 60px);
`;

// start of class
class Opportunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { data: 'id' },
        { data: 'name' },
        { data: 'description' },
        {
          data: 'pipeline',
          type: 'dropdown',
          source: ['Sales', 'Biz Dev']
        },
        { data: 'estimatedValue', type: 'numeric' },
        { data: 'winProbability', type: 'numeric' },
        {
          data: 'priority',
          type: 'dropdown',
          source: ['High', 'Medium', 'Low']
        },
        {
          data: 'status',
          type: 'dropdown',
          source: ['Open', 'Won', 'Lost', 'Abandoned']
        },
        {
          data: 'stage',
          type: 'dropdown',
          source: ['Qualified', 'Presentation', 'Negotiation', 'Contract Sent', 'Payment']
        },
        { data: 'expectedCloseDate', type: 'date' },
        {
          data: 'lostReason',
          type: 'dropdown',
          source: ['Not Applicable', 'Feature', 'Price', 'Competitor']
        },
        {
          data: 'origin',
          type: 'dropdown',
          source: ['Reference', 'Network', 'Other']
        },
        { data: 'createdAt', type: 'date', readOnly: true },
        { data: 'updatedAt', type: 'date', readOnly: true }
      ]
    };
  }
  componentDidMount() {
    this.props.dispatch(getColumnsOfOpportunities.bind(this));
    this.props.dispatch(getAllOpportunities());
  }
  render() {
    const opportunitiesTableSetting = {
      data: this.props.opportunities,
      colHeaders: this.props.opportunitiesColumnsHeader,
      columns: this.state.columns,
      hiddenColumns: {
        columns: this.props.opportunitiesHiddenColIndices,
        indicators: true
      },
      afterChange: (changes, source) => {
        this.props.dispatch(createAndUpdateOpportunities(changes, source).bind(this));
      },
      beforeRemoveRow: (index, amount) => {
        this.props.dispatch(deleteOpportunities(index, amount).bind(this));
      },
      afterColumnMove: (columns, target) => {
        this.props.dispatch(updateColumnOrderOfOpportunities(columns, target).bind(this));
      },
      afterContextMenuHide: context => {
        this.props.dispatch(updateHiddenColumnsOfOpportunities(context).bind(this));
      }
    };
    const tableSettingMerged = Object.assign(opportunitiesTableSetting, commonTableSetting);
    return (
      <TableWrap>
        <div id="table">
          {!this.props.opportunities ? (
            <p>loading...</p>
          ) : (
            <HotTable root="hot" ref="hot" settings={tableSettingMerged} />
          )}
        </div>
      </TableWrap>
    );
  }
} // end of class

const mapStateToProps = state => ({
  opportunities: state.opportunitiesReducer.opportunities,
  opportunitiesColumnsHeader: state.opportunitiesReducer.opportunitiesColumnsHeader,
  opportunitiesHiddenColIndices: state.opportunitiesReducer.opportunitiesHiddenColIndices
});

export default connect(mapStateToProps)(Opportunities);
