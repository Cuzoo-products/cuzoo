import { z } from "zod";

export const FleetManagerRegFormSchema = z
  .object({
    businessEmail: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
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
  AssignVehicle: z.string().optional(),
});

export const AddVehicleFormSchema = z.object({
  VehicleType: z.string().min(1, "Please select a vehicle type"),
  Make: z.string().min(1, "Make is required"),
  Model: z.string().min(1, "Model is required"),
  ChassisNumber: z.string().min(1, "Chassis Number is required"),
  EngineNumber: z.string().min(1, "Engine Number is required"),
  Year: z
    .string()
    .min(4, "Enter a valid year")
    .regex(/^\d{4}$/, "Year must be a 4-digit number"),
  Color: z.string().min(1, "Color is required"),
  LicensePlateNumber: z.string().min(1, "License plate number is required"),
  AssignedDriver: z.string().optional(),
  VehicleStatus: z.enum([
    "Available",
    "In Use",
    "Under Maintenance",
    "Disabled",
  ]),
  VehicleImage: z.string().url("Vehicle image must be a valid URL").optional(),
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
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  dateOfIncorporation: z.date({
    required_error: "Date of incorporation is required.",
  }),
  placeOfIncorporation: z
    .string()
    .min(2, "Place of incorporation is required."),
  registrationNumber: z.string().min(5, "A valid RC Number is required."),
  companyType: z.string({ required_error: "Please select a company type." }),
  registeredAddress: z
    .string()
    .min(10, "Address must be at least 10 characters long."),
  proofOfAddressType: z.string({
    required_error: "Please select a proof of address type.",
  }),
  taxIdNumber: z
    .string()
    .min(10, "TIN must be at least 10 characters.")
    .max(14, "TIN cannot exceed 14 characters."),
  insuranceCoverage: z.string({
    required_error: "Please select an insurance type.",
  }),
  courierServices: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one service.",
    }),
  directors: z
    .array(
      z.object({
        name: z.string().min(2, "Director name is required."),
      })
    )
    .min(1, "You must add at least one director.")
    .max(2, "You can add a maximum of two directors."),
  authorizedRepresentative: z.object({
    name: z.string().min(2, "Representative name is required."),
    nationality: z.string().min(2, "Nationality is required."),
    state: z.string().min(2, "State is required."),
    lga: z.string().min(2, "LGA is required."),
    address: z.string().min(10, "Address is required."),
    position: z.string().min(2, "Position is required."),
  }),

  // File Upload Fields
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
  passportPhotograph: z
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
  governmentId: z
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
  proofOfAddressDoc: z
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
