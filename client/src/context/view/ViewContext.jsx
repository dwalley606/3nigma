import { createContext, useReducer } from "react";
import viewReducer from "./viewReducer";

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
