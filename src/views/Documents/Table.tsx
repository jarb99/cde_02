import React, { useEffect, useContext, useCallback } from "react";
import { Box, makeStyles, useTheme } from "@material-ui/core";
import { table, createTable } from "./tableFunctions";
import { StateContext } from "../../App";

const Table = () => {
  console.log("TABLE.tsx RENDER");
  const theme = useTheme();
  let el: any = React.createRef();
  const { state } = useContext(StateContext);

  const useStyles = makeStyles({
    "@global": {
      "*.tabulator-col,.tabulator-headers": {
        backgroundColor: `${theme.palette.grey[700]} !important`
      }
    }
  });
  useStyles();

  const doCreateTable = useCallback(() => {
    createTable(state.documents, el);
  }, [state.documents, el]);

  useEffect(() => {
    if (el && state.documents.length !== 0 && table === undefined) {
      doCreateTable();
    }
  }, [el, state, doCreateTable]);

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
          <div ref={(refEl) => (el = refEl)} />
        </div>
      </Box>
    </>
  );
};

export default Table;
