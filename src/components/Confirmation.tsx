import React from "react";
import { createStyles, makeStyles, Box, Typography, Button, Theme, Divider } from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    root: {
      minWidth: "350px",
    },
    content: {
      padding: theme.spacing(2, 3),
    },
    summaryContainer: {
      paddingBottom: theme.spacing(1),
    },
    messageContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    footer: {
      padding: theme.spacing(1),
    },
    buttonPanel: {},
    button: {}
  });

const useStyles = makeStyles(styles);

interface ConfirmationProps {
  summary: string;
  message?: string;
  confirmText?: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = (props: ConfirmationProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.content}>
        <Box className={classes.summaryContainer}>
          <Typography variant="h4" color="secondary">{props.summary}</Typography>
        </Box>
        {props.message && (
          <Box className={classes.messageContainer}>
            <Typography variant="body1">{props.message}</Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <Box className={classes.footer}
           display="flex"
           alignItems="center">
        <Box flexGrow={1}></Box>
        <Box className={classes.buttonPanel}>
          <Button className={classes.button}
                  variant="text"
                  color="primary"
                  size="large"
                  onClick={props.onConfirm}>
            {props.confirmText || "Yes"}
          </Button>
          <Button className={classes.button}
                  variant="text"
                  size="large"
                  onClick={props.onCancel}>
            {props.cancelText || "Cancel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Confirmation;
