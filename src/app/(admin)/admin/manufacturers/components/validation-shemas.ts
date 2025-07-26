import { z } from "zod";

// Helper regex patterns
const namePattern = /^[a-zA-Z\s\-'\.]+$/;
const phonePattern = /^[\+]?[0-9\s\-\(\)]+$/;

// Common form schema with enhanced validation
const commonFormSchema = {
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long.")
        .max(50, "Name must not exceed 50 characters.")
        .regex(namePattern, "Name can only contain letters, spaces, hyphens, and apostrophes."),
    
    contactPerson: z
        .string()
        .min(3, "Contact person name is required.")
        .max(50, "Contact person name must not exceed 50 characters.")
        .regex(namePattern, "Contact person name can only contain letters, spaces, hyphens, and apostrophes."),
    
    email: z
        .string()
        .email("Please enter a valid email address.")
        .max(100, "Email must not exceed 100 characters."),
    
    phone: z
        .string()
        .optional()
        .refine((val) => !val || phonePattern.test(val), {
            message: "Phone number can only contain numbers, spaces, hyphens, parentheses, and + symbol."
        })
        .refine((val) => !val || val.length >= 10, {
            message: "Phone number must be at least 10 characters long."
        }),
    
    country: z.string().min(1, "Country is required."),
};

// Create schema for adding manufacturer
export const createSchema = z.object({
    ...commonFormSchema,
    logo: z
        .instanceof(File, { message: "A logo image is required." })
        .refine((file) => file.size > 0, "A logo image is required.")
        .refine((file) => file.size <= 5000000, "File size must be less than 5MB.")
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            "Only JPG, JPEG, and PNG files are allowed."
        ),
});

// Update schema for editing manufacturer
export const updateSchema = z.object({
    ...commonFormSchema,
    logo: z
        .union([
            z.string().url("Invalid logo URL"), 
            z.instanceof(File).refine((file) => file.size <= 5000000, "File size must be less than 5MB.")
        ])
        .optional(),
});

export type CreateFormSchemaType = z.infer<typeof createSchema>;
export type UpdateFormSchemaType = z.infer<typeof updateSchema>;