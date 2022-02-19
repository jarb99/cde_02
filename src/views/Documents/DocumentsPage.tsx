import React, { useEffect, useState, useReducer } from "react";
import Box from "@material-ui/core/Box";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Grid from "@material-ui/core/Grid";
// import Properties from "./Properties"; //
// import Subscriptions from "./Subscriptions";
import * as data from "./tempData.json";

const Table = () => {
  let el: any = React.createRef();

  let table: any;

  function createTable(): void {
    console.log("data:", Object.values(data));
    table = new Tabulator(el, {
      height: "100%",
      data: Object.values(data),
      columns: [
        {
          title: "",
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          hozAlign: "center",
          width: 20,
          headerSort: false,
          cellClick: function (e, cell) {
            cell.getRow().toggleSelect();
          },
        },
        { title: "DISCIPLINE", field: "Discipline", vertAlign: "middle" },
        { title: "DOCUMENT NUMBER", field: "num", vertAlign: "middle" },
        {
          title: "TITLE/DESCRIPTION",
          field: "Drawing Title",
          widthGrow: 3,
          vertAlign: "middle",
        },
        {
          title: "REVISION",
          field: "Revision",
          hozAlign: "center",
          vertAlign: "middle",
        },
      ],
      layout: "fitColumns",
      maxHeight: "100%",
      history: true,
      keybindings: {
        navUp: false,
        navDown: false,
        scrollToStart: false,
        scrollToEnd: false,
      },
      movableColumns: true,
    });
  }

  useEffect(() => {
    setTimeout(() => {
      createTable();
    }, 200);
  }, []);

  return (
    <>
      <Box
        style={{
          backgroundColor: "#ffffff",
          height: "100%",
          width: "100%",
        }}
        //   className={"panelBorder"}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
          }}
        >
          <div ref={(refEl) => (el = refEl)} />
        </div>
      </Box>
    </>
  );
};

enum actionKind {
  SETDATA = "SETDATA",
  SETCOLUMNS = "SETCOLUMNS",
}

interface actionInterface {
  type: actionKind;
  payload: any;
}

interface stateInterface {
  data: Array<object>;
  columns: Array<object>;
}

const documentsReducer = (
  state: stateInterface,
  action: actionInterface
): stateInterface => {
  const { type, payload } = action;
  switch (type) {
    case actionKind.SETDATA:
      return { ...state, data: payload };
    case actionKind.SETCOLUMNS:
      return { ...state, columns: payload };
  }
  console.log("reducer output: ", type, payload);
};

const DocumentsPage = () => {
//   const [state, dispatch] = useReducer(documentsReducer, {
//     data: null,
//     columns: null,
//   });

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        style={{
          height: "calc(100% - 15px)",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box>
          {/* <Subscriptions /> */}
        </Box>
        <Box
          style={{
            flexGrow: 1,
            maxHeight: "100%",
            width: "500px",
            height: "100%",
            marginLeft: "10px;",
            marginRight: "10px;",
            // maxWidth:"100%",
            // overflow: 'auto'
          }}
          className="panelBorder"
        >
          <Box style={{ height: "100%", width: "100%" }}>
            <Table />
          </Box>
        </Box>
        <Box>
          {/* <Properties /> */}
        </Box>
      </Box>
    </>
  );
};

export default DocumentsPage;
