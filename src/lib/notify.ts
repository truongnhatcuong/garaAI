import { toast } from "sonner";

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  toast.error(message);
  return message;
}
