import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  // err is the error we receive when validation go to catch(err). inner (if we put a console.log) is where our errors is, on err, and its an array. So, we go to scroll this errors (using forEach) and, for each error, we go to instance a var with error.path (the field name of the input that is in error) with the error.message
  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
