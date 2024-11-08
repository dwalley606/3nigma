import { createContext, useReducer, useContext } from "react";
import contactsReducer from "./contactsReducer";

const initialState = {
  contacts: [],
  contactRequests: [],
  requestedContacts: new Set(), // Ensure this is initialized as a Set
};

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  return (
    <ContactsContext.Provider value={{ state, dispatch }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
