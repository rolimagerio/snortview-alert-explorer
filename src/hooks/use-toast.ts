
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast as useToastInternal,
  toast as toastInternal,
} from "@/components/ui/toaster"

export const useToast = useToastInternal
export const toast = toastInternal

export type { Toast, ToastActionElement, ToastProps }
