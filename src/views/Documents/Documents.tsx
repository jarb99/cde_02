import React, { useEffect, useState, useCallback, useContext } from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import { getAllDocuments } from "../../api/API";
import Table from "./Table";
import { CancelToken } from "axios";
import { apiFetch } from "../../api/ApiFetch";
import Toolbar from "./Toolbar";
import ProjectNavBar from "../../layouts/Dashboard/ProjectNavBar";
import Document from "../../models/Document";
import { DispatchContext } from "../../App";
import { ActionType } from "../../api/globalReducer";

const Documents = () => {
  const { dispatch } = useContext(DispatchContext);

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
            payload: result.data
          });
        } else {
          console.log("load table data error: ", result);
        }
      }
    );
  }, []);

  const [tab, setTab] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, value: number) => {
    setTab(value);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        style={{
          width: "100%",
          height: "calc(100% - 15px)"
          // padding: "10px",
        }}
      >
        {/* <Header title="16008: JUBILIE PLACE"/> */}
        <ProjectNavBar
          title={"DOCUMENTS"}
          handleTabChange={handleTabChange}
          tabValue={tab}
        />
        <Toolbar />
        <Box
          display="flex"
          flexDirection="row"
          style={{
            height: "400px",
            flexGrow: 1,
            width: "100%",
            maxWidth: "100%"
          }}
        >
          <Box>{/* <Subscriptions /> */}</Box>
          <Box
            style={{
              flexGrow: 1,
              maxHeight: "100%",
              width: "500px",
              height: "100%"
              // marginLeft: "10px",
              // marginRight: "10px",
            }}
            // className="panelBorder"
          >
            <Box style={{ height: "100%", width: "100%" }}>
              <Table />
            </Box>
          </Box>
          <Box>{/* <Properties /> */}</Box>
        </Box>
      </Box>
    </>
  );
};

export default Documents;
