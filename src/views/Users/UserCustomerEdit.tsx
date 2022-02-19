import * as React from "react";
import { useEffect, useState } from "react";
import CustomerSummary from "../../models/CustomerSummary";
import CustomerUserRole from "../../models/CustomerUserRole";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Divider, Grid, IconButton, LinearProgress, Theme, Toolbar, Typography } from "@material-ui/core";
import useApiSend, { SendStatus } from "../../api/ApiSend";
import { updateCustomerUser } from "../../api/API";
import { Field, Formik, FormikValues, validateYupSchema, yupToFormErrors } from "formik";
import { FormikHelpers } from "formik/dist/types";
import CloseIcon from "@material-ui/icons/Close";
import FadeTransition from "../../components/FadeTransition";
import CustomerUserRoleSelect from "../Customers/CustomerUserRoleSelect";
import FormSwitch from "../../components/FormSwitch";
import FormActions from "../../components/FormActions";
import CustomerSelect from "./CustomerSelect";
import UserSummary from "../../models/UserSummary";


export interface CustomerEdit {
  customer: CustomerSummary | null;
  role: CustomerUserRole;
  isActive: boolean;
}

interface CustomerEditFormValues extends Omit<CustomerEdit, "customer"> {
  customerId: number | null;
}

interface UserCustomerEditProps {
  title: string;
  submitText: string;
  user: UserSummary | null;
  initialValues: CustomerEdit | null;
  allowOwnerRoleSelection: boolean;
  existingCustomers: CustomerSummary[];
  readonly?: boolean;
  onSubmitted: () => void;
  onClose: () => void;
}

interface SubmitContext {
  values: CustomerEditFormValues | null;
  setSubmitting: ((isSubmitting: boolean) => void) | null;
}

const userCustomerSchema = Yup.object().shape({
  customerId: Yup
    .number()
    .nullable()
    .when(["$isEdit", "$existingCustomerIds"], (isEdit: boolean, existingUserIds: number[], schema: any) =>
      !isEdit
        ? schema.notOneOf(existingUserIds, "The selected customer is already linked to this user")
        : schema)
    .required("Required"),
  role: Yup
    .mixed<CustomerUserRole>()
    .required("Required"),
  isActive: Yup
    .boolean()
    .required("Required")
});

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1
  },
  form: {
    marginTop: theme.spacing(1),
    minWidth: 400
  },
  progress: {
    height: 1,
    marginTop: -1
  }
}))

const UserCustomerEdit: React.FC<UserCustomerEditProps> = (props) => {
  const {title, submitText, user, allowOwnerRoleSelection, existingCustomers, readonly, onSubmitted, onClose} = props;
  const isEdit = props.initialValues?.customer != null;

  const [saveState, save] = useApiSend(updateCustomerUser);
  const [submitContext, setSubmitContext] = useState<SubmitContext | null>(null);

  const initialValues: CustomerEditFormValues = {
    customerId: props.initialValues?.customer?.id ?? null,
    role: props.initialValues?.role ?? CustomerUserRole.User,
    isActive: props.initialValues?.isActive ?? true
  }

  const classes = useStyles();

  const handleValidate = async (values: FormikValues) => {
    const context = {
      isEdit: isEdit,
      existingCustomerIds: existingCustomers.map(customer => customer.id)
    };

    try {
      await validateYupSchema<FormikValues>(values, userCustomerSchema, false, context);
    } catch (err) {
      return yupToFormErrors(err);
    }

    return {};
  };

  const handleSubmit = async (values: CustomerEditFormValues, {setSubmitting}: FormikHelpers<CustomerEditFormValues>) => {
    save({userId: user?.id!, customerId: values.customerId!, role: values.role, isActive: values.isActive});
    setSubmitContext({values, setSubmitting});
  };

  useEffect(() => {
    if (submitContext == null) {
      return;
    }

    const {setSubmitting} = submitContext;

    if (saveState.status === SendStatus.Completed) {
      setSubmitting!(false);
      onSubmitted();
    }

    if (saveState.status === SendStatus.Failed) {
      setSubmitting!(false);
    }
  }, [saveState.status, submitContext, onSubmitted]);

  return (
    <Formik
      initialValues={initialValues}
      validate={handleValidate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({submitForm, isSubmitting}) => (
        <>
          <Toolbar>
            <Typography variant="h4" color="inherit" className={classes.title}>
              {title}
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="close" onClick={onClose}>
              <CloseIcon/>
            </IconButton>
          </Toolbar>
          <Divider/>
          <FadeTransition in={isSubmitting} duration={!isSubmitting ? 100 : 800}>
            <LinearProgress className={classes.progress}/>
          </FadeTransition>
          <Container>
            <Grid container direction="column" alignItems="stretch" spacing={2} className={classes.form}>
              <Grid item>
                <Field component={CustomerSelect}
                       variant="filled"
                       name="customerId"
                       label="Customer"
                       helperText=" "
                       fullWidth
                       initialCustomer={props.initialValues?.customer}
                       readonly={isEdit} 
                       user={user}/>
              </Grid>
              <Grid container item spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <Field component={CustomerUserRoleSelect}
                         variant="filled"
                         name="role"
                         label="Role"
                         helperText=" "
                         allowOwnerSelection={allowOwnerRoleSelection}
                         fullWidth/>
                </Grid>
                <Grid item>
                  <Field component={FormSwitch}
                         name="isActive"
                         type="checkbox"
                         label="Active"
                  />
                </Grid>
              </Grid>
              {!readonly &&
              <FormActions onSubmit={submitForm}
                           onCancel={onClose}
                           submitText={submitText}
                           disabled={isSubmitting}
                           submitDisabled={saveState.error != null}
                           submitErrorMessage={saveState.error?.message}/>
              }
            </Grid>
          </Container>
        </>
      )}
    </Formik>
  );
};


export default UserCustomerEdit;