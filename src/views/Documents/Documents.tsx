import React, { useEffect, useState, useReducer } from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Table from './Table';
// import Properties from "./Properties"; //
// import Subscriptions from "./Subscriptions";
// import { fetchDocuments, updateDocument } from "../../apiFake/API";

import Header from "./Header";
import Toolbar from "./Toolbar";
import ProjectNavBar from "../../layouts/Dashboard/ProjectNavBar";


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

const Documents = () => {
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
            <ProjectNavBar 
            title={"DOCUMENTS"}
            handleTabChange={handleTabChange} 
            tabValue={tab} />
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

export default Documents;
