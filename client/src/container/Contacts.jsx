// react & redux
import React from 'react';
import { connect } from 'react-redux';
// redux actions
import { getContacts,
  createAndUpdateContacts,
  deleteContacts
} from '../actions/contactsActions';
import {
  getAllOpportunityIDsNames,
  relateOppToContact
} from '../actions/opportunitiesActions';

// api call
import axios from 'axios';
// handsontable
import HotTable from 'react-handsontable';
import 'handsontable-pro/dist/handsontable.full.js';
// import 'handsontable-pro/dist/handsontable.full.css';

class Contacts extends React.Component {
  // start of class
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch(getContacts);
    this.props.dispatch(getAllOpportunityIDsNames());
  }
  render() {
    const opportunityIDsNames = this.props.opportunityIDsNames
      ? this.props.opportunityIDsNames.map(opp => opp.name)
      : null;
    return (
      <div>
        <div id="table">
          {!this.props.contacts &&
          !this.props.opportunityIDsNames ? (
            <p>loading...</p>
          ) : (
            <HotTable
              root="hot"
              ref="hot"
              settings={{
                licenseKey: '7fb69-d3720-89c63-24040-8e45b',
                data: this.props.contacts,
                colHeaders: [
                  'ID',
                  'Opportunity Name',
                  'First Name',
                  'Last Name',
                  'Suffix',
                  'Title',
                  'Department',
                  'Description',
                  'Email',
                  'Work Phone Number',
                  'Personal Phone Number',
                  'Created Date',
                  'Updated Date'
                ],
                columns: [
                  { data: 'id' },
                  {
                    data: 'name',
                    type: 'autocomplete',
                    source: opportunityIDsNames,
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
                ],
                hiddenColumns: {
                  columns: [0],
                  indicators: false
                },
                rowHeaders: true,
                minSpareRows: false,
                stretchH: 'all',
                contextMenu: ['remove_row'],
                filters: true,
                dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                columnSorting: true,
                afterChange: (changes, source) => {
                  const opportunityIDsNames = this.props.opportunityIDsNames;
                  if (changes && changes[0][1] != 'name') {
                    this.props.dispatch(createAndUpdateContacts(changes, source).bind(this));
                  }
                  if (changes) {
                    const selectedOpportunityName = changes[0][3];
                    //get Opp ID
                    const oppID = opportunityIDsNames.filter(({name}) => name === selectedOpportunityName).map(({id}) => id)[0];
                    if (changes[0][1] === 'name' && selectedOpportunityName !== null && opportunityIDsNames.find(o => o.name === selectedOpportunityName)) {
                      this.props.dispatch(relateOppToContact(changes, source, oppID).bind(this));
                    }
                  }
                },
                beforeRemoveRow: (index, amount) => {
                  console.log(`beforeRemoveRow: index: ${index}, amount: ${amount}`);
                  this.props.dispatch(deleteContacts(index, amount).bind(this));
                },
                afterCopy: (index, amount) => {
                  console.log(`afterCopy: index: ${index}, amount: ${amount}`);
                },
                afterPaste: (index, amount) => {
                  console.log(`afterPaste: index: ${index}, amount: ${amount}`);
                }
              }}
            />
          )}
        </div>
      </div>
    );
  }
} // end of class

const mapStateToProps = state => ({
  contacts: state.contactsReducer.contacts,
  opportunityIDsNames: state.opportunitiesReducer.opportunityIDsNames,
});

export default connect(mapStateToProps, null)(Contacts);
