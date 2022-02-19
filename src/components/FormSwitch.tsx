import * as React from "react";
import { fieldToSwitch, SwitchProps } from "formik-material-ui";
import { FormControlLabel, Switch, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


interface FormSwitchProps extends SwitchProps {
  label: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  switchLabel: {
    marginLeft: theme.spacing(1.5)
  }
}));

const FormSwitch: React.FC<FormSwitchProps> = (props) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      classes={{labelPlacementStart: classes.switchLabel}}
      control={<Switch {...fieldToSwitch(props)} color={props.color ?? "primary"}/>}
      label={props.label}
      labelPlacement="start"
    />);
};

export default FormSwitch;