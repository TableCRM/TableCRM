/*
A container is a normal react component that has been linked to application stae
containers are the link between state, managed by redux, and views, managed by react
the react-redux library, from which we import 'connect' function below, is how we bridge these two libraries
components that care about/depend on a certain piece of state should be containers
whenever we connect a component to redux, that component becomes a container, or "smart component"

we connect this container with the relevant action creator by importing the action creator (getAccounts)
below and then using dispatch.  This makes it so that whenever getAccounts action creator is called
the result should be passed to all of the reducers.

dispatch is a function that takes in action creators and passes them on to all the different reducers
it "dispatches" an action.  This is the only way to trigger a state change.

documentation:
https://redux.js.org/docs/api/Store.html#dispatch

*/
import 'handsontable-pro/dist/handsontable.full';
import HotTable from 'react-handsontable';
// the react import syntax is the following way because: https://stackoverflow.com/questions/46283811/flow-errors-with-react-component
import * as React from 'react';
// connects the Accounts component to the redux store
import { connect } from 'react-redux';

import { getAllAccounts, createAndUpdateAccounts, deleteAccounts } from '../actions/accountsActions';

import { getAllOpportunityIDsNames, relateOppToAccount } from '../actions/opportunitiesActions';

import { getAllContactIDsNames, relateContactToAccount } from '../actions/contactsActions';

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {

    this.props.dispatch(getAllAccounts);
    this.props.dispatch(getAllOpportunityIDsNames());
    this.props.dispatch(getAllContactIDsNames());
  }
  render() {
    const opportunityIDsNames = this.props.opportunityIDsNames
      ? this.props.opportunityIDsNames.map(opp => opp.name)
      : null;
    const contactIDsNames = this.props.contactIDsNames ? this.props.contactIDsNames.map(contact => contact.name) : null;
    return (
      <div>
        <div id="table">
          {!this.props.accounts && !this.props.opportunityIDsNames && !this.props.contactIDsNames ? (
            <p>loading...</p>
          ) : (
            <HotTable
              root="hot"
              ref="hot" 
              settings={{
                licenseKey: '7fb69-d3720-89c63-24040-8e45b',
                data: this.props.accounts,
                colHeaders: [
                  'ID',
                  'Opportunity Name',
                  'Contact Name',
                  'Description',
                  'IndustryID',
                  'E-mail',
                  'Phone Number',
                  'Street',
                  'City',
                  'State',
                  'Postal Code',
                  'Country',
                  'Website',
                  'Created At',
                  'Updated At'
                ],
                columns: [
                  { data: 'id' },
                  {
                    data: 'name',
                    type: 'autocomplete',
                    source: opportunityIDsNames,
                    strict: false
                  },
                  {
                    data: 'contactFullName',
                    type: 'autocomplete',
                    source: contactIDsNames,
                    strict: false
                  },
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
                  {
                    data: 'createdAt',
                    type: 'date',
                    readOnly: true
                  },
                  {
                    data: 'updatedAt',
                    type: 'date',
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
                  const contactIDsNames = this.props.contactIDsNames;
                  if (changes && changes[0][1] != 'name' && changes[0][1] != 'contactFullName') {
                    this.props.dispatch(createAndUpdateAccounts(changes, source).bind(this));
                  }
                  if (changes && changes[0][1] === 'name') {
                    const selectedOpportunityName = changes[0][3];
                    const oppID = opportunityIDsNames
                      .filter(({ name }) => name === selectedOpportunityName)
                      .map(({ id }) => id)[0];
                    if (
                      changes[0][1] === 'name' &&
                      selectedOpportunityName !== null &&
                      opportunityIDsNames.find(o => o.name === selectedOpportunityName)
                    ) {
                      this.props.dispatch(relateOppToAccount(changes, source, oppID).bind(this));
                    }
                  } else if (changes) {
                    const selectedContactName = changes[0][3];
                    const contactID = contactIDsNames
                      .filter(({ name }) => name === selectedContactName)
                      .map(({ id }) => id)[0];
                    if (
                      changes[0][1] === 'contactFullName' &&
                      selectedContactName !== null &&
                      contactIDsNames.find(c => c.name === selectedContactName)
                    ) {
                      this.props.dispatch(relateContactToAccount(changes, source, contactID).bind(this));
                    }
                  }
                },
                beforeRemoveRow: (index, amount) => {
                  this.props.dispatch(deleteAccounts(index, amount).bind(this));
                }
                // beforeRenderer: () => {
                  // this.hot ? console.log('THIS IS THIS: ', this.hot.hotInstance) : console.log('NOT DEFINED YET');

                  // this.hot ? this.hot.hotInstance.updateSettings({
                  //   minSpareRows: 1
                  // }) : console.log('THIS not valid yet: ')
                  // this.hot ? console.log('THIS: ', this.hot) : console.log('THIS is not valid yet');
                // }
              }}
            />
          )}
        </div>
      </div>
    );
  }
} // end of class

/*
mapStateToProps is a function that takes in application state and returns a portion of it
in this case, mapStateToProps takes in application state and returns the accounts property
and adds it to the Accounts component's props.  It is used to pull data from the store when it changes
and pass those values as props to the component.

mapStateToProps tells how to transform the current Redux store state into the props you want to pass to
a presentational component (Account) that you are wrapping.

The return value of the mapStateToProps function will be added to props on the Accounts component.
When we export and evoke the connect function below, the Accounts component will merge with the object
returned from mapStateToPropse, creating a container

If the state changes at any point, the new state will be added to props and the container will automatically re-render

documentation:
https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
*/

const mapStateToProps = state => ({
  accounts: state.accountsReducer.accounts,
  opportunityIDsNames: state.opportunitiesReducer.opportunityIDsNames,
  contactIDsNames: state.contactsReducer.contactIDsNames
});

/*
the connect function takes in a function (mapStateToProps) and a component (Accounts) and
produces a container, that container is what we are exporting below
the second, optional, argument of connect is mapDispatchToProps.  When one is not provided,
as below, then React Redux will provide a default version, which simply returns the dispatch function
as a prop, making dispatch available on the props, which is how we can call it above inside of
ComponentDidMount

*/

// invoking connect will return a function, we then pass Accounts to that function and invoke it
// the first parameter passed to connect is a function which describes which part of the redux
// store we want to use on this component, the second parameter describes which action creators
// we want to use on this componenet to send data to the redux store.  In this case, the second
// parameter is null, because we instead link the getAllAccounts action creator to this component
// in the ComponentDidMount method above.

export default connect(mapStateToProps, null)(Accounts);
