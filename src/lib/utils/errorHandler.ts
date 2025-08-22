import { toast } from 'sonner';

export const handleError = (error: unknown, defaultMsg = 'Something went wrong') => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else if (typeof error === 'string') {
    toast.error(error);
  } else {
    toast.error(defaultMsg);
  }
};