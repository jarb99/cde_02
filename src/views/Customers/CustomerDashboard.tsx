import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { useParams } from "react-router";
import { CancelToken } from "axios";
import useApiFetch from "../../api/ApiFetch";
import ContactSummary from "../../models/ContactSummary";
import CustomerDetails from "../../models/CustomerDetails";
import Page from "../../components/Page";
import CustomerDetailsTabs from "../Customers/CustomerDetailsTabs";
import CustomerCard from "./CustomerCard";
import { getCustomer } from "../../api/API";
import ContactCard from "../Contact/ContactCard";
import ResellerCard from "../Resellers/ResellerCard";


const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3)
    },
    results: {
      marginTop: theme.spacing(3)
    }
  });

const useStyles = makeStyles(styles);

interface CustomerDashboardProps {
  
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = (props) => {
  const {customerId} = useParams();
  const id = parseInt(customerId || "");

  const fetchCustomer = useCallback((cancelToken?: CancelToken) => getCustomer(id, cancelToken), [id]);
  const [customerState] = useApiFetch<CustomerDetails>(fetchCustomer);

  const [currentCustomer, setCurrentCustomer] = useState(customerState.data);

  useEffect(() =>
      setCurrentCustomer(customerState.data)
    , [customerState.data]);

  const handleContactChanged = (contact: ContactSummary | null) => {
    setCurrentCustomer({
      ...currentCustomer!,
      contactId: contact?.id || ""
    });
  };
    
  const classes = useStyles();
  
  return (
    <Page className={classes.root} title="Customer Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomerCard isLoading={customerState.isFetching}
                       name={currentCustomer?.name}
                       city={currentCustomer?.city}
                       state={currentCustomer?.state}
                       country={currentCustomer?.country?.name}/>
        </Grid>
        <Grid item xs={12} md={6}>
          {currentCustomer && currentCustomer?.reseller == null &&
          <ContactCard isLoading={customerState.isFetching}
                       customer={currentCustomer || undefined}
                       onContactChanged={handleContactChanged}/>
          }
          {currentCustomer?.reseller != null &&
          <ResellerCard id={currentCustomer.reseller.id}
                        name={currentCustomer.reseller.name}
                        city={currentCustomer.reseller.city}
                        state={currentCustomer.reseller.state}
                        country={currentCustomer.reseller.country.name}/>
          }
        </Grid>
        <Grid item xs={12}>
          <CustomerDetailsTabs customerId={id}/>
        </Grid>
      </Grid>
    </Page>
  );
    
};

export default CustomerDashboard;