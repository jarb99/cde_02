import React from "react";

import { theme } from "./theme";
import { CssBaseline, makeStyles, ThemeProvider } from "@material-ui/core";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import routes from "./Routes";
import { renderRoutes } from "react-router-config";

// TODO: find out logig behind the configuration...
import ConfigurationContextProvider from "./configuration/ConfigurationContextProvider";

const history = createBrowserHistory();

const useStyles = makeStyles({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "6px"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: `${theme.palette.grey[300]}`
    },
    "*": {
      "scrollbar-color": `${theme.palette.grey[300]} rgba(0,0,0,0)`,
      "scrollbar-width": "thin"
    }
  }
});

const App: React.FC = () => {
  useStyles();

  return (
    <ConfigurationContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router history={history}>
            {/* TODO: ScrollReset */}
            {renderRoutes(routes)}
          </Router>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </ConfigurationContextProvider>
  );
};

export default App;
