import { createContext, useReducer } from "react";
import viewReducer from "./viewReducer";

const initialState = {
  isChatActive: false,
  currentConversationId: null,
  isGroupMessage: false,
  isGroupOptionsOpen: false,
  isAddingUser: false,
  isLeavingGroup: false,
  recipientId: null,
  shouldRefetch: false,
  groupId: null,
};

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(viewReducer, initialState);

  return (
    <ViewContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewContext.Provider>
  );
};

export default ViewContext;
