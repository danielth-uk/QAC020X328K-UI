import * as Yup from "yup";

export const validationErrors = {
  required: ":1 is required.",
  min: ":1 must be at least :2 characters long.",
  max: ":1  must be less than :2 characters long.",
  email: ":1 must be a valid email.",
  matches: ":1 is not valid.",
  invalidCredentials: "These credentials do not match our records.",
  space: ":1 cannot contain spaces",
  characters: "Invalid Characters in :1"
};

export const validationError = (rule, ...props) => {
  const errorMessage = validationErrors[rule];
  return props.reduce(
    (acc, prop, index) => acc.replace(`:${index + 1}`, prop.toString()),
    errorMessage
  );
};

const usernameValidation = () => {
    Yup.string()
    .required(validationError("required"))
    .min(8, validationError("min", 8))
    .max(255, validationError("max", 255))
    .matches(/^[a-zA-Z0-9_.-]*$/, validationError("characters", "username"))

};

const passwordValidationRule = () =>
  Yup.string()
    .required(validationError("required"))
    .min(8, validationError("min", 8))
    .max(255, validationError("max", 255));

const availableValidation = {
  username: usernameValidation,
  password: passwordValidationRule
};

const validate = (rule) => {
  availableValidation[rule]();
};

export default validate;
