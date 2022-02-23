import React, { useEffect, useState, useReducer } from "react";
import { Box } from "@material-ui/core";
import UnderConstruction from "../../components/UnderConstruction";

import ProjectNavBar from "../../layouts/Dashboard/ProjectNavBar";

const Subscriptions = () => {

   return (
      <>
         <Box
            display="flex"
            flexDirection="column"
            style={{
               width: "100%",
               height: "calc(100% - 15px)",
            }}
         >
            <ProjectNavBar title={"SUBSCRIPTIONS"} />
            <Box
               style={{
                  height: "400px",
                  flexGrow: 1,
                  width: "100%",
               }}
            >
               <UnderConstruction />
            </Box>
         </Box>
      </>
   );
};

export default Subscriptions;
