import {
  GET_CONTACTS,
  GET_CONTACT_REQUESTS,
  SEND_CONTACT_REQUEST,
  ACCEPT_CONTACT_REQUEST,
  REJECT_CONTACT_REQUEST,
  DELETE_CONTACT,
} from "./contactsActions";

const initialState = {
  contacts: [],
  contactRequests: [],
  requestedContacts: new Set(), // Ensure this is initialized as a Set
};

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    case GET_CONTACT_REQUESTS:
      return {
        ...state,
        contactRequests: action.payload,
      };
    case SEND_CONTACT_REQUEST:
      return {
        ...state,
        requestedContacts: new Set(state.requestedContacts).add(action.payload), // Add to requested contacts
      };
    case ACCEPT_CONTACT_REQUEST:
      return {
        ...state,
        contactRequests: state.contactRequests.filter(
          (request) => request.id !== action.payload.id
        ),
      };
    case REJECT_CONTACT_REQUEST:
      return {
        ...state,
        contactRequests: state.contactRequests.filter(
          (request) => request.id !== action.payload.id
        ),
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default contactsReducer;
