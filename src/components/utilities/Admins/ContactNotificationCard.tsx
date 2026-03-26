import { useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  useSendOneNotification,
  type SendOneNotificationRecipient,
} from "@/api/admin/notification/useNotification";

type Mode = "email-only" | "email-and-push";

export function ContactNotificationCard({
  entityId,
  recipient,
  mode,
  description,
}: {
  entityId: string;
  recipient: SendOneNotificationRecipient;
  mode: Mode;
  description?: string;
}) {
  const { mutate: sendOneNotification, isPending } = useSendOneNotification();
  const [message, setMessage] = useState("");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [messageType, setMessageType] = useState<"email" | "push">("email");

  const handleSend = () => {
    const body = message.trim();
    if (!body) {
      toast.error("Message is required.");
      return;
    }
    if (!entityId) return;

    const effectiveType = mode === "email-only" ? "email" : messageType;
    const subject =
      effectiveType === "email"
        ? notificationSubject.trim()
        : notificationSubject.trim() || "Notification";
    if (effectiveType === "email" && !subject) {
      toast.error("Subject is required for email.");
      return;
    }

    sendOneNotification(
      {
        id: entityId,
        recipient,
        data: {
          type: effectiveType,
          subject,
          message: body,
        },
      },
      {
        onSuccess: () => {
          setMessage("");
          setNotificationSubject("");
        },
      },
    );
  };

  const needsSubject =
    mode === "email-only" ||
    (mode === "email-and-push" && messageType === "email");
  const canSend =
    Boolean(message.trim()) &&
    (needsSubject ? Boolean(notificationSubject.trim()) : true);

  return (
    <Card className="bg-secondary py-4">
      <CardHeader>
        <CardTitle>Contact</CardTitle>
        <CardDescription>
          {description ??
            (mode === "email-only"
              ? "Send an email to this account."
              : "Send an email or push notification.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "email-and-push" ? (
          <RadioGroup
            value={messageType}
            onValueChange={(v) => setMessageType(v as "email" | "push")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id={`cn-email-${recipient}`} />
              <Label
                htmlFor={`cn-email-${recipient}`}
                className="flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" id={`cn-push-${recipient}`} />
              <Label
                htmlFor={`cn-push-${recipient}`}
                className="flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                Push
              </Label>
            </div>
          </RadioGroup>
        ) : null}

        {mode === "email-only" || messageType === "email" ? (
          <div className="space-y-2">
            <Label htmlFor={`cn-subject-${recipient}`}>Subject</Label>
            <Input
              id={`cn-subject-${recipient}`}
              value={notificationSubject}
              onChange={(e) => setNotificationSubject(e.target.value)}
              placeholder="e.g., Account update"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`cn-title-${recipient}`}>Title (optional)</Label>
            <Input
              id={`cn-title-${recipient}`}
              value={notificationSubject}
              onChange={(e) => setNotificationSubject(e.target.value)}
              placeholder="Defaults to “Notification” if empty"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`cn-message-${recipient}`}>Message</Label>
          <Textarea
            id={`cn-message-${recipient}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message…"
            rows={5}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSend}
          disabled={!canSend || isPending || !entityId}
        >
          <Send className="w-4 h-4 mr-2" />
          {isPending ? "Sending…" : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
}
