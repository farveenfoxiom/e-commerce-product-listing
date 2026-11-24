import { useState } from "react";

// Small form helper: values, touched fields and validation in one place
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const errors = validate(values);

  // Props to spread into <FormField />
  const fieldProps = (name) => ({
    name,
    value: values[name],
    error: touched[name] ? errors[name] : undefined,
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    // Show every error if the user submits early
    setTouched(Object.fromEntries(Object.keys(initialValues).map((key) => [key, true])));
    if (Object.keys(errors).length === 0) onValid(values);
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
  };

  return { fieldProps, handleSubmit, reset };
}