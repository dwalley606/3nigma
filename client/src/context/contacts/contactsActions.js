export const GET_CONTACTS = "GET_CONTACTS";
export const GET_CONTACT_REQUESTS = "GET_CONTACT_REQUESTS";
export const SEND_CONTACT_REQUEST = "SEND_CONTACT_REQUEST";
export const ACCEPT_CONTACT_REQUEST = "ACCEPT_CONTACT_REQUEST";
export const REJECT_CONTACT_REQUEST = "REJECT_CONTACT_REQUEST";
export const DELETE_CONTACT = "DELETE_CONTACT";

export const getContacts = (contacts) => ({
  type: GET_CONTACTS,
  payload: contacts,
});

export const getContactRequests = (contactRequests) => ({
  type: GET_CONTACT_REQUESTS,
  payload: contactRequests,
});

export const sendContactRequest = (contactRequest) => ({
  type: SEND_CONTACT_REQUEST,
  payload: contactRequest,
});

export const acceptContactRequest = (contactRequest) => ({
  type: ACCEPT_CONTACT_REQUEST,
  payload: contactRequest,
});

export const rejectContactRequest = (contactRequest) => ({
  type: REJECT_CONTACT_REQUEST,
  payload: contactRequest,
});

export const deleteContact = (contactId) => ({
  type: DELETE_CONTACT,
  payload: contactId,
});
