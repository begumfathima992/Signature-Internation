import { createContext, useContext } from 'react';

export const ToastContext = createContext({ success: () => {}, error: () => {} });

export function useToast() {
  return useContext(ToastContext);
}
