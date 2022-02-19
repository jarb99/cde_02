import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Dialog, DialogActions, DialogContent, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import { FormikHelpers } from "formik/dist/types";
import { updateUser } from "../../api/API";
import { AxiosError } from "axios";
import FormActions from "../../components/FormActions";
import DialogHeader from "../../components/DialogHeader";
import PersonIcon from "@material-ui/icons/Person";


export interface UserEditFields {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserEditDialogProps extends UserEditFields {
  open: boolean;
  onCancel: () => void;
  onSubmitted: (values: UserEditFields) => void;
}

const userSchema = Yup.object().shape({
  firstName:
    Yup.string()
    .max(255, "Too long")
    .required("Required"),

  lastName:
    Yup.string()
    .max(255, "Too long")
    .required("Required"),

  email:
    Yup.string()
    .email("Invalid email address")
    .max(255, "Too long")
    .required("Required")
});

const UserEditDialog: React.FC<UserEditDialogProps> = (props: UserEditDialogProps) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [error, setError] = useState<{ message: string, status: number | undefined } | null>(null);

  type FormValues = Omit<UserEditFields, "userId">;

  const initialValues: FormValues = {
    firstName: props.firstName,
    lastName: props.lastName,
    email: props.email
  };

  const handleSubmit = async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
    try {
      setError(null);
      await updateUser(props.userId, values);
      props.onSubmitted({userId: props.userId, ...values});
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        setError({message: axiosError.message, status: axiosError.response?.status});
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({submitForm, isSubmitting}) => (
        <Dialog fullWidth={true}
                open={props.open}
                onClose={props.onCancel}
                fullScreen={smDown}>
          <DialogHeader title="Edit User"
                        avatar={<PersonIcon/>}
                        onClose={props.onCancel}
                        showProgress={isSubmitting}
                        disableClose={isSubmitting}/>
          <DialogContent>
            <Form>
              <Grid container item direction="row" justify="flex-start" alignItems="flex-start" spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field component={TextField}
                         variant="filled"
                         name="firstName"
                         type="text"
                         label="First Name"
                         helperText=" "
                         fullWidth
                         autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field component={TextField}
                         variant="filled"
                         name="lastName"
                         type="text"
                         label="Last Name"
                         helperText=" "
                         fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field component={TextField}
                         variant="filled"
                         type="email"
                         label="Email"
                         name="email"
                         helperText=" "
                         fullWidth
                  />
                </Grid>
              </Grid>
            </Form>
          </DialogContent>
          <DialogActions>
            <FormActions disabled={isSubmitting}
                         submitErrorMessage={error?.message}
                         onSubmit={submitForm}
                         onCancel={props.onCancel}/>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};

export default UserEditDialog;