import { z } from "zod";

export const FleetManagerRegFormSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
    businessName: z.string().min(1, "Business name is required"),
    phoneNumber: z
      .string()
      .min(6, "Phone number must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AddDriverFormSchema = z.object({
  FullName: z.string().min(1, "Full name is required"),
  DoB: z.string().min(1, "Date of birth is required"),
  Gender: z.string().min(1, "Gender is required"),
  ContactNumber: z.string().min(1, "Contact number is required"),
  HomeAddress: z.string().min(1, "Home address is required"),
  EmergencyContactInformation: z
    .string()
    .min(1, "Emergency contact information is required"),
  DriverLicence: z
    .any()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "A valid driver’s license image is required",
      }
    ),
});
