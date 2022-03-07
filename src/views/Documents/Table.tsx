import React, { useEffect, useContext, useCallback } from "react";
import { Box, makeStyles, useTheme } from "@material-ui/core";
import { StateContext } from "../../App";
import TableFunctions from "./TabulatorTable";

const Table = () => {
  console.log("TABLE.tsx RENDER");
  const theme = useTheme();
  const { state } = useContext(StateContext);

  const useStyles = makeStyles({
    "@global": {
      "*.tabulator-col,.tabulator-headers": {
        backgroundColor: `${theme.palette.grey[700]} !important`
      }
    }   
  });
  useStyles();

  // const doCreateTable = useCallback(() => {
  //   createTable(state.documents, el);
  // }, [state.documents, el]);

  return (
    <>
      <Box
        style={{
          backgroundColor: "#ffffff",
          height: "100%",
          width: "100%"
        }}
        //   className={"panelBorder"}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%"
          }}
        >
          <TableFunctions />
        </div>
      </Box>
    </>
  );
};

export default Table;
