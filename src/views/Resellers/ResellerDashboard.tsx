import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { CancelToken } from "axios";
import { getCustomer } from "../../api/API";
import useApiFetch from "../../api/ApiFetch";
import CustomerDetails from "../../models/CustomerDetails";
import ContactSummary from "../../models/ContactSummary";
import Page from "../../components/Page";
import { Grid, Theme } from "@material-ui/core";
import CustomerCard from "../Customers/CustomerCard";
import ContactCard from "../Contact/ContactCard";
import { makeStyles } from "@material-ui/core/styles";
import ResellerDetailsTabs from "./ResellerDetailsTabs";


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

interface ResellerDashboardProps {

}

const ResellerDashboard: React.FC<ResellerDashboardProps> = (props) => {
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
    <Page className={classes.root} title="Reseller Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomerCard isLoading={customerState.isFetching}
                        name={currentCustomer?.name}
                        city={currentCustomer?.city}
                        state={currentCustomer?.state}
                        country={currentCustomer?.country?.name} 
                        isReseller={true}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <ContactCard isLoading={customerState.isFetching}
                       customer={currentCustomer || undefined}
                       onContactChanged={handleContactChanged}/>
        </Grid>
        <Grid item xs={12}>
          <ResellerDetailsTabs customerId={id}/>
        </Grid>
      </Grid>
    </Page>
  );
};

export default ResellerDashboard;