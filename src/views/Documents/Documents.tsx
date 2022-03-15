import React, {
  useEffect,
  useState,
  useCallback,
  useReducer,
  createContext,
} from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import { getAllDocuments } from "../../api/API";
import { CancelToken } from "axios";
import { apiFetch } from "../../api/ApiFetch";
import Toolbar from "./Toolbar";
import ProjectNavBar from "../../layouts/Dashboard/ProjectNavBar";
import Document from "../../models/Document";
import TabulatorTable from "./TabulatorTable";
import Sidebar from "./Sidebar";

import {
  reducer,
  initialState,
  State,
  ActionType,
  SidebarVisibility,
} from "./documentsReducer";

const StateContext = createContext<{ state: State }>({ state: initialState });
const DispatchContext = createContext<any>(null);

const Documents = () => {
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState); //useContext(DispatchContext);

  const useStyles = makeStyles({
    "@global": {
      "*.tabulator-col,.tabulator-headers": {
        backgroundColor: `${theme.palette.grey[700]} !important`,
      },
    },
  });
  useStyles();

  // GET DATA AND UPDATE GLOBAL STATE
  const getAll: boolean = true;
  const fetchDocuments = useCallback(
    (cancelToken?: CancelToken) => getAllDocuments(getAll, cancelToken),
    [getAll]
  );

  useEffect(() => {
    apiFetch(fetchDocuments).then(
      (result: Partial<{ status: number; data: Document[] }>) => {
        if (result.status === 200) {
          dispatch({
            type: ActionType.loadAllDocuments,
            payload: result.data,
          });
        } else {
          console.log("load table data error: ", result);
        }
      }
    );
  }, []);

  const handleUpdateDocument = (obj: any) => {
    // TODO: update database
    dispatch(obj);
  };

  const [tab, setTab] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, value: number) => {
    setTab(value);
  };

  const content = () => {
    return (
      <>
        <Box
          display="flex"
          flexDirection="column"
          style={{ width: "100%", height: "calc(100% - 15px)" }} //TODO: fix vertical flex
        >
          <ProjectNavBar
            title={"DOCUMENTS"}
            handleTabChange={handleTabChange}
            tabValue={tab}
          />
          <Toolbar />
          <Box
            display="flex"
            flexDirection="row"
            flexGrow={1}
            style={{
              height: "400px",
              width: "100%",
              maxWidth: "100%",
              borderTop: "2px solid lightGrey",
            }}
          >
            <Box>{/* <Subscriptions /> */}</Box>
            {state.sidebarVisibility !== SidebarVisibility.full && (
              <Box
                flexGrow={1} // TODO: fix horizontal resize after zoom in / out window resize.
                style={{
                  maxHeight: "100%",
                  height: "100%",
                  width: "300px",
                }}
              >
                <TabulatorTable
                  documents={state.documents}
                  handleUpdateDocument={handleUpdateDocument}
                />
              </Box>
            )}
            <Box
              style={{
                minWidth: (state.sidebarVisibility === SidebarVisibility.full) ? "100%" : "400px",
              }}
            >
              <Sidebar />
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <>
      <DispatchContext.Provider value={{ dispatch }}>
        <StateContext.Provider value={{ state }}>
          {content()}
        </StateContext.Provider>
      </DispatchContext.Provider>
    </>
  );
};

export { DispatchContext, StateContext };
export default Documents;
