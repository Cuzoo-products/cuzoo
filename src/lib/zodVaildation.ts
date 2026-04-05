import { z } from "zod";
import {
  zInternationalPhoneCompact,
  zInternationalPhoneCompactOrEmpty,
} from "@/lib/phone";

export const FleetManagerRegFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    businessName: z.string().min(1, "Business name is required"),
    phoneNumber: zInternationalPhoneCompact,
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const VendorRegistrationFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    businessName: z.string().min(1, "Business name is required"),
    phoneNumber: zInternationalPhoneCompact,
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
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

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const AddDriverFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: zInternationalPhoneCompact,
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select a gender",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  emergencyContact: zInternationalPhoneCompact,
  vehicleId: z.string().optional(),
  passport: z
    .string()
    .min(1, "Passport image is required.")
    .refine(
      (val) => val.startsWith("data:image/"),
      "Please upload a valid image file."
    ),
  driversLicense: z
    .string()
    .min(1, "Driver's license image is required.")
    .refine(
      (val) => val.startsWith("data:image/"),
      "Please upload a valid image file."
    ),
  address: z
    .string()
    .min(1, "Address is required")
    .refine(
      (val) => val.startsWith("ChIJ") || val.startsWith("Ei"),
      "Please select a valid address from the dropdown."
    ),
});

export const AddVehicleFormSchema = z.object({
  color: z.string().min(1, "Color is required"),
  type: z.enum(["car", "bike", "truck", "bicycle", "van", "tricycle"], {
    required_error: "Please select a vehicle type",
  }),
  model: z.string().min(1, "Model is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  riderId: z.string().optional(),
  image: z
    .string()
    .min(1, "Vehicle image is required.")
    .refine(
      (val) => val.startsWith("data:image/"),
      "Please upload a valid image file."
    ),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  status: z.enum(["in use", "disabled", "under maintenance", "available"], {
    required_error: "Please select a vehicle status",
  }),
});

export const EditVehicleFormSchema = z.object({
  color: z.string().min(1, "Color is required"),
  type: z.enum(["car", "bike", "truck", "bicycle", "van", "tricycle"]),
  model: z.string().min(1, "Model is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  riderId: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("data:image/") || val.startsWith("http"),
      "Please upload a valid image file or keep existing image."
    ),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  status: z.enum(["in use", "disabled", "under maintenance", "available"], {
    required_error: "Please select a vehicle status",
  }),
});

export const EditDriverFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select a gender",
  }),
  passport: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("data:image/") || val.startsWith("http"),
      "Please upload a valid image file or keep existing image."
    ),
  driversLicense: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("data:image/") || val.startsWith("http"),
      "Please upload a valid image file or keep existing image."
    ),
  address: z
    .string()
    .min(1, "Address is required")
    .refine(
      (val) =>
        val.startsWith("ChIJ") || val.startsWith("Ei") || val.length > 10,
      "Please select a valid address from the dropdown or enter a complete address."
    ),
  phoneNumber: zInternationalPhoneCompact,
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  emergencyContact: zInternationalPhoneCompact,
});

export const FleetManagerProfileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  businessName: z.string().min(1, "Business name is required"),
  phoneNumber: zInternationalPhoneCompactOrEmpty,
  registrationNumber: z.string().optional(),
  tinNumber: z.string().optional(),
  dateOfIncorporation: z.string().optional(),
  placeOfIncorporation: z.string().optional(),
  companyType: z.string().optional(),
  approvalStatus: z.string().optional(),
});

export const VendorProfileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  businessName: z.string().min(1, "Business name is required"),
  phoneNumber: zInternationalPhoneCompact,
  storeCode: z.string().optional(),
  registrationNumber: z.string().optional(),
  dateOfIncorporation: z.string().optional(),
  placeOfIncorporation: z.string().optional(),
  businessType: z.string().optional(),
  address: z.string().optional(),
  typeOfGoodsSold: z.string().optional(),
  approvalStatus: z.string().optional(),
});

export const FleetManagerChangePWSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    password: z
      .string()
      .min(6, "New Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const CategoryFormSchema = z.object({
  CategoryName: z.string().min(1, "Category Name is required"),
  CategoryIcon: z.string().min(1, "Category Icon is required"),
});

export const EditProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce
    .number()
    .min(1, "Price is required")
    .refine((val) => val > 0, { message: "Price must be a positive number" }),
  stock: z.coerce
    .number()
    .min(0, "Stock must be 0 or more")
    .int({ message: "Stock must be a valid integer (0 or more)" }),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  image1: z.string().optional(),

  image2: z.string().optional(),

  image3: z.string().optional(),

  image4: z.string().optional(),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce
    .number()
    .min(1, "Price is required")
    .refine((val) => val > 0, { message: "Price must be a positive number" }),
  stock: z.coerce
    .number()
    .min(0, "Stock must be 0 or more")
    .int({ message: "Stock must be a valid integer (0 or more)" }),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  image1: z
    .string()
    .min(1, "Image 1 is required")
    .refine(
      (val) => val.startsWith("data:image/"),
      "Please upload a valid image file."
    ),
  image2: z.string().optional(),
  image3: z.string().optional(),
  image4: z.string().optional(),
});

/** File upload or existing string — must be present when required (matches Vendor KYC). */
export function kycRequiredDocument(message: string) {
  return z.any().refine(
    (val: unknown) => {
      if (val == null) return false;
      if (typeof val === "string" && val.trim().length > 0) return true;
      if (val instanceof FileList && val.length > 0) return true;
      if (val instanceof File) return true;
      return false;
    },
    { message },
  );
}

export const fleetKycformSchema = z.object({
  registrationNumber: z.string().min(1, "RC / Registration number is required"),
  tinNumber: z.string().min(1, "Tax Identification Number is required"),
  dateOfIncorporation: z.date({
    required_error: "Date of incorporation is required",
    invalid_type_error: "Date of incorporation is required",
  }),
  placeOfIncorporation: z.string().min(1, "Place of incorporation is required"),
  companyType: z.string().min(1, "Type of company is required"),
  directors: z
    .array(z.string().min(1, "Each director name is required"))
    .min(1, "At least one director is required"),
  servicesRendered: z
    .array(z.string())
    .min(1, "Select at least one courier service"),
  insuranceCoverage: z
    .array(z.string())
    .min(1, "Select at least one insurance type"),
  passport: kycRequiredDocument("Passport photograph is required"),
  certificateOfIncorporation: kycRequiredDocument(
    "Certificate of incorporation is required",
  ),
  governmentApprovedId: kycRequiredDocument(
    "Government approved ID is required",
  ),
  proofOfAddress: kycRequiredDocument("Proof of address is required"),
  insuranceCertificate: kycRequiredDocument(
    "Insurance certificate is required",
  ),
  courierLicense: kycRequiredDocument("Courier license is required"),
});
