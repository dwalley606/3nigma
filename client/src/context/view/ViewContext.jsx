import { createContext, useReducer, useContext } from "react";
import viewReducer, { SET_CHAT_ACTIVE } from "./viewReducer";

const initialState = {
  isChatActive: false,
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

// Custom hook to use the ViewContext
export const useView = () => {
  return useContext(ViewContext);
};
