import { Route } from 'react-router-dom';
// react & redux
import React from 'react';
import { connect } from 'react-redux';
// styled-component
import styled from 'styled-components';
// redux actions
import {
  getContacts,
  createAndUpdateContacts,
  deleteContacts,
  getColumnsOfContacts,
  updateSource,
  updateHiddenColumnsOfContacts,
  updateColumnOrderOfContacts,
  displayDetailButtonOnContacts
} from '../actions/contactsActions';
import {
  getAllOpportunityIDsNames,
  relateOppToContact,
  handleRelateOppToContact,
  handleRelateOppsToContacts,
  getCopiedOpportunities
} from '../actions/opportunitiesActions';

// api call
import axios from 'axios';
// handsontable
import HotTable from 'react-handsontable';
import 'handsontable-pro/dist/handsontable.full.js';
// import 'handsontable-pro/dist/handsontable.full.css';
import { commonTableSetting } from '../lib/helper';
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

export class Contacts extends React.Component {
  // start of class
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { data: 'id' },
        { data: 'opportunityID' },
        {
          data: 'name',
          type: 'autocomplete',
          source: this.props.opportunityIDsNames
            ? this.props.opportunityIDsNames.map(i => i.name)
            : null,
          strict: false
        },
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'suffix' },
        { data: 'title' },
        { data: 'department' },
        { data: 'description' },
        { data: 'email' },
        { data: 'workPhoneNumber' },
        { data: 'personalPhoneNumber' },
        {
          data: 'createdAt',
          type: 'date',
          dateFormat: 'MM/DD/YYYY',
          correctFormat: false,
          readOnly: true
        },
        {
          data: 'updatedAt',
          type: 'date',
          dateFormat: 'MM/DD/YYYY',
          correctFormat: false,
          readOnly: true
        }
      ]
    };
  }
  componentDidMount() {
    this.props.dispatch(getAllOpportunityIDsNames());
    this.props.dispatch(getColumnsOfContacts.bind(this));
    this.props.dispatch(getContacts);
  }
  render() {
    const contactsTableSetting = {
      data: this.props.contacts,
      colHeaders: this.props.contactsColumnsHeader,
      columns: this.state.columns,
      hiddenColumns: {
        columns: this.props.contactsHiddenColIndices,
        indicators: true
      },
      beforeRemoveRow: (index, amount) => {
        const hotTable = this.refs.hot.hotInstance;
        this.props.dispatch(deleteContacts(index, amount, hotTable));
      },
      afterInit: () => {
        this.props.dispatch(updateSource.bind(this));
      },
      afterColumnMove: (columns, target) => {
        this.props.dispatch(
          updateColumnOrderOfContacts(columns, target).bind(this)
        );
      },
      afterContextMenuHide: context => {
        const hotTable = this.refs.hot.hotInstance;
        this.props.dispatch(updateHiddenColumnsOfContacts(context, hotTable));
      },
      beforeCopy: (data, coords) => {
        const oppNames = this.props.opportunityIDsNames.map(opp => opp.name);
        // check if copied data is valid
        const revisedData = data.map(d => d[0]);
        if (revisedData.every(elem => oppNames.indexOf(elem) > -1)) {
          const copiedRows = coords[0];
          const opportunityIDs = [];
          for (let i = copiedRows.startRow; i <= copiedRows.endRow; i++) {
            opportunityIDs.push(
              this.refs.hot.hotInstance.getSourceDataAtRow(i).opportunityID
            );
          }
          this.props.dispatch(getCopiedOpportunities(opportunityIDs));
        }
      },
      afterChange: (changes, source, index, amount) => {
        if (changes && source !== 'loadData') {
          const hotTable = this.refs.hot.hotInstance;
          if (changes[0][1] != 'name') {
            this.props.dispatch(
              createAndUpdateContacts(changes, source, hotTable)
            );
          }
          const opportunityIDsNames = this.props.opportunityIDsNames;
          if (source == 'edit' || source == 'Autofill.fill') {
            this.props.dispatch(
              handleRelateOppToContact(changes, opportunityIDsNames).bind(this)
            );
          }
          if (source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            const oppotunityIDs = this.props.copiedOpportunities;
            if (this.props.copiedOpportunities) {
              const opportunityIDs = this.props.copiedOpportunities;
              this.props.dispatch(
                handleRelateOppsToContacts(
                  changes,
                  opportunityIDs,
                  opportunityIDsNames
                ).bind(this)
              );
            } else {
              const opportunityIDs = [];
              const selectedOpportunityName = changes[0][3];
              const opportunityID = opportunityIDsNames
                .filter(({ name }) => name === selectedOpportunityName)
                .map(({ id }) => id);
              for (const change of changes) {
                opportunityIDs.push(opportunityID[0]);
              }
              this.props.dispatch(
                handleRelateOppsToContacts(
                  changes,
                  opportunityIDs,
                  opportunityIDsNames
                ).bind(this)
              );
            }
          }
        }
      },
      afterOnCellMouseOver: (event, coords, td) => {
        this.props.dispatch(
          displayDetailButtonOnContacts(event, coords, td).bind(this)
        );
      }
    };
    const tableSettingMerged = Object.assign(
      contactsTableSetting,
      commonTableSetting
    );
    return (
      <TableWrap>
        <div id="table">
          {!this.props.contacts || !this.props.opportunityIDsNames ? (
            <Center>
              <Spin />
            </Center>
          ) : (
            <HotTable root="hot" ref="hot" settings={contactsTableSetting} />
          )}
        </div>
        <Route path={`${this.props.match.url}/:id`} component={RightPanel} />
      </TableWrap>
    );
  }
} // end of class

const mapStateToProps = state => ({
  contacts: state.contactsReducer.contacts,
  opportunityIDsNames: state.opportunitiesReducer.opportunityIDsNames,
  contactsHiddenColIndices: state.contactsReducer.contactsHiddenColIndices,
  contactsColumnsHeader: state.contactsReducer.contactsColumnsHeader,
  copiedOpportunities: state.opportunitiesReducer.copiedOpportunities
});

export default connect(mapStateToProps, null)(Contacts);
