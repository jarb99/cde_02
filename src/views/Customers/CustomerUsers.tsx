import * as React from "react";
import { useCallback, useState } from "react";
import PageableItemsCard from "../../components/PageableItemsCard";
import { Box, Button, createStyles, Drawer, IconButton, TableCell, Theme, Tooltip } from "@material-ui/core";
import { getCustomer, getCustomerUsers } from "../../api/API";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import useApiSearch from "../../api/ApiSearch";
import { CancelToken } from "axios";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { usePageState } from "../../components/PageState";
import UserLink from "../Users/UserLink";
import UserTableCell from "../Users/UserTableCell";
import CustomerUserEdit, { UserEdit } from "./CustomerUserEdit";
import AddIcon from "@material-ui/icons/Add";
import CustomerUserSummary from "../../models/CustomerUserSummary";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import useApiFetch from "../../api/ApiFetch";
import CustomerUserRole from "../../models/CustomerUserRole";


interface CustomerUsersProps {
  customerId: number;
}

interface EditState {
  isOpen: boolean;
  isEditMode: boolean;
  initialValues: UserEdit | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      marginTop: theme.spacing(1)
    },
    actionCell: {
      width: "1%",
      whiteSpace: "nowrap",
    }
  }))

const CustomerUsers: React.FC<CustomerUsersProps> = (props) => {
  const classes = useStyles();

  const {customerId} = props;
  const [{pageNo, pageSize}, setPageNo, setPageSize] = usePageState({pageNo: 1, pageSize: 10});

  const fetchCustomer = useCallback((cancelToken?: CancelToken) => getCustomer(customerId, cancelToken), [customerId]);
  const [fetchCustomerState] = useApiFetch(fetchCustomer);
  
  const fetchCustomerUsers = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomerUsers(customerId, true, search, pageNo, pageSize, cancelToken), [customerId]);
  const [fetchCustomerUsersState, refetchCustomerUsers] = useApiSearch(fetchCustomerUsers, undefined, pageNo, pageSize);
 
  const [editState, setEditState] = useState<EditState | null>(null);
  
  const handleUserEditComplete = () => {
    setEditState((prevState) => ({...prevState!, isOpen: false}));
  };
  
  const handleUserAdd = () => {
    setEditState({isOpen: true, isEditMode: false, initialValues: null });
  }
  
  const handleUserEdit = (summary: CustomerUserSummary) => {
    setEditState({
      isOpen: true,
      isEditMode: true,
      initialValues: {
        user: summary.user,
        role: summary.role,
        isActive: summary.isActive
      }
    });
  }
  
  const handleUserEdited = () => {
    refetchCustomerUsers();
    handleUserEditComplete();
  }
  
  const errorMessageComponent = fetchCustomerUsersState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving users", fetchCustomerUsersState.error, refetchCustomerUsers)
    : null;
  
  return (
    <>
      <PageableItemsCard title="Users"
                         action={
                           <Box display="flex"
                                alignContent="center"
                                className={classes.addButton}>
                             <Button variant="contained"
                                     color="primary"
                                     onClick={handleUserAdd}
                                     startIcon={<AddIcon/>}>
                               Add
                             </Button>
                           </Box>
                         }
                         isLoading={fetchCustomerUsersState.isFetching}
                         noItemsMessage="There are no users to display here"
                         showLoadingError={fetchCustomerUsersState.hasErrored && !fetchCustomerUsersState.hasErroredWithNotFound}
                         loadingErrorComponent={errorMessageComponent}
                         columnHeaders={[
                           <TableCell key="id" align="right">ID</TableCell>,
                           <TableCell key="user">User</TableCell>,
                           <TableCell key="role">Role</TableCell>,
                           <TableCell key="status">Status</TableCell>,
                           <TableCell key="actions" className={classes.actionCell}/>
                         ]}
                         items={fetchCustomerUsersState.items}
                         itemKeySelector={customerUser => customerUser.user.id}
                         itemRowCellProvider={customerUser => [
                           <TableCell key="id" align="right">
                             <UserLink userId={customerUser.user.id}>
                               <Box component="span" fontWeight="fontWeightMedium">{customerUser.user.id}</Box>
                             </UserLink>
                           </TableCell>,
                           <UserTableCell key="user"
                                          userId={customerUser.user.id}
                                          firstName={customerUser.user.firstName}
                                          lastName={customerUser.user.lastName}
                                          email={customerUser.user.email}/>,
                           <TableCell key="role">{customerUser.role}</TableCell>,
                           <TableCell key="status">{customerUser.isActive ? "Active" : "Inactive"}</TableCell>,
                           <TableCell key="actions" className={classes.actionCell}>
                             {customerUser.role !== CustomerUserRole.Owner && 
                             <Tooltip title="Edit">
                               <IconButton edge="end"
                                           aria-label="edit user"
                                           onClick={() => handleUserEdit(customerUser)}>
                                 <EditIcon fontSize="small"/>
                               </IconButton>
                             </Tooltip>}
                           </TableCell>
                         ]}
                         pagination={{
                           kind: TablePaginationKind.Default,
                           pageNo: fetchCustomerUsersState.pageNo,
                           pageSize: fetchCustomerUsersState.pageSize,
                           onChangePageNo: setPageNo,
                           onChangePageSize: setPageSize,
                           pageCount: fetchCustomerUsersState.pageCount,
                           totalItemCount: fetchCustomerUsersState.totalItemCount,
                           labelRowsPerPage: "Users per page:"
                         }}/>

      <Drawer anchor="right"
              open={editState?.isOpen ?? false}
              onClose={handleUserEditComplete}>
        <CustomerUserEdit title={`${editState?.isEditMode ? "Edit" : "Add"} User`}
                          submitText={editState?.isEditMode ? "Save" : "Add"}
                          customer={fetchCustomerState.data}
                          initialValues={editState?.initialValues ?? null}
                          allowOwnerRoleSelection={!fetchCustomerUsersState.items.some(item => item.isActive && item.role === CustomerUserRole.Owner)}
                          existingUsers={fetchCustomerUsersState.items.map(item => item.user)}
                          onSubmitted={handleUserEdited}
                          onClose={handleUserEditComplete}/>
      </Drawer>
    </>
  )
};


export default CustomerUsers;