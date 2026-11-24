import useForm from "../../hooks/useForm";
import FormField from "../ui/FormField";
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

export default function CheckoutForm({ onSubmit, onBack }) {
  const { fieldProps, handleSubmit } = useForm(initialValues, validate);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <FormField label="Full name" {...fieldProps("name")} />
        <FormField label="Email" type="email" {...fieldProps("email")} />
        <FormField label="Phone number" type="tel" {...fieldProps("phone")} />
        <FormField label="Delivery address" multiline {...fieldProps("address")} />
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