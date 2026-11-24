import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import useForm from "../hooks/useForm";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

const initialValues = { name: "", email: "", message: "" };

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (v.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { fieldProps, handleSubmit, reset } = useForm(initialValues, validate);

  // No backend: we simulate sending the message
  const onValid = () => setSent(true);

  const sendAnother = () => {
    reset();
    setSent(false);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="mb-6 text-slate-500">Questions about an order or a product? Send us a message.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <h2 className="text-xl font-semibold">Message sent</h2>
            <p className="text-slate-500">Thanks for reaching out. We will reply soon.</p>
            <Button variant="outline" onClick={sendAnother}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
            <FormField label="Name" {...fieldProps("name")} />
            <FormField label="Email" type="email" {...fieldProps("email")} />
            <FormField label="Message" multiline {...fieldProps("message")} />
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}