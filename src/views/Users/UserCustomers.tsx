import * as React from "react";
import { useCallback, useState } from "react";
import PageableItemsCard from "../../components/PageableItemsCard";
import { Box, Button, createStyles, Drawer, IconButton, TableCell, Theme, Tooltip } from "@material-ui/core";
import { getUser, getUserCustomers } from "../../api/API";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import useApiSearch from "../../api/ApiSearch";
import { CancelToken } from "axios";
import CustomerLink from "../Customers/CustomerLink";
import CustomerTableCell from "../Customers/CustomerTableCell";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { usePageState } from "../../components/PageState";
import { makeStyles } from "@material-ui/core/styles";
import CustomerUserSummary from "../../models/CustomerUserSummary";
import UserCustomerEdit, { CustomerEdit } from "./UserCustomerEdit";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import useApiFetch from "../../api/ApiFetch";
import CustomerUserRole from "../../models/CustomerUserRole";


interface UserCustomersProps {
  userId: number;
}

interface EditState {
  isOpen: boolean;
  isEditMode: boolean;
  initialValues: CustomerEdit | null;
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

const UserCustomers: React.FC<UserCustomersProps> = (props) => {
  const classes = useStyles();
  
  const {userId} = props;
  const [{pageNo, pageSize}, setPageNo, setPageSize] = usePageState({pageNo: 1, pageSize: 10});
  
  const fetchUser = useCallback((cancelToken?: CancelToken) => getUser(userId, cancelToken), [userId]);
  const [fetchUserState] = useApiFetch(fetchUser);
  
  const fetchUserCustomers = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getUserCustomers(userId, true, search, pageNo, pageSize, cancelToken), [userId]);
  const [fetchUserCustomersState, refetchUserCustomers] = useApiSearch(fetchUserCustomers, undefined, pageNo, pageSize);

  const [editState, setEditState] = useState<EditState | null>(null);

  const handleCustomerEditComplete = () => {
    setEditState((prevState) => ({...prevState!, isOpen: false}));
  };

  const handleCustomerAdd = () => {
    setEditState({isOpen: true, isEditMode: false, initialValues: null });
  }

  const handleCustomerEdit = (summary: CustomerUserSummary) => {
    setEditState({
      isOpen: true,
      isEditMode: true,
      initialValues: {
        customer: summary.customer,
        role: summary.role,
        isActive: summary.isActive
      }
    });
  }

  const handleCustomerEdited = () => {
    refetchUserCustomers();
    handleCustomerEditComplete();
  }
  
  const errorMessageComponent = fetchUserCustomersState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving customers", fetchUserCustomersState.error, refetchUserCustomers)
    : null;

  return (
    <>
      <PageableItemsCard title="Customers"
                         action={
                           <Box display="flex"
                                alignContent="center"
                                className={classes.addButton}>
                             <Button variant="contained"
                                     color="primary"
                                     onClick={handleCustomerAdd}
                                     startIcon={<AddIcon/>}>
                               Add
                             </Button>
                           </Box>
                         }
                         isLoading={fetchUserCustomersState.isFetching}
                         noItemsMessage="There are no customers to display here"
                         showLoadingError={fetchUserCustomersState.hasErrored && !fetchUserCustomersState.hasErroredWithNotFound}
                         loadingErrorComponent={errorMessageComponent}
                         columnHeaders={[
                           <TableCell key="id" align="right">ID</TableCell>,
                           <TableCell key="customer">Customer</TableCell>,
                           <TableCell key="role">Role</TableCell>,
                           <TableCell key="status">Status</TableCell>,
                           <TableCell key="actions" className={classes.actionCell}/>
                         ]}
                         items={fetchUserCustomersState.items}
                         itemKeySelector={customerUser => customerUser.customer.id}
                         itemRowCellProvider={customerUser => [
                           <TableCell key="id" align="right">
                             <CustomerLink customerId={customerUser.customer.id}>
                               <Box component="span" fontWeight="fontWeightMedium">{customerUser.customer.id}</Box>
                             </CustomerLink>
                           </TableCell>,
                           <CustomerTableCell key="customer"
                                              customerId={customerUser.customer.id}
                                              name={customerUser.customer.name}
                                              country={customerUser.customer.country}/>,
                           <TableCell key="role">{customerUser.role}</TableCell>,
                           <TableCell key="status">{customerUser.isActive ? "Active" : "Inactive"}</TableCell>,
                           <TableCell key="actions" className={classes.actionCell}>
                             {customerUser.role !== CustomerUserRole.Owner &&
                             <Tooltip title="Edit">
                               <IconButton edge="end"
                                           aria-label="edit customer"
                                           onClick={() => handleCustomerEdit(customerUser)}>
                                 <EditIcon fontSize="small"/>
                               </IconButton>
                             </Tooltip>
                             }
                           </TableCell>
                         ]}
                         pagination={{
                           kind: TablePaginationKind.Default,
                           pageNo: fetchUserCustomersState.pageNo,
                           pageSize: fetchUserCustomersState.pageSize,
                           onChangePageNo: setPageNo,
                           onChangePageSize: setPageSize,
                           pageCount: fetchUserCustomersState.pageCount,
                           totalItemCount: fetchUserCustomersState.totalItemCount,
                           labelRowsPerPage: "Customers per page:"
                         }}/>

      <Drawer anchor="right"
              open={editState?.isOpen ?? false}
              onClose={handleCustomerEditComplete}>
        <UserCustomerEdit title={`${editState?.isEditMode ? "Edit" : "Add"} Customer`}
                          submitText={editState?.isEditMode ? "Save" : "Add"}
                          user={fetchUserState.data}
                          initialValues={editState?.initialValues ?? null}
                          allowOwnerRoleSelection={!fetchUserCustomersState.items.some(item => item.isActive && item.role === CustomerUserRole.Owner)}
                          existingCustomers={fetchUserCustomersState.items.map(item => item.customer)}
                          onSubmitted={handleCustomerEdited}
                          onClose={handleCustomerEditComplete}/>
      </Drawer>
    </>
  )
};


export default UserCustomers;