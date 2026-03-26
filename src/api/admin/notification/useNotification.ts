import { useMutation } from "@tanstack/react-query";
import {
  sendManyNotifications,
  sendOneNotification,
  type SendOneNotificationRecipient,
} from "./notification";
import { toast } from "sonner";

export type { SendOneNotificationRecipient };
export const useSendManyNotifications = () => {
  return useMutation({
    mutationFn: (data: {
      type: "email" | "push";
      subject: string;
      message: string;
    }) => sendManyNotifications(data),
    onSuccess: () => {
      toast.success("Notifications sent successfully");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to send notifications.");
    },
  });
};

export const useSendOneNotification = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
      recipient = "user",
    }: {
      id: string;
      data: {
        type: "email" | "push";
        subject: string;
        message: string;
      };
      recipient?: SendOneNotificationRecipient;
    }) => sendOneNotification(id, data, recipient),
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to send notification.");
    },
  });
};
