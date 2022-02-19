import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  createStyles,
  Divider,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import classNames from "classnames";
import ItemsTable, { ItemsTableProps } from "./ItemsTable";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
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
    }
  });

const useStyles = makeStyles(styles);

interface ItemsCardProps<TItem, TKey extends React.Key>
  extends ItemsTableProps<TItem, TKey> {
  className?: string;
  title: string;
  headerAction?: React.ReactNode;
  showLoadingError?: boolean;
  loadingErrorComponent?: React.ReactNode | null;
  noItemsMessage?: string;
  cardActionContent?: React.ReactNode;
}

function ItemsCard<TItem, TKey extends React.Key>({
  className,
  title,
  headerAction,
  isLoading,
  showLoadingError,
  loadingErrorComponent,
  columnHeaders,
  items,
  noItemsMessage,
  cardActionContent,
  itemKeySelector,
  itemRowCellProvider,
  selectedItemKeys,
  onChangeSelectedItemKeys,
  footers
}: ItemsCardProps<TItem, TKey>) {
  const [wasLoaded, setWasLoaded] = useState<boolean>(false);

  if (!wasLoaded && !isLoading) {
    setWasLoaded(true);
  }

  const classes = useStyles();

  const outerClassName = className || "_";
  const useClassName = className !== null && className !== undefined;

  const showFooter = cardActionContent !== null && cardActionContent !== undefined;

  return (
    <div
      className={classNames({ [outerClassName]: useClassName }, classes.root)}
    >
      <Card>
        <CardHeader
          title={title}
          action={headerAction}
        />
        <Divider/>

        <CardContent
          className={classes.content}
          style={{ overflow: "hidden" }}
        >
          {!showLoadingError && ((items && items.length > 0) || !noItemsMessage) &&
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

        
        <Collapse in={showFooter && wasLoaded && !showLoadingError}>
            <Divider style={{marginTop: -1}}/>
            <CardActions className={classes.actions}>
              {cardActionContent}
            </CardActions>
        </Collapse>
      </Card>
    </div>
  );
}

export default ItemsCard;
