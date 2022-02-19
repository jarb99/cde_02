import * as React from "react";
import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { colors, Divider } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CustomerUsers from "../Customers/CustomerUsers";
import CustomerOrders from "../Customers/CustomerOrders";
import ResellerCustomers from "./ResellerCustomers";
import { CustomerOrdersMode } from "../Customers/CustomerOrdersPageableItemsCard";


interface ResellerDetailsTabsProps {
  customerId: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  tabPanel: {
    '& .MuiCard-root': {
      marginBottom: theme.spacing(3)
    }
  }
}));

const ResellerDetailsTabs: React.FC<ResellerDetailsTabsProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="reseller details tabs"
      >
        <Tab label="Users" {...a11yProps(0)} />
        <Tab label="Clients" {...a11yProps(1)} />
        <Tab label="Orders" {...a11yProps(2)} />
      </Tabs>
      <Divider className={classes.divider}/>
      <div className={classes.tabPanel}>
        <TabPanel value={value} index={0}>
          <CustomerUsers customerId={props.customerId}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ResellerCustomers resellerId={props.customerId}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CustomerOrders customerId={props.customerId} mode={CustomerOrdersMode.Reseller}/>
        </TabPanel>
      </div>
    </>
  );
};

export default ResellerDetailsTabs;