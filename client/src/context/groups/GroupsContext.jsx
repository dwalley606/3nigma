import { createContext, useReducer, useContext } from "react";
import { groupReducer } from "./groupReducer";

const initialState = {
  groups: [],
};

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, initialState);

  return (
    <GroupsContext.Provider value={{ state, actions }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => useContext(GroupsContext);
