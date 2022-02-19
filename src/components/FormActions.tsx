import React from "react";
import { Button, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";


interface FormActionsProps {
  disabled?: boolean;
  submitErrorMessage?: string;
  submitText?: string;
  submitDisabled?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorMessage: {
      paddingLeft: theme.spacing(1)
    }
  }));

const FormActions: React.FC<FormActionsProps> = (props) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="space-between" alignItems="flex-end">
      <Grid item>
        {props.submitErrorMessage &&
        <Grid container item direction="row" alignContent="center" spacing={1} className={classes.errorMessage}>
          <Grid item>
            <WarningIcon color="error"/>
          </Grid>
          <Grid item>
            <Typography color="error">
              {props.submitErrorMessage}
            </Typography>
          </Grid>
        </Grid>
        }
      </Grid>
      <Grid item>
        <Grid container item direction="row" justify="flex-end">
          <Grid item>
            <Button color="primary" disabled={props.disabled} onClick={props.onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button color="primary" disabled={props.disabled || props.submitDisabled} onClick={props.onSubmit}>
              {props.submitText || "Save"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
};

export default FormActions;