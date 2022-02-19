import * as React from "react";
import { useEffect, useState } from "react";
import UserSummary from "../../models/UserSummary";
import CustomerUserRole from "../../models/CustomerUserRole";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Divider, Grid, IconButton, LinearProgress, Theme, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FadeTransition from "../../components/FadeTransition";
import FormActions from "../../components/FormActions";
import { Field, Formik, FormikValues, validateYupSchema, yupToFormErrors } from "formik";
import * as Yup from "yup";
import UserSelect from "../Users/UserSelect";
import CustomerUserRoleSelect from "./CustomerUserRoleSelect";
import { FormikHelpers } from "formik/dist/types";
import { updateCustomerUser } from "../../api/API";
import useApiSend, { SendStatus } from "../../api/ApiSend";
import FormSwitch from "../../components/FormSwitch";
import CustomerSummary from "../../models/CustomerSummary";


export interface UserEdit {
  user: UserSummary | null;
  role: CustomerUserRole;
  isActive: boolean;
}

interface UserEditFormValues extends Omit<UserEdit, "user"> {
  userId: number | null;
}

interface CustomerUserEditProps {
  title: string;
  submitText: string;
  customer: CustomerSummary | null;
  initialValues: UserEdit | null;
  allowOwnerRoleSelection: boolean;
  existingUsers: UserSummary[];
  readonly?: boolean;
  onSubmitted: () => void;
  onClose: () => void;
}

interface SubmitContext {
  values: UserEditFormValues | null;
  setSubmitting: ((isSubmitting: boolean) => void) | null;
}

const customerUserSchema = Yup.object().shape({
  userId: Yup
    .number()
    .nullable()
    .when(["$isEdit", "$existingUserIds"], (isEdit: boolean, existingUserIds: number[], schema: any) => 
      !isEdit 
        ? schema.notOneOf(existingUserIds, "The selected user is already linked to this customer") 
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
}));

const CustomerUserEdit: React.FC<CustomerUserEditProps> = (props) => {
  const {title, submitText, customer, allowOwnerRoleSelection, existingUsers, readonly, onSubmitted, onClose} = props;
  const isEdit = props.initialValues?.user != null;
  
  const [saveState, save] = useApiSend(updateCustomerUser);
  const [submitContext, setSubmitContext] = useState<SubmitContext | null>(null);
  
  const initialValues: UserEditFormValues = {
    userId: props.initialValues?.user?.id ?? null,
    role: props.initialValues?.role ?? CustomerUserRole.User,
    isActive: props.initialValues?.isActive ?? true
  }
  
  const classes = useStyles();
  
  const handleValidate = async (values: FormikValues) => {
    const context = {
      isEdit: isEdit, 
      existingUserIds: existingUsers.map(user => user.id)
    };

    try {
      await validateYupSchema<FormikValues>(values, customerUserSchema, false, context);
    } catch (err) {
      return yupToFormErrors(err);
    }
    
    return {};
  };
  
  const handleSubmit = async (values: UserEditFormValues, {setSubmitting}: FormikHelpers<UserEditFormValues>) => {
    save({customerId: customer?.id!, userId: values.userId!, role: values.role, isActive: values.isActive});
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
                <Field component={UserSelect}
                       variant="filled"
                       name="userId"
                       label="User"
                       helperText=" "
                       fullWidth 
                       initialUser={props.initialValues?.user} 
                       readonly={isEdit} 
                       customer={customer}/>
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


export default CustomerUserEdit;