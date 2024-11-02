import { createContext, useReducer, useContext } from "react";
import groupReducer from "./groupReducer";
import { setGroups } from "./groupActions"; // Ensure this import is correct

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
