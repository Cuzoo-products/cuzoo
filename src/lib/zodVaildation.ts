import { z } from "zod";

export const FleetManagerRegFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    businessName: z.string().min(1, "Business name is required"),
    phoneNumber: z
      .string()
      .min(6, "Phone number must be at least 6 characters"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    tinNumber: z.string().min(1, "TIN number is required"),
    dateOfIncorporation: z.string().min(1, "Date of incorporation is required"),
    placeOfIncorporation: z
      .string()
      .min(1, "Place of incorporation is required"),
    companyType: z.string().min(1, "Company type is required"),
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
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^\+[1-9]\d{1,14}$/,
        "Please enter a valid international phone number (e.g., +2348000000000)"
      ),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
    businessType: z.string().min(1, "Business type is required"),
    logo: z
      .string()
      .min(1, "Business logo is required")
      .refine(
        (val) => val.startsWith("data:image/"),
        "Please upload a valid image file."
      ),
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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select a gender",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
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
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Please enter a valid international phone number (e.g., +2348140231245)"
    ),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  emergencyContact: z
    .string()
    .min(1, "Emergency contact is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Please enter a valid international phone number (e.g., +2348140231245)"
    ),
});

export const FleetManagerProfileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  businessName: z.string().min(1, "Business name is required"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 characters"),
});

export const FleetManagerChangePWSchema = z
  .object({
    oldPassword: z.string().min(1, "Olid password is required"),
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
  CategoryIcon: z
    .any()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "A valid image is required",
      }
    ),
});

export const ProductFormSchema = z.object({
  ProductName: z.string().min(1, "Product name is required"),
  Category: z.string().min(1, "Category is required"),
  Price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  Stock: z
    .string()
    .min(1, "Stock is required")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) >= 0, {
      message: "Stock must be a valid integer (0 or more)",
    }),
  ShortDescription: z.string().min(1, "Short description is required"),
  LongDescription: z.string().min(1, "Long description is required"),

  // Images: Image1 is required, others are optional
  Image1: z
    .any()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "A valid image is required",
      }
    ),

  Image2: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "Invalid image",
      }
    ),

  Image3: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "Invalid image",
      }
    ),

  Image4: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File || (typeof window !== "undefined" && file?.uri),
      {
        message: "Invalid image",
      }
    ),
});

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export const fleetKycformSchema = z.object({
  registrationNumber: z.string().min(5, "A valid RC Number is required."),
  tinNumber: z
    .string()
    .min(10, "TIN must be at least 10 characters.")
    .max(14, "TIN cannot exceed 14 characters."),
  dateOfIncorporation: z.date({
    required_error: "Date of incorporation is required.",
  }),
  placeOfIncorporation: z
    .string()
    .min(2, "Place of incorporation is required."),
  companyType: z.string({ required_error: "Please select a company type." }),
  directors: z.array(z.string()).min(1, "You must add at least one director."),
  servicesRendered: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one service.",
    }),
  insuranceCoverage: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one insurance coverage.",
    }),

  // File Upload Fields
  passport: z
    .any()
    .refine((files) => files?.length == 1, "Passport photograph is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, and .png files are accepted."
    ),
  certificateOfIncorporation: z
    .any()
    .refine(
      (files) => files?.length == 1,
      "Certificate of Incorporation is required."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .jpg, .jpeg, and .png files are accepted."
    ),
  governmentApprovedId: z
    .any()
    .refine((files) => files?.length == 1, "Government-issued ID is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .jpg, .jpeg, and .png files are accepted."
    ),
  proofOfAddress: z
    .any()
    .refine(
      (files) => files?.length == 1,
      "Proof of Address document is required."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .jpg, .jpeg, and .png files are accepted."
    ),
  insuranceCertificate: z
    .any()
    .refine((files) => files?.length == 1, "Insurance Certificate is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .jpg, .jpeg, and .png files are accepted."
    ),
  courierLicense: z
    .any()
    .refine((files) => files?.length == 1, "Courier License is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .jpg, .jpeg, and .png files are accepted."
    ),
});
