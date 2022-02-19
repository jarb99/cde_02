import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Page from "../../components/Page";
import { useParams } from "react-router";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import UserCard from "./UserCard";
import useApiFetch from "../../api/ApiFetch";
import UserDetails from "../../models/UserDetails";
import { getUser } from "../../api/API";
import { CancelToken } from "axios";
import UserCustomers from "./UserCustomers";

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

interface UserDashboardProps {
  
}

const UserDashboard: React.FC<UserDashboardProps> = (props) => {
  const {userId} = useParams();
  const id = parseInt(userId || "");
  
  const fetchUser = useCallback((cancelToken?: CancelToken) => getUser(id, cancelToken), [id]);
  const [userState] = useApiFetch<UserDetails>(fetchUser);
  
  const [currentUser, setCurrentUser] = useState(userState.data);
  
  useEffect(() => 
    setCurrentUser(userState.data)
  , [userState.data]);
  
  const classes = useStyles();

  return (
    <Page className={classes.root} title="User Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UserCard userId={currentUser?.id} 
                    firstName={currentUser?.firstName} 
                    lastName={currentUser?.lastName} 
                    email={currentUser?.email}
                    isLoading={userState.isFetching}/>
        </Grid>
        <Grid item xs={12}>
          <UserCustomers userId={userId}/>
        </Grid>
      </Grid>
    </Page>
  );
};

export default UserDashboard;
