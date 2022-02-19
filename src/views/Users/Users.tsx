import React from "react";
import { Box, Button, Container, createStyles, makeStyles, TableCell, Theme } from "@material-ui/core";
import Page from "../../components/Page";
import { getUsers } from "../../api/API";
import useUrlSearch from "../../utils/UrlSearch";
import PageableItemsCard from "../../components/PageableItemsCard";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import UserTableCell from "./UserTableCell";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import UserLink from "../Users/UserLink";
import DateTimeTableCell from "../../components/DateTimeTableCell";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    results: {
      marginTop: theme.spacing(3),
    },
    search: {
      flexGrow: 1,
      maxWidth: 480,
      flexBasis: 480,
      margin: theme.spacing(0, 2),
    },
  });

const useStyles = makeStyles(styles);


const Users: React.FC = () => {
  const [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize] = useUrlSearch(getUsers);

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving users", fetchState.error, refetch)
    : null;

  const classes = useStyles();
  return (
    <Page className={classes.root} title="Users">
      <Container maxWidth={false}>
        <PageHeader title="Users">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
          >
            <SearchInput
              className={classes.search}
              searchTerm={searchTerm}
              onChange={setSearchTerm}
            />
            <Button color="primary" variant="contained" style={{ minWidth: "fit-content" }}>
              Add user
            </Button>
          </Box>
        </PageHeader>
        <PageableItemsCard
          className={classes.results}
          title="All Users"
          isLoading={fetchState.isFetching}
          noItemsMessage="There are no users to display here"
          showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
          loadingErrorComponent={errorMessageComponent}
          columnHeaders={[
            <TableCell key="id" align="right">ID</TableCell>,
            <TableCell key="user">User</TableCell>,
            <TableCell key="email">Email</TableCell>,
            <TableCell key="role">Role</TableCell>,
            <TableCell key="created" align="right">Created</TableCell>
          ]}
          items={fetchState.items}
          itemKeySelector={user => user.id}
          itemRowCellProvider={user => [
            <TableCell key="id" align="right">
              <UserLink userId={user.id}>
                <Box component="span" fontWeight="fontWeightMedium">{user.id}</Box>
              </UserLink>
            </TableCell>,
            <UserTableCell key="user"
                           userId={user.id}
                           firstName={user.firstName}
                           lastName={user.lastName}
                           email={user.email} />,
            <TableCell key="email">{user.email}</TableCell>,
            <TableCell key="role">{user.role}</TableCell>,
            <DateTimeTableCell key="created" align="right" dateTime={user.createdDateTime}/>
          ]}
          pagination={{
            kind: TablePaginationKind.Routing,
            pageNo: fetchState.pageNo,
            pageSize: fetchState.pageSize,
            onChangePageSize: handleChangePageSize,
            pageCount: fetchState.pageCount,
            totalItemCount: fetchState.totalItemCount,
            labelRowsPerPage: "Users per page:"
          }}
          reload={refetch}
        />
      </Container>
    </Page>
  );
};

export default Users;
