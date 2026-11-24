import { AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
      <h3 className="font-semibold text-red-700">Something went wrong</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}