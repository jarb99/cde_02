import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { colors, Divider } from "@material-ui/core";
import OverviewTabPanel from "./OverviewTabPanel";
import ListTabPanel from "./ListTabPanel";
import CustomerOrders from "./CustomerOrders";
import { createCurrentCustomerLicenses, createExpiredCustomerLicenses } from "./CustomerLicenses";
import { createCurrentCustomerSubscriptions, createExpiredCustomerSubscriptions } from "./CustomerSubscriptions";
import CustomerUsers from "./CustomerUsers";

interface CustomerDetailsTabsProps {
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

const CustomerDetailsTabs: React.FC<CustomerDetailsTabsProps> = (props: CustomerDetailsTabsProps) => {
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
        aria-label="customer details tabs"
      >
        <Tab label="Overview" {...a11yProps(0)} />
        <Tab label="Users" {...a11yProps(1)} />
        <Tab label="Subscriptions" {...a11yProps(2)} />
        <Tab label="Orders" {...a11yProps(3)} />
        <Tab label="Invoices" {...a11yProps(4)} />
        <Tab label="Licenses" {...a11yProps(5)} />
      </Tabs>
      <Divider className={classes.divider}/>
      <div className={classes.tabPanel}>
        <TabPanel value={value} index={0}>
          <OverviewTabPanel userId={props.customerId}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CustomerUsers customerId={props.customerId}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {createCurrentCustomerSubscriptions(props.customerId)}
          {createExpiredCustomerSubscriptions(props.customerId)}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CustomerOrders customerId={props.customerId}/>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <ListTabPanel/>
        </TabPanel>
        <TabPanel value={value} index={5}>
          {createCurrentCustomerLicenses(props.customerId)}
          {createExpiredCustomerLicenses(props.customerId)}
        </TabPanel>
      </div>
    </>
  );
};

export default CustomerDetailsTabs;