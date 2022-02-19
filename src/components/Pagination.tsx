import React from "react";
import { TablePagination, LabelDisplayedRowsArgs } from "@material-ui/core";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import { TablePaginationKind } from "./TablePaginationKind";
import TablePaginationActions from "./TablePaginationActions";
import RoutingTablePaginationActions from "./RoutingTablePaginationActions";

export interface PaginationProps {
  kind: TablePaginationKind;
  pageNo: number;
  onChangePageNo?: (pageNo: number) => void;
  pageSize: number;
  pageSizes?: number[];
  onChangePageSize?: (pageSize: number) => void;
  pageCount: number;
  totalItemCount: number;
  labelRowsPerPage?: string;
  labelDisplayedRows?: (
    paginationInfo: LabelDisplayedRowsArgs
  ) => React.ReactNode;
}

function Pagination(props: PaginationProps) {
  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageIndex: number
  ) {
    if (props.onChangePageNo) {
      props.onChangePageNo(pageIndex + 1);
    }
  }

  function handleChangeRowsPerPage(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (props.onChangePageSize) {
      const newPageSize = parseInt(event.target.value);
      props.onChangePageSize(newPageSize);
    }
  }

  function labelDisplayedRows(
    paginationInfo: LabelDisplayedRowsArgs
  ): React.ReactNode {
    if (props.labelDisplayedRows) {
      return props.labelDisplayedRows(paginationInfo);
    }
    return `Page ${props.pageNo} of ${props.pageCount}`;
  }

  function getActionsComponent(): React.ElementType<
    TablePaginationActionsProps
  > {
    if (props.kind === TablePaginationKind.Routing) {
      return RoutingTablePaginationActions;
    }
    return TablePaginationActions;
  }

  return (
    <TablePagination
      component="div"
      style={{ marginTop: "8px" }}
      count={props.totalItemCount}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      page={props.pageNo - 1}
      rowsPerPage={props.pageSize}
      rowsPerPageOptions={props.pageSizes || [5, 10, 25]}
      labelRowsPerPage={props.labelRowsPerPage}
      labelDisplayedRows={labelDisplayedRows}
      ActionsComponent={getActionsComponent()}
    />
  );
}

export default Pagination;
