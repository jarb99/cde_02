import React, { useEffect, useState, useReducer } from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Grid from "@material-ui/core/Grid";
// import Properties from "./Properties"; //
// import Subscriptions from "./Subscriptions";
import data from "./tempData";

import Header from "./Header";
import Toolbar from "./Toolbar";
import Navbar from "./Navbar";

const Table = () => {
   const theme = useTheme();
   let el: any = React.createRef();
   let table: any;

   const useStyles = makeStyles({
      "@global": {
         "*.tabulator-col,.tabulator-headers": {
            backgroundColor: `${theme.palette.grey[700]} !important`,
            // backgroundColor: `#2e2f30 !important;`
         },
      },
   });
   useStyles();

   function createTable(): void {
      table = new Tabulator(el, {
         height: "100%",
         data: Object.values(data),
         persistenceMode: "cookie", //store persistence information in a cookie
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
               headerClick: function (e, column) {
                  console.log(table.getData());
                  //e - the tap event object
                  //column - column component
               },
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
               height: "calc(100% - 15px)",
               // padding: "10px",
            }}
         >
            {/* <Header title="16008: JUBILIE PLACE"/> */}
            <Navbar handleTabChange={handleTabChange} tabValue={tab} />
            <Toolbar />
            <Box
               display="flex"
               flexDirection="row"
               style={{
                  height: "400px",
                  flexGrow: 1,
                  width: "100%",
                  maxWidth: "100%",
               }}
            >
               <Box>{/* <Subscriptions /> */}</Box>
               <Box
                  style={{
                     flexGrow: 1,
                     maxHeight: "100%",
                     width: "500px",
                     height: "100%",
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

export default DocumentsPage;
