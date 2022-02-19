import React from "react";
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Theme,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import CountrySummary from "../../models/CountrySummary";
import { Field, Form, Formik } from "formik";
import clsx from 'clsx';
import FormActions from "../../components/FormActions";
import useApiFetch from "../../api/ApiFetch";
import { getCountries } from "../../api/API";
import DialogHeader from "../../components/DialogHeader";
import BusinessIcon from "@material-ui/icons/Business";


export interface OrderCustomerEditFields {
  companyName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: CountrySummary | null;
  taxNumber: string | null;
}

interface OrderCustomerEditDialogProps extends OrderCustomerEditFields {
  open: boolean;
  onCancel: () => void;
  onOk: (customer: OrderCustomerEditFields) => void;
}

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(1, 3)
  },
  input: {},
  focused: {},
  disabled: {},
  adornment: {
    padding: 4,
    color: theme.palette.action.active
  },
  clearIndicator: {
    marginRight: -2,
    visibility: "hidden",
  },
  clearIndicatorVisible: {
    visibility: "visible",
  },
});

const useStyles = makeStyles(styles);

const orderCustomerSchema = Yup.object().shape({
  companyName:
    Yup.string()
    .nullable()
    .max(255, "Too long"),

  address:
    Yup.string()
    .nullable()
    .max(255, "Too long"),

  city:
    Yup.string()
    .nullable()
    .max(255, "Too long"),

  state:
    Yup.string()
    .nullable()
    .max(255, "Too long"),

  postalCode:
    Yup.string()
    .nullable()
    .max(255, "Too long"),

  countryId:
    Yup.string(),

  taxNumber:
    Yup.string()
    .nullable()
    .max(255, "Too long"),
});

const OrderCustomerEditDialog: React.FC<OrderCustomerEditDialogProps> = (props: OrderCustomerEditDialogProps) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [countriesState] = useApiFetch<CountrySummary[]>(getCountries);

  const classes = useStyles();

  type FormFields =
    { [P in keyof OrderCustomerEditFields]: Exclude<OrderCustomerEditFields[P], null> | undefined }
    & { countryId: string | undefined };

  const handleSubmit = async (values: FormFields) => {
    const countryId = (values.countryId && Number.parseInt(values.countryId)) || -1;

    props.onOk(
      {
        companyName: values.companyName || null,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        postalCode: values.postalCode || null,
        country: (countriesState.data || []).find(country => country.id === countryId) || null,
        taxNumber: values.taxNumber || null
      }
    );
  };

  const initialValues: FormFields = {
    companyName: props.companyName || undefined,
    address: props.address || undefined,
    city: props.city || undefined,
    state: props.state || undefined,
    postalCode: props.postalCode || undefined,
    country: props.country || undefined,
    countryId: countriesState.data && countriesState.data.length > 0 ? props.country?.id.toString() : "",
    taxNumber: props.taxNumber || undefined
  };

  const ClearInputButton: React.FC<{ value: string | undefined, onClick: () => void }> = (props) => {
    return (
      <IconButton
        className={clsx(classes.adornment, classes.clearIndicator, {[classes.clearIndicatorVisible]: (props.value?.length || 0) > 0})}
        aria-label="clear"
        onClick={props.onClick}>
        <CloseIcon fontSize="small"/>
      </IconButton>
    );
  }

  return (
    <Formik initialValues={initialValues}
            validationSchema={orderCustomerSchema}
            enableReinitialize
            onSubmit={handleSubmit}
    >
      {({submitForm, isSubmitting, values, setFieldValue}) => (
        <Dialog fullWidth
                fullScreen={smDown}
                open={props.open}
                onClose={props.onCancel}>
          <DialogHeader title="Edit Customer"
                        avatar={<BusinessIcon/>}
                        onClose={props.onCancel}/>
          <DialogContent>

            <Form>
              <Grid container justify="flex-start" spacing={1}>
                <Grid item xs={12}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="companyName"
                         type="text"
                         label="Company Name"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.companyName}
                                               onClick={() => setFieldValue("companyName", "")}/>
                           )
                         }}
                         autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="address"
                         type="text"
                         label="Address"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.address} onClick={() => setFieldValue("address", "")}/>
                           )
                         }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="city"
                         type="text"
                         label="City"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.city} onClick={() => setFieldValue("city", "")}/>
                           )
                         }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="state"
                         type="text"
                         label="State"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.state} onClick={() => setFieldValue("state", "")}/>
                           )
                         }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="postalCode"
                         type="text"
                         label="Postal Code"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.postalCode}
                                               onClick={() => setFieldValue("postalCode", "")}/>
                           )
                         }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         select
                         variant="filled"
                         name="countryId"
                         label="Country"
                         fullWidth
                         helperText=" "
                         children={[
                           <MenuItem key={-1} value=""/>,
                           ...(countriesState.data || []).map(country => (
                             <MenuItem key={country.id} value={country.id.toString()}>{country.name}</MenuItem>
                           ))
                         ]}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={TextField}
                         disabled={isSubmitting || countriesState.isFetching}
                         variant="filled"
                         name="taxNumber"
                         type="text"
                         label="Tax Number"
                         fullWidth
                         helperText=" "
                         InputProps={{
                           classes: {
                             root: classes.input,
                             focused: classes.focused,
                             disabled: classes.disabled
                           },
                           endAdornment: (
                             <ClearInputButton value={values.taxNumber}
                                               onClick={() => setFieldValue("taxNumber", "")}/>
                           )
                         }}
                  />
                </Grid>
              </Grid>
            </Form>
          </DialogContent>
          <DialogActions>
            <FormActions disabled={isSubmitting || countriesState.isFetching}
                         submitText="Ok"
                         onSubmit={submitForm}
                         onCancel={props.onCancel}/>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};


export default OrderCustomerEditDialog;