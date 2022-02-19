import React, { CSSProperties, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  createStyles,
  Divider,
  Fade,
  IconButton,
  LinearProgress,
  makeStyles,
  Theme,
  Toolbar,
  Tooltip,
  Typography
} from "@material-ui/core";
import classNames from "classnames";
import ItemsTable, { ItemsTableProps } from "./ItemsTable";
import Pagination, { PaginationProps } from "./Pagination";
import FadeTransition from "./FadeTransition";
import RefreshIcon from '@material-ui/icons/Refresh';


const styles = (theme: Theme) =>
  createStyles({
    root: {},
    progress: {
      height: 1,
      marginTop: -1
    },
    content: {
      padding: 0
    },
    actions: {
      padding: theme.spacing(1, 2),
      justifyContent: "flex-end"
    },
    message: {
      padding: theme.spacing(5),
      display: 'flex',
      justifyContent: 'center'
    },
    refreshToolbar: {
      minHeight: 52, 
      marginTop: theme.spacing(1)
    }
  });

const useStyles = makeStyles(styles);

interface PagedItemsCardProps<TItem, TKey extends React.Key>
  extends ItemsTableProps<TItem, TKey> {
  className?: string;
  style?: CSSProperties;
  title: string;
  action?: React.ReactNode;
  pagination?: PaginationProps;
  showLoadingError?: boolean;
  loadingErrorComponent?: React.ReactNode | null;
  noItemsMessage?: string;
  reload?: () => void;
}

function PageableItemsCard<TItem, TKey extends React.Key>({       
  className,
  style,
  title,
  action,
  isLoading,
  showLoadingError,
  loadingErrorComponent,
  columnHeaders,
  items,
  noItemsMessage,
  itemKeySelector,
  itemRowCellProvider,
  selectedItemKeys,
  onChangeSelectedItemKeys,
  footers,
  pagination,
  reload
}: PagedItemsCardProps<TItem, TKey>) {
  const [wasLoaded, setWasLoaded] = useState<boolean>(false);
  const [initialPageSize] = useState<number>(pagination?.pageSize || Number.MAX_SAFE_INTEGER);

  if (!wasLoaded && !isLoading) {
    setWasLoaded(true);
  }

  const classes = useStyles();

  const outerClassName = className || "_";
  const useClassName = className !== null && className !== undefined;

  const showItems = !showLoadingError && ((items && items.length > 0) || !noItemsMessage);

  const showPagination = showItems && pagination !== undefined && initialPageSize < pagination.totalItemCount;
  const showFooter = showPagination && !showLoadingError;

  const renderCardHeaderAction = (): React.ReactNode | null => {
    if (action) {
      return action;
    }

    const refreshToolbar = wasLoaded
        ? <Toolbar classes={{root: classes.refreshToolbar}} disableGutters>
            <Tooltip title="Reload">
              <span>
                <IconButton onClick={reload} disabled={isLoading}>
                  <RefreshIcon/>
                </IconButton>
              </span>
            </Tooltip>
          </Toolbar>
        : null;
    
    if (pagination && showPagination && !showLoadingError) {
      return (
          <FadeTransition in={wasLoaded}>
            <div style={{display: "flex"}}>
              <Pagination {...pagination}/>
              {reload && refreshToolbar}
            </div>
          </FadeTransition>
      );
    }
    
    if (reload) {
      return refreshToolbar;
    }
    
    return null;
  }

  return (
    <div
      className={classNames({ [outerClassName]: useClassName }, classes.root)}
      style={style}
    >
      <Card>
        <CardHeader
          title={title}
          action={renderCardHeaderAction()}
        />
        {isLoading && !showItems && (
          <Fade in={isLoading && !showItems}>
            <LinearProgress className={classes.progress}/>
          </Fade>
        )}
        <Divider/>

        <CardContent
          className={classes.content}
          style={{ overflow: "hidden" }}
        >
          {showItems &&
          <ItemsTable
            isLoading={isLoading}
            columnHeaders={columnHeaders}
            items={items}
            itemKeySelector={itemKeySelector}
            itemRowCellProvider={itemRowCellProvider}
            selectedItemKeys={selectedItemKeys}
            onChangeSelectedItemKeys={onChangeSelectedItemKeys}
            footers={footers}
          />}
          
          {!isLoading && !showLoadingError && ((!items || items.length === 0) && noItemsMessage) &&
          <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
            {noItemsMessage}
          </Typography>
          }
          
          {showLoadingError && loadingErrorComponent}
        </CardContent>

        
        <Collapse in={wasLoaded && showFooter}>
          {showFooter &&
          <>
            <Divider style={{marginTop: -1}}/>
            <CardActions className={classes.actions}>
              {pagination && showPagination && !showLoadingError &&
              <Pagination {...pagination} />
              }
            </CardActions>
          </>
          }           
        </Collapse>
      </Card>
    </div>
  );
}

export default PageableItemsCard;
