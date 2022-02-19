import React from "react";
import { useLocation } from "react-router";
import {
  Theme,
  createStyles,
  makeStyles,
  IconButton,
  useTheme
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import { PagingParams } from "../api/API";
import { Link } from "react-router-dom";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    }
  });

const useStyles = makeStyles(styles);

const RoutingTablePaginationActions: React.FC<TablePaginationActionsProps> = (
  props: TablePaginationActionsProps
) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const pageNo = props.page + 1;
  const lastPageNo = Math.max(1, Math.ceil(props.count / props.rowsPerPage));

  const getPageByDelta = (delta: number): number => {
    return pageNo + delta;
  };

  const getPageUrl = (pageNo: number): string => {
    const query = new URLSearchParams(location.search);
    if (pageNo === 1) {
      query.delete(PagingParams.PAGE_NO);
    } else {
      query.set(PagingParams.PAGE_NO, pageNo.toString());
    }
    return location.pathname + "?" + query.toString();
  };

  const getPageUrlByDelta = (delta: number): string => {
    return getPageUrl(getPageByDelta(delta));
  };

  const handleClick = (event: React.MouseEvent, requestedPageNo: number) => {
    if (
      requestedPageNo === pageNo ||
      requestedPageNo < 1 ||
      requestedPageNo > lastPageNo
    ) {
      event.preventDefault();
    }
  };

  return (
    <div className={classes.root}>
      <Link
        to={getPageUrl(1)}
        onClick={e => handleClick(e, 1)}
        style={{ cursor: pageNo === 1 ? "default" : "pointer" }}
      >
        <IconButton disabled={pageNo === 1} aria-label="first page">
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
      </Link>
      <Link
        to={getPageUrlByDelta(-1)}
        onClick={e => handleClick(e, getPageByDelta(-1))}
        style={{ cursor: pageNo === 1 ? "default" : "pointer" }}
      >
        <IconButton disabled={pageNo === 1} aria-label="previous page">
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
      </Link>
      <Link
        to={getPageUrlByDelta(+1)}
        onClick={e => handleClick(e, getPageByDelta(+1))}
        style={{ cursor: pageNo === lastPageNo ? "default" : "pointer" }}
      >
        <IconButton disabled={pageNo === lastPageNo} aria-label="next page">
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
      </Link>
      <Link
        to={getPageUrl(lastPageNo)}
        onClick={e => handleClick(e, lastPageNo)}
        style={{ cursor: pageNo === lastPageNo ? "default" : "pointer" }}
      >
        <IconButton disabled={pageNo === lastPageNo} aria-label="last page">
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Link>
    </div>
  );
};

export default RoutingTablePaginationActions;
