import axiosInstance from "@/api/axiosInstances";

export const sendManyNotifications = async (data: {
  type: "email" | "push";
  subject: string;
  message: string;
}) => {
  const response = await axiosInstance.post(`/notifications`, data);
  return response.data;
};

/** Which entity the id refers to (selects `/notifications/{segment}/:id`). */
export type SendOneNotificationRecipient =
  | "user"
  | "vendor"
  | "fleet"
  | "rider";

const recipientToSegment = (
  recipient: SendOneNotificationRecipient,
): string => {
  switch (recipient) {
    case "vendor":
      return "vendors";
    case "fleet":
      return "fleets";
    case "rider":
      return "riders";
    default:
      return "users";
  }
};

export const sendOneNotification = async (
  id: string,
  data: {
    type: "email" | "push";
    subject: string;
    message: string;
  },
  recipient: SendOneNotificationRecipient = "user",
) => {
  const segment = recipientToSegment(recipient);
  const response = await axiosInstance.post(
    `/notifications/${segment}/${id}`,
    data,
  );
  return response.data;
};
