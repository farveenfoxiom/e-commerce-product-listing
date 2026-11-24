import { useState } from "react";
import Button from "../ui/Button";

const initialValues = { name: "", email: "", phone: "", address: "" };

// Returns an object of error messages (empty object = valid)
function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^\d{10}$/.test(v.phone.replace(/[\s-]/g, ""))) errors.phone = "Enter a 10-digit phone number.";
  if (v.address.trim().length < 10) errors.address = "Enter your full address (at least 10 characters).";
  return errors;
}

function Field({ label, name, value, error, onChange, onBlur, type = "text", multiline = false }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 3 : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ onSubmit, onBack }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const errors = validate(values);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show every error if the user submits early
    setTouched({ name: true, email: true, phone: true, address: true });
    if (Object.keys(errors).length === 0) onSubmit(values);
  };

  const props = (name) => ({
    name,
    value: values[name],
    error: touched[name] ? errors[name] : undefined,
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Field label="Full name" {...props("name")} />
        <Field label="Email" type="email" {...props("email")} />
        <Field label="Phone number" type="tel" {...props("phone")} />
        <Field label="Delivery address" multiline {...props("address")} />
      </div>

      <div className="flex gap-2 border-t border-slate-200 p-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Place order
        </Button>
      </div>
    </form>
  );
}