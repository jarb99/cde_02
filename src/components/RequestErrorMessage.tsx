import React, { ReactElement } from "react";
import { Button, createStyles, makeStyles, Theme, Typography, useTheme, Box } from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Warning';
import ReplayIcon from '@material-ui/icons/Replay';
import { AxiosError } from "axios";

enum ErrorMessageSize {
  Default = "default",
  Small   = "small",
}

interface RequestErrorMessageProps {
  errorMessage: string;
  errorDetail?: string;
  receivedResponse: boolean;
  responseStatusCode?: number;
  onRetry?: () => void;
  size?: ErrorMessageSize;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center'
    }
  });

const useStyles = makeStyles(styles);

const RequestErrorMessage: React.FC<RequestErrorMessageProps> = (props: RequestErrorMessageProps) => {
  const classes = useStyles();
  const canRetry =
    props.onRetry &&
    (!props.receivedResponse ||
      (props.responseStatusCode && props.responseStatusCode >= 500));

  const theme = useTheme();
  return (
    <div style={{
           padding: theme.spacing(props.size === ErrorMessageSize.Small ? 0 : 5),
         }}>
      <Box display="flex">
        <Box style={{
               margin: theme.spacing(props.size === ErrorMessageSize.Small ? 1 : 2),
             }}>
          <WarningIcon color="error" fontSize={props.size === ErrorMessageSize.Small ? "small" : "default"} />
        </Box>
        <Box flexGrow={1}>
          <Typography variant={props.size === ErrorMessageSize.Small ? "subtitle2" : "subtitle1"} color="textSecondary">
            {props.errorMessage}
          </Typography>
          {props.errorDetail && (
            <Typography variant={props.size === ErrorMessageSize.Small ? "caption" : "body2"} color="textSecondary">
              {props.errorDetail}
            </Typography>
          )}
        </Box>
      </Box>
      
      {canRetry &&
      <div className={classes.buttonContainer}
           style={{
             marginTop: theme.spacing(props.size === ErrorMessageSize.Small ? 1 : 4),
           }}>
        <Button color="primary" variant="outlined" startIcon={<ReplayIcon/>} onClick={props.onRetry}
          size={props.size === ErrorMessageSize.Small ? "small" : "medium"}>
          Retry
        </Button>
      </div>
      }
    </div>
  );
};

const createRequestErrorMessage = (
  errorMessage: string, 
  error: AxiosError | null, 
  onRetry?: () => void,
  size: ErrorMessageSize = ErrorMessageSize.Default): ReactElement | null => {
  
  return error != null
    ? <RequestErrorMessage errorMessage={errorMessage}
                           errorDetail={error.message}
                           receivedResponse={error.response != null}
                           responseStatusCode={error.response?.status}
                           onRetry={onRetry}
                           size={size} />
    : null;
};

export { createRequestErrorMessage, ErrorMessageSize };
export default RequestErrorMessage;