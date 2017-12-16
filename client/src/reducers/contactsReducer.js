export default function(
  state = {
    contacts: null
  },
  action
) {
  switch (action.type) {
    case 'GET_ALL_CONTACTS':
      return {
        ...state,
        contacts: action.payload
      };
    case 'GET_ALL_CONTACT_IDS_NAMES':
      return {
        ...state,
        contactIDsNames: action.payload.data
      };
  }
  return state;
}
