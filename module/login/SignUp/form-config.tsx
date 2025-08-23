import * as Yup from "yup";

export interface ISignUpForm {
  email: string;
  password: string;
  fullName: string;
}

export function getValidationSignUpSchema(): Yup.ObjectSchema<ISignUpForm> {
  return Yup.object().shape({
    fullName: Yup.string()
      .min(2, "common.full_name_min") // Minimum 2 characters for the full name
      .max(50, "common.full_name_max") // Maximum 50 characters for the full name
      .required("common.full_name_empty"), // Ensures full name is not empty
    email: Yup.string()
      .email("common.email_invalid") // Validates if the value is a valid email
      .max(60, "common.email_max") // Restricts email to a maximum length of 60 characters
      .required("common.email_empty"), // Ensures email is not empty

    password: Yup.string()
      .min(6, "common.password_min") // Minimum 6 characters for the password
      .max(30, "common.password_max") // Maximum 30 characters for the password
      .required("common.password_empty"), // Ensures password is not empty
  });
}
